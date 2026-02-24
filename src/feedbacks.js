const { combineRgb } = require('@companion-module/base')

module.exports = {
	getFeedbacks(instance) {
		return {
			channel_mute: {
				type: 'boolean',
				name: 'Channel Mute State',
				description: 'Change button color based on channel mute state',
				defaultStyle: {
					bgcolor: combineRgb(255, 0, 0),
					color: combineRgb(255, 255, 255)
				},
				options: [
					{
						type: 'dropdown',
						label: 'Channel Type',
						id: 'channelType',
						default: 'i',
						choices: [
							{ id: 'i', label: 'Input' },
							{ id: 'p', label: 'Player' },
							{ id: 'm', label: 'Master' }
						]
					},
					{
						type: 'number',
						label: 'Channel',
						id: 'channel',
						default: 1,
						min: 1,
						max: 4
					}
				],
				callback: (feedback) => {
					const channelType = feedback.options.channelType
					const channel = feedback.options.channel - 1
					const key = `${channelType}.${channel}.mute`
					return instance.state.channels[key] === 1
				}
			},
			
			channel_solo: {
				type: 'boolean',
				name: 'Channel Solo State',
				description: 'Change button color based on channel solo state',
				defaultStyle: {
					bgcolor: combineRgb(255, 255, 0),
					color: combineRgb(0, 0, 0)
				},
				options: [
					{
						type: 'dropdown',
						label: 'Channel Type',
						id: 'channelType',
						default: 'i',
						choices: [
							{ id: 'i', label: 'Input' },
							{ id: 'p', label: 'Player' }
						]
					},
					{
						type: 'number',
						label: 'Channel',
						id: 'channel',
						default: 1,
						min: 1,
						max: 4
					}
				],
				callback: (feedback) => {
					const channelType = feedback.options.channelType
					const channel = feedback.options.channel - 1
					const key = `${channelType}.${channel}.solo`
					return instance.state.channels[key] === 1
				}
			},
			
			fader_level: {
				type: 'boolean',
				name: 'Fader Level Threshold',
				description: 'Change color when fader crosses threshold',
				defaultStyle: {
					bgcolor: combineRgb(0, 255, 0),
					color: combineRgb(0, 0, 0)
				},
				options: [
					{
						type: 'dropdown',
						label: 'Channel Type',
						id: 'channelType',
						default: 'i',
						choices: [
							{ id: 'i', label: 'Input' },
							{ id: 'p', label: 'Player' },
							{ id: 'm', label: 'Master' }
						]
					},
					{
						type: 'number',
						label: 'Channel',
						id: 'channel',
						default: 1,
						min: 1,
						max: 4
					},
					{
						type: 'number',
						label: 'Threshold Level (0.0-1.0)',
						id: 'threshold',
						default: 0.75,
						min: 0,
						max: 1,
						step: 0.01
					},
					{
						type: 'dropdown',
						label: 'Comparison',
						id: 'comparison',
						default: 'gt',
						choices: [
							{ id: 'gt', label: 'Greater Than' },
							{ id: 'lt', label: 'Less Than' },
							{ id: 'eq', label: 'Equal To' }
						]
					}
				],
				callback: (feedback) => {
					const channelType = feedback.options.channelType
					const channel = feedback.options.channel - 1
					const key = `${channelType}.${channel}.mix`
					const faderLevel = instance.state.channels[key] || 0
					const threshold = feedback.options.threshold
					
					switch (feedback.options.comparison) {
						case 'gt':
							return faderLevel > threshold
						case 'lt':
							return faderLevel < threshold
						case 'eq':
							return Math.abs(faderLevel - threshold) < 0.01
					}
					return false
				}
			},
			
			vu_level: {
				type: 'advanced',
				name: 'VU Meter Level',
				description: 'Change color based on VU meter level',
				options: [
					{
						type: 'dropdown',
						label: 'Channel Type',
						id: 'channelType',
						default: 'i',
						choices: [
							{ id: 'i', label: 'Input' },
							{ id: 'p', label: 'Player' }
						]
					},
					{
						type: 'number',
						label: 'Channel',
						id: 'channel',
						default: 1,
						min: 1,
						max: 4
					},
					{
						type: 'number',
						label: 'Red Threshold (dB)',
						id: 'red_threshold',
						default: -3,
						min: -60,
						max: 10
					},
					{
						type: 'number',
						label: 'Yellow Threshold (dB)',
						id: 'yellow_threshold',
						default: -12,
						min: -60,
						max: 10
					}
				],
				callback: (feedback) => {
					const channelType = feedback.options.channelType
					const channel = feedback.options.channel - 1
					const key = `${channelType}.${channel}`
					const meterState = instance.state.meters[key]
					
					if (!meterState) return {}
					
					// VU meter data comes as dB values
					const level = meterState.level || -60
					
					if (level >= feedback.options.red_threshold) {
						return {
							bgcolor: combineRgb(255, 0, 0),
							color: combineRgb(255, 255, 255)
						}
					} else if (level >= feedback.options.yellow_threshold) {
						return {
							bgcolor: combineRgb(255, 255, 0),
							color: combineRgb(0, 0, 0)
						}
					} else if (level > -60) {
						return {
							bgcolor: combineRgb(0, 255, 0),
							color: combineRgb(0, 0, 0)
						}
					}
					return {}
				}
			},
			
			phantom_power: {
				type: 'boolean',
				name: 'Phantom Power State',
				description: 'Change button color based on phantom power state',
				defaultStyle: {
					bgcolor: combineRgb(255, 100, 0),
					color: combineRgb(255, 255, 255)
				},
				options: [
					{
						type: 'number',
						label: 'Input Channel',
						id: 'channel',
						default: 1,
						min: 1,
						max: 4
					}
				],
				callback: (feedback) => {
					const channel = feedback.options.channel - 1
					const key = `i.${channel}.phantom`
					return instance.state.channels[key] === 1
				}
			},

			eq_bypass: {
				type: 'boolean',
				name: 'EQ Bypass State',
				description: 'Change button color when EQ is bypassed',
				defaultStyle: {
					bgcolor: combineRgb(128, 128, 128),
					color: combineRgb(255, 255, 255)
				},
				options: [
					{
						type: 'dropdown',
						label: 'Channel Type',
						id: 'channelType',
						default: 'i',
						choices: [
							{ id: 'i', label: 'Input' },
							{ id: 'p', label: 'Player' },
							{ id: 's', label: 'Samples' },
							{ id: 'm', label: 'Master' }
						]
					},
					{
						type: 'number',
						label: 'Channel',
						id: 'channel',
						default: 1,
						min: 1,
						max: 4
					}
				],
				callback: (feedback) => {
					const channelType = feedback.options.channelType
					const channel = feedback.options.channel - 1
					const key = `${channelType}.${channel}.eq.bypass`
					return instance.state.channels[key] === 0  // Active when NOT bypassed
				}
			},

			compressor_bypass: {
				type: 'boolean',
				name: 'Compressor Bypass State',
				description: 'Change button color when compressor is active',
				defaultStyle: {
					bgcolor: combineRgb(0, 150, 255),
					color: combineRgb(255, 255, 255)
				},
				options: [
					{
						type: 'dropdown',
						label: 'Channel Type',
						id: 'channelType',
						default: 'i',
						choices: [
							{ id: 'i', label: 'Input' },
							{ id: 'p', label: 'Player' },
							{ id: 's', label: 'Samples' },
							{ id: 'm', label: 'Master' }
						]
					},
					{
						type: 'number',
						label: 'Channel',
						id: 'channel',
						default: 1,
						min: 1,
						max: 4
					}
				],
				callback: (feedback) => {
					const channelType = feedback.options.channelType
					const channel = feedback.options.channel - 1
					const key = `${channelType}.${channel}.comp.bypass`
					return instance.state.channels[key] === 0  // Active when NOT bypassed
				}
			},

			fx_bypass: {
				type: 'boolean',
				name: 'FX Bypass State',
				description: 'Change button color when FX is active',
				defaultStyle: {
					bgcolor: combineRgb(150, 0, 255),
					color: combineRgb(255, 255, 255)
				},
				options: [
					{
						type: 'dropdown',
						label: 'FX Unit',
						id: 'unit',
						default: 0,
						choices: [
							{ id: 0, label: 'FX 1' },
							{ id: 1, label: 'FX 2' }
						]
					}
				],
				callback: (feedback) => {
					const key = `f.${feedback.options.unit}.bypass`
					return instance.state.channels[key] === 0  // Active when NOT bypassed
				}
			},

			sample_playing: {
				type: 'boolean',
				name: 'Sample Playing State',
				description: 'Change button color when sample is playing',
				defaultStyle: {
					bgcolor: combineRgb(0, 255, 0),
					color: combineRgb(0, 0, 0)
				},
				options: [
					{
						type: 'dropdown',
						label: 'Bank',
						id: 'bank',
						default: 0,
						choices: [
							{ id: 0, label: 'Bank 1' },
							{ id: 1, label: 'Bank 2' },
							{ id: 2, label: 'Bank 3' },
							{ id: 3, label: 'Bank 4' },
							{ id: 4, label: 'Bank 5' },
							{ id: 5, label: 'Bank 6' },
							{ id: 6, label: 'Bank 7' },
							{ id: 7, label: 'Bank 8' }
						]
					},
					{
						type: 'dropdown',
						label: 'Pad',
						id: 'pad',
						default: 0,
						choices: [
							{ id: 0, label: 'Pad 1' },
							{ id: 1, label: 'Pad 2' },
							{ id: 2, label: 'Pad 3' },
							{ id: 3, label: 'Pad 4' },
							{ id: 4, label: 'Pad 5' },
							{ id: 5, label: 'Pad 6' }
						]
					}
				],
				callback: (feedback) => {
					const bank = feedback.options.bank
					const pad = feedback.options.pad
					const key = `B.${bank}.${pad}.state`
					const state = instance.state.channels[key] || 0
					// State 3 = PLAY, 4 = LOOP
					return state === 3 || state === 4
				}
			},

			recording_active: {
				type: 'boolean',
				name: 'Recording Active',
				description: 'Change button color when recording',
				defaultStyle: {
					bgcolor: combineRgb(255, 0, 0),
					color: combineRgb(255, 255, 255)
				},
				options: [],
				callback: (feedback) => {
					const state = instance.state.channels['recState'] || 0
					// State 1 = ACTIVE (recording)
					return state === 1
				}
			},

			gate_bypass: {
				type: 'boolean',
				name: 'Gate Bypass State',
				description: 'Change button color when gate is active',
				defaultStyle: {
					bgcolor: combineRgb(255, 150, 0),
					color: combineRgb(255, 255, 255)
				},
				options: [
					{
						type: 'dropdown',
						label: 'Channel Type',
						id: 'channelType',
						default: 'i',
						choices: [
							{ id: 'i', label: 'Input' },
							{ id: 'p', label: 'Player' },
							{ id: 'm', label: 'Master' }
						]
					},
					{
						type: 'number',
						label: 'Channel',
						id: 'channel',
						default: 1,
						min: 1,
						max: 4
					}
				],
				callback: (feedback) => {
					const channelType = feedback.options.channelType
					const channel = feedback.options.channel - 1
					const key = `${channelType}.${channel}.gate.bypass`
					return instance.state.channels[key] === 0  // Active when NOT bypassed
				}
			},

			deesser_bypass: {
				type: 'boolean',
				name: 'De-Esser Bypass State',
				description: 'Change button color when de-esser is active',
				defaultStyle: {
					bgcolor: combineRgb(255, 200, 0),
					color: combineRgb(0, 0, 0)
				},
				options: [
					{
						type: 'dropdown',
						label: 'Channel Type',
						id: 'channelType',
						default: 'i',
						choices: [
							{ id: 'i', label: 'Input' },
							{ id: 'p', label: 'Player' }
						]
					},
					{
						type: 'number',
						label: 'Channel',
						id: 'channel',
						default: 1,
						min: 1,
						max: 4
					}
				],
				callback: (feedback) => {
					const channelType = feedback.options.channelType
					const channel = feedback.options.channel - 1
					const key = `${channelType}.${channel}.ds.bypass`
					return instance.state.channels[key] === 0  // Active when NOT bypassed
				}
			},

			player_playing: {
				type: 'boolean',
				name: 'Player Playing State',
				description: 'Change button color when player is playing',
				defaultStyle: {
					bgcolor: combineRgb(0, 200, 0),
					color: combineRgb(255, 255, 255)
				},
				options: [
					{
						type: 'dropdown',
						label: 'Player',
						id: 'player',
						default: 0,
						choices: [
							{ id: 0, label: 'Player 1' },
							{ id: 1, label: 'Player 2' },
							{ id: 2, label: 'Player 3' }
						]
					}
				],
				callback: (feedback) => {
					const player = feedback.options.player
					const key = `player.${player}.state`
					const state = instance.state.channels[key] || 0
					// State 3 = PLAY
					return state === 3
				}
			},

			aux_muted: {
				type: 'boolean',
				name: 'Aux Bus Muted',
				description: 'Change button color when aux bus is muted',
				defaultStyle: {
					bgcolor: combineRgb(255, 0, 0),
					color: combineRgb(255, 255, 255)
				},
				options: [
					{
						type: 'dropdown',
						label: 'Aux Bus',
						id: 'auxBus',
						default: 0,
						choices: [
							{ id: 0, label: 'Aux 1' },
							{ id: 1, label: 'Aux 2' },
							{ id: 2, label: 'Aux 3' },
							{ id: 3, label: 'Aux 4' }
						]
					}
				],
				callback: (feedback) => {
					const aux = feedback.options.auxBus
					const key = `a.${aux}.mute`
					return instance.state.channels[key] === 1
				}
			},

			autogain_active: {
				type: 'boolean',
				name: 'Auto-Gain Active',
				description: 'Change button color when auto-gain is active',
				defaultStyle: {
					bgcolor: combineRgb(0, 255, 100),
					color: combineRgb(0, 0, 0)
				},
				options: [
					{
						type: 'dropdown',
						label: 'Channel Type',
						id: 'channelType',
						default: 'i',
						choices: [
							{ id: 'i', label: 'Input' }
						]
					},
					{
						type: 'number',
						label: 'Channel',
						id: 'channel',
						default: 1,
						min: 1,
						max: 4
					}
				],
				callback: (feedback) => {
					const channelType = feedback.options.channelType
					const channel = feedback.options.channel - 1
					const key = `${channelType}.${channel}.autogain`
					return instance.state.channels[key] === 1
				}
			},

			automix_active: {
				type: 'boolean',
				name: 'Auto-Mix Active',
				description: 'Change button color when auto-mix is active',
				defaultStyle: {
					bgcolor: combineRgb(255, 150, 0),
					color: combineRgb(0, 0, 0)
				},
				options: [],
				callback: (feedback) => {
					const key = 'settings.automix'
					return instance.state.channels[key] === 1
				}
			},

			ndi_enabled: {
				type: 'boolean',
				name: 'NDI Enabled',
				description: 'Change button color when NDI is enabled',
				defaultStyle: {
					bgcolor: combineRgb(0, 150, 255),
					color: combineRgb(255, 255, 255)
				},
				options: [],
				callback: (feedback) => {
					const key = 'settings.ndi.enable'
					return instance.state.channels[key] === 1
				}
			},

			bluetooth_connected: {
				type: 'boolean',
				name: 'Bluetooth Connected',
				description: 'Change button color when Bluetooth is connected',
				defaultStyle: {
					bgcolor: combineRgb(0, 100, 255),
					color: combineRgb(255, 255, 255)
				},
				options: [],
				callback: (feedback) => {
					const key = 'settings.bluetooth.status'
					const status = instance.state.channels[key] || 0
					// Status 3 = Connected
					return status === 3
				}
			}
		}
	}
}
