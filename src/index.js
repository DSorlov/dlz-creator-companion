const { InstanceBase, InstanceStatus, runEntrypoint } = require('@companion-module/base')
const io = require('socket.io-client')
const { getActions } = require('./actions')
const { getFeedbacks } = require('./feedbacks')
const { getVariables } = require('./variables')
const { getPresets } = require('./presets')
const { upgradeScripts } = require('./upgrades')

class MackieDLZCreatorInstance extends InstanceBase {
	constructor(internal) {
		super(internal)

		this.socket = null
		this.reconnectTimer = null
		this.state = {
			channels: {},
			meters: {},
			config: {},
			routing: {},
		}
	}

	async init(config) {
		this.config = config
		this.updateStatus(InstanceStatus.Connecting)

		this.initActions()
		this.initFeedbacks()
		this.initVariables()
		this.initPresets()

		this.connect()
	}

	async destroy() {
		if (this.reconnectTimer) {
			clearTimeout(this.reconnectTimer)
			this.reconnectTimer = null
		}

		if (this.socket) {
			this.socket.disconnect()
			this.socket = null
		}
	}

	async configUpdated(config) {
		this.config = config
		this.destroy()
		this.init(config)
	}

	getConfigFields() {
		return [
			{
				type: 'static-text',
				id: 'info',
				width: 12,
				label: 'Information',
				value: 'This module connects to the Mackie DLZ Creator via its web interface.',
			},
			{
				type: 'textinput',
				id: 'host',
				label: 'Target IP',
				width: 8,
				default: '192.168.8.30',
				regex: this.REGEX_IP,
			},
			{
				type: 'number',
				id: 'port',
				label: 'Target Port',
				width: 4,
				default: 80,
				min: 1,
				max: 65535,
			},
		]
	}

	connect() {
		if (this.socket) {
			this.socket.disconnect()
		}

		const url = `http://${this.config.host}:${this.config.port}`

		this.log('info', `Connecting to ${url}`)

		this.socket = io(url, {
			reconnection: true,
			reconnectionDelay: 1000,
			reconnectionDelayMax: 5000,
			reconnectionAttempts: Infinity,
			transports: ['websocket', 'polling'],
		})

		this.socket.on('connect', () => {
			this.log('info', 'Connected')
			this.updateStatus(InstanceStatus.Ok)

			// Request initial state
			this.socket.emit('getConfig')
			this.socket.emit('getRouting')
		})

		this.socket.on('disconnect', (reason) => {
			this.log('warn', `Disconnected: ${reason}`)
			this.updateStatus(InstanceStatus.Disconnected)
		})

		this.socket.on('connect_error', (error) => {
			this.log('error', `Connection error: ${error.message}`)
			this.updateStatus(InstanceStatus.ConnectionFailure)
		})

		// Handle channel parameter updates
		this.socket.on('channelState', (data) => {
			this.handleChannelState(data)
		})

		// Handle VU meter updates
		this.socket.on('VU', (data) => {
			this.handleVUUpdate(data)
		})

		// Handle player status updates
		this.socket.on('playerState', (data) => {
			this.handlePlayerState(data)
		})

		// Handle recording status updates
		this.socket.on('recordState', (data) => {
			this.handleRecordState(data)
		})

		// Handle sample playback status updates
		this.socket.on('sampleState', (data) => {
			this.handleSampleState(data)
		})

		// Handle system status updates
		this.socket.on('systemState', (data) => {
			this.handleSystemState(data)
		})
	}

	handleChannelState(data) {
		this.log('debug', `Received channelState: ${JSON.stringify(data)}`)

		// channelState format: { id: 'i.0.mix', value: 0.75 }
		if (data && data.id !== undefined && data.value !== undefined) {
			const key = data.id
			const value = data.value

			this.state.channels[key] = value

			if (key.endsWith('.mute')) {
				this.checkFeedbacks('channel_mute')
			} else if (key.endsWith('.solo')) {
				this.checkFeedbacks('channel_solo')
			} else if (key.endsWith('.mix')) {
				this.checkFeedbacks('fader_level')
			}

			this.updateVariables()
		}
	}

