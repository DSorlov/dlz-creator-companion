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
			routing: {}
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
				value: 'This module connects to the Mackie DLZ Creator via its web interface.'
			},
			{
				type: 'textinput',
				id: 'host',
				label: 'Target IP',
				width: 8,
				default: '192.168.8.30',
				regex: this.REGEX_IP
			},
			{
				type: 'number',
				id: 'port',
				label: 'Target Port',
				width: 4,
				default: 80,
				min: 1,
				max: 65535
			}
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
			transports: ['websocket', 'polling']
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

		// Handle incoming messages
		this.socket.on('message', (data) => {
			this.handleMessage(data)
		})

		// Handle VU meter updates
		this.socket.on('VU', (data) => {
			this.handleVUUpdate(data)
		})

		// Handle config updates
		this.socket.on('config', (data) => {
			this.handleConfigUpdate(data)
		})

		// Handle routing updates
		this.socket.on('routing', (data) => {
			this.handleRoutingUpdate(data)
		})
	}

	handleMessage(data) {
		this.log('debug', `Received message: ${JSON.stringify(data)}`)
		
		// DLZ sends messages as objects with key-value pairs
		// Example: { 'i.0.mute': 1, 'i.1.mix': 0.75 }
		if (typeof data === 'object' && !Array.isArray(data)) {
			// Update state for each property
			for (const [key, value] of Object.entries(data)) {
				this.state.channels[key] = value
				
				// Update specific feedback types
				if (key.endsWith('.mute')) {
					this.checkFeedbacks('channel_mute')
				} else if (key.endsWith('.solo')) {
					this.checkFeedbacks('channel_solo')
				} else if (key.endsWith('.mix')) {
					this.checkFeedbacks('fader_level')
				}
			}
			this.updateVariables()
		}
		
		// Also handle array format messages: ['messageType', data]
		if (Array.isArray(data) && data.length >= 2) {
			const [messageType, ...payload] = data
			
			switch (messageType) {
				case 'VU':
					this.handleVUUpdate(payload)
					break
				case 'config':
					this.handleConfigUpdate(payload)
					break
				case 'routing':
					this.handleRoutingUpdate(payload)
					break
			}
		}
	}

	handleVUUpdate(data) {
		// VU data format varies - can be array or direct object
		// Example: ['VU', { ch: 'i.0', level: -12.5, peak: -6.2 }]
		// Or direct: { 'VU': { ch: 'i.0', level: -12.5 } }
		
		let vuData = data
		
		// If it's an array, extract the payload
		if (Array.isArray(data) && data.length > 0) {
			vuData = data[0]
		}
		
		// Handle the VU object
		if (vuData && typeof vuData === 'object') {
			// Could be single channel or multiple channels
			if (vuData.ch !== undefined) {
				// Single channel update
				const ch = vuData.ch
				this.state.meters[ch] = {
					level: vuData.level || vuData.l || -60,
					peak: vuData.peak || vuData.p || -60
				}
			} else {
				// Could be multiple channels in one update
				for (const [key, value] of Object.entries(vuData)) {
					if (key.match(/^(i|p|m|a|f)\./)) {
						this.state.meters[key] = value
					}
				}
			}
			
			this.checkFeedbacks('vu_level')
			this.updateVariables()
		}
	}

	handleConfigUpdate(data) {
		this.state.config = Object.assign(this.state.config, data)
		this.checkFeedbacks()
		this.updateVariables()
	}

	handleRoutingUpdate(data) {
		this.state.routing = Object.assign(this.state.routing, data)
		this.checkFeedbacks()
	}

	setParameter(key, value) {
		if (this.socket && this.socket.connected) {
			// Send parameter as key-value object (DLZ protocol)
			const message = {
				[key]: value
			}
			this.socket.emit('message', message)
			this.log('debug', `Set parameter: ${key} = ${value}`)
		} else {
			this.log('warn', 'Cannot set parameter: not connected')
		}
	}

	sendCommand(command, args) {
		if (this.socket && this.socket.connected) {
			// Send command with args (DLZ protocol for commands)
			const message = {
				cmd: command,
				id: 0,
				args: args || {},
				data: {}
			}
			this.socket.emit('message', message)
			this.log('debug', `Sent command: ${command}`)
		} else {
			this.log('warn', 'Cannot send command: not connected')
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
			variables[`input_${i + 1}_pan`] = this.state.channels[panKey] !== undefined 
				? (this.state.channels[panKey] * 200 - 100).toFixed(0) 
				: '0'
			variables[`input_${i + 1}_gain`] = this.state.channels[gainKey] !== undefined
				? (this.state.channels[gainKey] * 100).toFixed(0) + '%'
				: '0%'
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
			variables[`player_${i + 1}_pan`] = this.state.channels[panKey] !== undefined
				? (this.state.channels[panKey] * 200 - 100).toFixed(0)
				: '0'
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
			: this.state.channels['settings.rec.toComputer'] ? 'Computer' : 'SD'
		
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