	handleVUUpdate(data) {
		// VU data format: { 'i.0.vu': value, 'i.1.vu': value, ... }
		if (data && typeof data === 'object' && !Array.isArray(data)) {
			for (const [key, value] of Object.entries(data)) {
				const match = key.match(/^((i|p|m|a|f)\.\d+)\.vu$/)
				if (match) {
					const ch = match[1]
					if (!this.state.meters[ch]) {
						this.state.meters[ch] = { level: -60, peak: -60 }
					}
					this.state.meters[ch].level = value
				}
			}

			this.checkFeedbacks('vu_level')
			this.updateVariables()
		}
	}

	handlePlayerState(data) {
		this.log('debug', `Received playerState: ${JSON.stringify(data)}`)

		// playerState format: { player: 0, status: 'playing', position: 30.5, duration: 120.0 }
		if (data && data.player !== undefined) {
			const playerKey = `player.${data.player}`
			if (data.status !== undefined) {
				const statusMap = { stopped: 2, playing: 3, end: 4, paused: 5 }
				this.state.channels[`${playerKey}.state`] = statusMap[data.status] !== undefined ? statusMap[data.status] : 0
			}
			if (data.position !== undefined) {
				this.state.channels[`${playerKey}.pos`] = data.position
			}
			if (data.duration !== undefined) {
				this.state.channels[`${playerKey}.duration`] = data.duration
			}
			this.updateVariables()
		}
	}

	handleRecordState(data) {
		this.log('debug', `Received recordState: ${JSON.stringify(data)}`)

		// recordState format: { status: 'recording', time: 30.5, destination: 'usb' }
		if (data) {
			if (data.status !== undefined) {
				const statusMap = { ready: 0, recording: 1, paused: 2, saving: 3, saved: 4, full: 5 }
				this.state.channels['recState'] = statusMap[data.status] !== undefined ? statusMap[data.status] : 0
			}
			if (data.time !== undefined) {
				this.state.channels['recTime'] = data.time
			}
			this.updateVariables()
		}
	}

	handleSampleState(data) {
		this.log('debug', `Received sampleState: ${JSON.stringify(data)}`)

		// sampleState format: { bank: 0, pad: 0, playing: true }
		if (data && data.bank !== undefined && data.pad !== undefined) {
			const key = `B.${data.bank}.${data.pad}.state`
			this.state.channels[key] = data.playing ? 3 : 2
			this.checkFeedbacks('sample_state')
			this.updateVariables()
		}
	}

	handleSystemState(data) {
		this.log('debug', `Received systemState: ${JSON.stringify(data)}`)

		// systemState format: { 'bluetooth.status': 3 } or { 'ndi.enable': 1 }
		if (data && typeof data === 'object') {
			for (const [key, value] of Object.entries(data)) {
				this.state.channels[`settings.${key}`] = value
			}
			this.checkFeedbacks()
			this.updateVariables()
		}
	}

	setParameter(key, value) {
		if (this.socket && this.socket.connected) {
			// Send parameter using channelCtl event (DLZ protocol)
			this.socket.emit('channelCtl', { id: key, value: value })
			this.log('debug', `Set parameter: ${key} = ${value}`)
		} else {
			this.log('warn', 'Cannot set parameter: not connected')
		}
	}

	sendPlayerCtl(player, command, args) {
		if (this.socket && this.socket.connected) {
			this.socket.emit('playerCtl', Object.assign({ player: player, command: command }, args || {}))
			this.log('debug', `Sent playerCtl: player=${player} command=${command}`)
		} else {
			this.log('warn', 'Cannot send playerCtl: not connected')
		}
	}

	sendSampleCtl(args) {
		if (this.socket && this.socket.connected) {
			this.socket.emit('sampleCtl', args)
			this.log('debug', `Sent sampleCtl: ${JSON.stringify(args)}`)
		} else {
			this.log('warn', 'Cannot send sampleCtl: not connected')
		}
	}

	sendRecordCtl(command, args) {
		if (this.socket && this.socket.connected) {
			this.socket.emit('recordCtl', Object.assign({ command: command }, args || {}))
			this.log('debug', `Sent recordCtl: command=${command}`)
		} else {
			this.log('warn', 'Cannot send recordCtl: not connected')
		}
	}

	sendSnapshotCtl(command, snapshot) {
		if (this.socket && this.socket.connected) {
			this.socket.emit('snapshotCtl', { command: command, snapshot: snapshot })
			this.log('debug', `Sent snapshotCtl: command=${command} snapshot=${snapshot}`)
		} else {
			this.log('warn', 'Cannot send snapshotCtl: not connected')
		}
	}

	sendSystemCtl(command, args) {
		if (this.socket && this.socket.connected) {
			this.socket.emit('systemCtl', Object.assign({ command: command }, args || {}))
			this.log('debug', `Sent systemCtl: command=${command}`)
		} else {
			this.log('warn', 'Cannot send systemCtl: not connected')
		}
	}

	initActions() {
		this.setActionDefinitions(getActions(this))
	}

	initFeedbacks() {
		this.setFeedbackDefinitions(getFeedbacks(this))
	}

	initVariables() {
		this.setVariableDefinitions(getVariables(this))
	}

	initPresets() {
		this.setPresetDefinitions(getPresets(this))
	}

	updateVariables() {
		const variables = {}

		// Add connection status
		variables['connection_status'] = this.socket && this.socket.connected ? 'Connected' : 'Disconnected'

		// Helper function to convert linear value to dB
		const linearToDb = (value) => {
			if (value <= 0) return '-∞'
			// Using the VtoMix formula approximation from the backend
			const db = value * (212.47 + value * (value * (185.11 - 54.29 * value) - 261.67)) - 71.62
			return db.toFixed(1)
		}

		// Input channel variables
		for (let i = 0; i < 4; i++) {
			const mixKey = `i.${i}.mix`
			const muteKey = `i.${i}.mute`
			const soloKey = `i.${i}.solo`
			const panKey = `i.${i}.pan`
			const gainKey = `i.${i}.gain`
			const phantomKey = `i.${i}.phantom`

			const mix = this.state.channels[mixKey] || 0
			variables[`input_${i + 1}_fader`] = (mix * 100).toFixed(0) + '%'
			variables[`input_${i + 1}_fader_db`] = linearToDb(mix) + ' dB'
			variables[`input_${i + 1}_mute`] = this.state.channels[muteKey] ? 'Muted' : 'Unmuted'
			variables[`input_${i + 1}_solo`] = this.state.channels[soloKey] ? 'Solo' : ''
			variables[`input_${i + 1}_pan`] =
				this.state.channels[panKey] !== undefined ? (this.state.channels[panKey] * 200 - 100).toFixed(0) : '0'
			variables[`input_${i + 1}_gain`] =
				this.state.channels[gainKey] !== undefined ? (this.state.channels[gainKey] * 100).toFixed(0) + '%' : '0%'
			variables[`input_${i + 1}_phantom`] = this.state.channels[phantomKey] ? 'On' : 'Off'

			// VU meters
			const meterKey = `i.${i}`
			const meter = this.state.meters[meterKey]
			if (meter && meter.level !== undefined) {
				variables[`input_${i + 1}_meter`] = meter.level.toFixed(1) + ' dB'
			} else {
				variables[`input_${i + 1}_meter`] = '-∞ dB'
			}
		}

		// Player channel variables
		for (let i = 0; i < 3; i++) {
			const mixKey = `p.${i}.mix`
			const muteKey = `p.${i}.mute`
			const soloKey = `p.${i}.solo`
			const panKey = `p.${i}.pan`

			const mix = this.state.channels[mixKey] || 0
			variables[`player_${i + 1}_fader`] = (mix * 100).toFixed(0) + '%'
			variables[`player_${i + 1}_fader_db`] = linearToDb(mix) + ' dB'
			variables[`player_${i + 1}_mute`] = this.state.channels[muteKey] ? 'Muted' : 'Unmuted'
			variables[`player_${i + 1}_solo`] = this.state.channels[soloKey] ? 'Solo' : ''
			variables[`player_${i + 1}_pan`] =
				this.state.channels[panKey] !== undefined ? (this.state.channels[panKey] * 200 - 100).toFixed(0) : '0'
		}

		// Master variables
		const masterMix = this.state.channels['m.mix'] || 0
		variables['master_fader'] = (masterMix * 100).toFixed(0) + '%'
		variables['master_fader_db'] = linearToDb(masterMix) + ' dB'
		variables['master_mute'] = this.state.channels['m.mute'] ? 'Muted' : 'Unmuted'

		// Recording variables
		const recState = this.state.channels['recState'] || 0
		const recStateText = ['Ready', 'Recording', 'Paused', 'Saving', 'Saved', 'Full'][recState] || 'Unknown'
		variables['recording_state'] = recStateText
		variables['recording_time'] = this.state.channels['recTime']
			? this.formatTime(this.state.channels['recTime'])
			: '00:00:00'
		variables['recording_destination'] = this.state.channels['settings.rec.toUSB']
			? 'USB'
			: this.state.channels['settings.rec.toComputer']
				? 'Computer'
				: 'SD'

		// Current bank
		const currentBank = this.state.channels['bank'] || 0
		variables['current_bank'] = `Bank ${currentBank + 1}`

		// Sample states (for current bank)
		for (let i = 0; i < 6; i++) {
			const sampleKey = `B.${currentBank}.${i}`
			const state = this.state.channels[`${sampleKey}.state`] || 0
			const stateText = ['Closed', 'Error', 'Stop', 'Play', 'Loop', 'Pause'][state] || 'Unknown'
			variables[`sample_${i + 1}_state`] = stateText
			variables[`sample_${i + 1}_name`] = this.state.channels[`${sampleKey}.name`] || `Pad ${i + 1}`
		}

		// Player states
		for (let i = 0; i < 3; i++) {
			const playerKey = `player.${i}`
			const state = this.state.channels[`${playerKey}.state`] || 0
			const stateText = ['Closed', 'Error', 'Stop', 'Play', 'End', 'Pause'][state] || 'Unknown'
			variables[`player_${i + 1}_state`] = stateText

			const pos = this.state.channels[`${playerKey}.pos`] || 0
			variables[`player_${i + 1}_position`] = this.formatTime(pos)

			const duration = this.state.channels[`${playerKey}.duration`] || 0
			variables[`player_${i + 1}_duration`] = this.formatTime(duration)
		}

		// Aux bus variables
		for (let i = 0; i < 4; i++) {
			const mixKey = `a.${i}.mix`
			const muteKey = `a.${i}.mute`

			const mix = this.state.channels[mixKey] || 0
			variables[`aux_${i + 1}_fader`] = (mix * 100).toFixed(0) + '%'
			variables[`aux_${i + 1}_fader_db`] = linearToDb(mix) + ' dB'
			variables[`aux_${i + 1}_mute`] = this.state.channels[muteKey] ? 'Muted' : 'Unmuted'
		}

		// System status variables
		const btStatus = this.state.channels['settings.bluetooth.status'] || 0
		const btText = ['Disabled', 'Unpaired', 'Paired', 'Connected'][btStatus] || 'Unknown'
		variables['bluetooth_status'] = btText

		const ndiStatus = this.state.channels['settings.ndi.enable'] || 0
		variables['ndi_status'] = ndiStatus ? 'Enabled' : 'Disabled'

		const automixStatus = this.state.channels['settings.automix'] || 0
		variables['automix_status'] = automixStatus ? 'Active' : 'Inactive'

		const layoutMode = this.state.channels['settings.layout'] || 0
		variables['layout_mode'] = layoutMode ? 'Advanced' : 'EZ'

		const brightness = this.state.channels['settings.brightness.screen'] || 0.75
		variables['screen_brightness'] = (brightness * 100).toFixed(0) + '%'

		this.setVariableValues(variables)
	}

	formatTime(seconds) {
		const hrs = Math.floor(seconds / 3600)
		const mins = Math.floor((seconds % 3600) / 60)
		const secs = Math.floor(seconds % 60)
		return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
	}
}

runEntrypoint(MackieDLZCreatorInstance, upgradeScripts)
