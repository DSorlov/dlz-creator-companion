module.exports = {
	getActions(instance) {
		return {
			setFader: {
				name: 'Set Fader Level',
				options: [
					{
						type: 'dropdown',
						label: 'Channel Type',
						id: 'channelType',
						default: 'i',
						choices: [
							{ id: 'i', label: 'Input' },
							{ id: 'p', label: 'Player' },
							{ id: 'm', label: 'Master' },
							{ id: 'a', label: 'Aux' },
							{ id: 'f', label: 'FX' }
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
						label: 'Level (0.0-1.0)',
						id: 'level',
						default: 0.75,
						min: 0,
						max: 1,
						step: 0.01
					}
				],
				callback: async (action) => {
					const channelType = action.options.channelType
					const channel = action.options.channel - 1
					const key = `${channelType}.${channel}.mix`
					instance.setParameter(key, action.options.level)
				}
			},
			
			muteChannel: {
				name: 'Mute Channel',
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
						type: 'dropdown',
						label: 'Mute State',
						id: 'mute',
						default: 1,
						choices: [
							{ id: 0, label: 'Unmute' },
							{ id: 1, label: 'Mute' },
							{ id: 2, label: 'Toggle' }
						]
					}
				],
				callback: async (action) => {
					const channelType = action.options.channelType
					const channel = action.options.channel - 1
					let muteState = action.options.mute
					
					const key = `${channelType}.${channel}.mute`
					
					if (muteState === 2) {
						// Toggle
						const currentState = instance.state.channels[key] || false
						muteState = currentState ? 0 : 1
					}
					
					instance.setParameter(key, muteState)
				}
			},
			
			soloChannel: {
				name: 'Solo Channel',
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
						type: 'dropdown',
						label: 'Solo State',
						id: 'solo',
						default: 1,
						choices: [
							{ id: 0, label: 'Unsolo' },
							{ id: 1, label: 'Solo' },
							{ id: 2, label: 'Toggle' }
						]
					}
				],
				callback: async (action) => {
					const channelType = action.options.channelType
					const channel = action.options.channel - 1
					let soloState = action.options.solo
					
					const key = `${channelType}.${channel}.solo`
					
					if (soloState === 2) {
						// Toggle
						const currentState = instance.state.channels[key] || false
						soloState = currentState ? 0 : 1
					}
					
					instance.setParameter(key, soloState)
				}
			},
			
			setPhantomPower: {
				name: 'Set Phantom Power',
				options: [
					{
						type: 'number',
						label: 'Input Channel',
						id: 'channel',
						default: 1,
						min: 1,
						max: 4
					},
					{
						type: 'dropdown',
						label: 'Phantom Power',
						id: 'phantom',
						default: 1,
						choices: [
							{ id: 0, label: 'Off' },
							{ id: 1, label: 'On' },
							{ id: 2, label: 'Toggle' }
						]
					}
				],
				callback: async (action) => {
					const channel = action.options.channel - 1
					let phantomState = action.options.phantom
					
					const key = `i.${channel}.phantom`
					
					if (phantomState === 2) {
						// Toggle
						const currentState = instance.state.channels[key] || false
						phantomState = currentState ? 0 : 1
					}
					
					instance.setParameter(key, phantomState)
				}
			},
			
			setGain: {
				name: 'Set Input Gain',
				options: [
					{
						type: 'number',
						label: 'Input Channel',
						id: 'channel',
						default: 1,
						min: 1,
						max: 4
					},
					{
						type: 'number',
						label: 'Gain (0.0-1.0)',
						id: 'gain',
						default: 0.5,
						min: 0,
						max: 1,
						step: 0.01
					}
				],
				callback: async (action) => {
					const channel = action.options.channel - 1
					const key = `i.${channel}.gain`
					instance.setParameter(key, action.options.gain)
				}
			},
			
			setPan: {
				name: 'Set Pan',
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
						label: 'Pan (0.0=Left, 0.5=Center, 1.0=Right)',
						id: 'pan',
						default: 0.5,
						min: 0,
						max: 1,
						step: 0.01
					}
				],
				callback: async (action) => {
					const channelType = action.options.channelType
					const channel = action.options.channel - 1
					const key = `${channelType}.${channel}.pan`
					instance.setParameter(key, action.options.pan)
				}
			},

			// === AUX SEND CONTROLS ===
			setAuxSend: {
				name: 'Set Aux Send Level',
				options: [
					{
						type: 'dropdown',
						label: 'Source Channel Type',
						id: 'channelType',
						default: 'i',
						choices: [
							{ id: 'i', label: 'Input' },
							{ id: 'p', label: 'Player' },
							{ id: 's', label: 'Samples' }
						]
					},
					{
						type: 'number',
						label: 'Source Channel',
						id: 'channel',
						default: 1,
						min: 1,
						max: 4
					},
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
					},
					{
						type: 'number',
						label: 'Send Level (0.0-1.0)',
						id: 'level',
						default: 0.5,
						min: 0,
						max: 1,
						step: 0.01
					}
				],
				callback: async (action) => {
					const channelType = action.options.channelType
					const channel = action.options.channel - 1
					const aux = action.options.auxBus
					const key = `${channelType}.${channel}.aux.${aux}.value`
					instance.setParameter(key, action.options.level)
				}
			},

			muteAuxSend: {
				name: 'Mute Aux Send',
				options: [
					{
						type: 'dropdown',
						label: 'Source Channel Type',
						id: 'channelType',
						default: 'i',
						choices: [
							{ id: 'i', label: 'Input' },
							{ id: 'p', label: 'Player' },
							{ id: 's', label: 'Samples' }
						]
					},
					{
						type: 'number',
						label: 'Source Channel',
						id: 'channel',
						default: 1,
						min: 1,
						max: 4
					},
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
					},
					{
						type: 'dropdown',
						label: 'Mute State',
						id: 'mute',
						default: 1,
						choices: [
							{ id: 0, label: 'Unmute' },
							{ id: 1, label: 'Mute' },
							{ id: 2, label: 'Toggle' }
						]
					}
				],
				callback: async (action) => {
					const channelType = action.options.channelType
					const channel = action.options.channel - 1
					const aux = action.options.auxBus
					let muteState = action.options.mute
					
					const key = `${channelType}.${channel}.aux.${aux}.mute`
					
					if (muteState === 2) {
						const currentState = instance.state.channels[key] || 0
						muteState = currentState ? 0 : 1
					}
					
					instance.setParameter(key, muteState)
				}
			},

			// === EQ CONTROLS ===
			setEQBypass: {
				name: 'EQ Bypass',
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
					},
					{
						type: 'dropdown',
						label: 'Bypass State',
						id: 'bypass',
						default: 1,
						choices: [
							{ id: 0, label: 'Active (EQ On)' },
							{ id: 1, label: 'Bypass (EQ Off)' },
							{ id: 2, label: 'Toggle' }
						]
					}
				],
				callback: async (action) => {
					const channelType = action.options.channelType
					const channel = action.options.channel - 1
					let bypassState = action.options.bypass
					
					const key = `${channelType}.${channel}.eq.bypass`
					
					if (bypassState === 2) {
						const currentState = instance.state.channels[key] || 0
						bypassState = currentState ? 0 : 1
					}
					
					instance.setParameter(key, bypassState)
				}
			},

			setEQHighPass: {
				name: 'Set EQ High-Pass Filter',
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
					},
					{
						type: 'dropdown',
						label: 'HPF State',
						id: 'bypass',
						default: 0,
						choices: [
							{ id: 0, label: 'Active (On)' },
							{ id: 1, label: 'Bypass (Off)' }
						]
					},
					{
						type: 'number',
						label: 'Frequency (Hz)',
						id: 'freq',
						default: 80,
						min: 20,
						max: 700
					}
				],
				callback: async (action) => {
					const channelType = action.options.channelType
					const channel = action.options.channel - 1
					
					instance.setParameter(`${channelType}.${channel}.eq.hp.bypass`, action.options.bypass)
					instance.setParameter(`${channelType}.${channel}.eq.hp.freq`, action.options.freq / 20000) // Normalize to 0-1
				}
			},

			setEQBand: {
				name: 'Set EQ Band',
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
					},
					{
						type: 'dropdown',
						label: 'Band',
						id: 'band',
						default: 1,
						choices: [
							{ id: 1, label: 'Band 1 (Low)' },
							{ id: 2, label: 'Band 2 (Mid)' },
							{ id: 3, label: 'Band 3 (High)' }
						]
					},
					{
						type: 'number',
						label: 'Gain (dB)',
						id: 'gain',
						default: 0,
						min: -15,
						max: 15,
						step: 0.5
					},
					{
						type: 'number',
						label: 'Frequency (Hz)',
						id: 'freq',
						default: 1000,
						min: 20,
						max: 20000
					},
					{
						type: 'number',
						label: 'Q (Bandwidth)',
						id: 'q',
						default: 1.0,
						min: 0.1,
						max: 15,
						step: 0.1
					}
				],
				callback: async (action) => {
					const channelType = action.options.channelType
					const channel = action.options.channel - 1
					const band = action.options.band
					const prefix = `${channelType}.${channel}.eq.b${band}`
					
					// Normalize values to 0-1 range (backend expects normalized values)
					const gainNorm = (action.options.gain + 15) / 30  // -15 to +15 -> 0 to 1
					const freqNorm = Math.log(action.options.freq / 20) / Math.log(20000 / 20)  // Log scale
					const qNorm = Math.log(action.options.q / 0.1) / Math.log(15 / 0.1)  // Log scale
					
					instance.setParameter(`${prefix}.gain`, gainNorm)
					instance.setParameter(`${prefix}.freq`, freqNorm)
					instance.setParameter(`${prefix}.q`, qNorm)
				}
			},

			// === COMPRESSOR CONTROLS ===
			setCompressorBypass: {
				name: 'Compressor Bypass',
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
					},
					{
						type: 'dropdown',
						label: 'Bypass State',
						id: 'bypass',
						default: 1,
						choices: [
							{ id: 0, label: 'Active (Comp On)' },
							{ id: 1, label: 'Bypass (Comp Off)' },
							{ id: 2, label: 'Toggle' }
						]
					}
				],
				callback: async (action) => {
					const channelType = action.options.channelType
					const channel = action.options.channel - 1
					let bypassState = action.options.bypass
					
					const key = `${channelType}.${channel}.comp.bypass`
					
					if (bypassState === 2) {
						const currentState = instance.state.channels[key] || 0
						bypassState = currentState ? 0 : 1
					}
					
					instance.setParameter(key, bypassState)
				}
			},

			setCompressor: {
				name: 'Set Compressor',
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
					},
					{
						type: 'number',
						label: 'Threshold (dB)',
						id: 'thresh',
						default: -20,
						min: -60,
						max: 0
					},
					{
						type: 'number',
						label: 'Ratio',
						id: 'ratio',
						default: 3,
						min: 1,
						max: 20,
						step: 0.1
					},
					{
						type: 'number',
						label: 'Attack (ms)',
						id: 'attack',
						default: 10,
						min: 0.5,
						max: 500,
						step: 0.5
					},
					{
						type: 'number',
						label: 'Release (ms)',
						id: 'release',
						default: 100,
						min: 10,
						max: 2000,
						step: 10
					},
					{
						type: 'number',
						label: 'Makeup Gain (dB)',
						id: 'gain',
						default: 3,
						min: 0,
						max: 24,
						step: 0.5
					}
				],
				callback: async (action) => {
					const channelType = action.options.channelType
					const channel = action.options.channel - 1
					const prefix = `${channelType}.${channel}.comp`
					
					// Normalize to 0-1
					const threshNorm = (action.options.thresh + 60) / 60
					const ratioNorm = Math.log(action.options.ratio) / Math.log(20)
					const attackNorm = Math.log(action.options.attack / 0.5) / Math.log(500 / 0.5)
					const releaseNorm = Math.log(action.options.release / 10) / Math.log(2000 / 10)
					const gainNorm = action.options.gain / 24
					
					instance.setParameter(`${prefix}.thresh`, threshNorm)
					instance.setParameter(`${prefix}.ratio`, ratioNorm)
					instance.setParameter(`${prefix}.attack`, attackNorm)
					instance.setParameter(`${prefix}.release`, releaseNorm)
					instance.setParameter(`${prefix}.gain`, gainNorm)
				}
			},

			// === FX CONTROLS ===
			setReverbBypass: {
				name: 'Reverb Bypass',
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
					},
					{
						type: 'dropdown',
						label: 'Bypass State',
						id: 'bypass',
						default: 1,
						choices: [
							{ id: 0, label: 'Active (On)' },
							{ id: 1, label: 'Bypass (Off)' },
							{ id: 2, label: 'Toggle' }
						]
					}
				],
				callback: async (action) => {
					let bypassState = action.options.bypass
					const key = `f.${action.options.unit}.bypass`
					
					if (bypassState === 2) {
						const currentState = instance.state.channels[key] || 0
						bypassState = currentState ? 0 : 1
					}
					
					instance.setParameter(key, bypassState)
				}
			},

			setReverb: {
				name: 'Set Reverb Parameters',
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
					},
					{
						type: 'number',
						label: 'Pre-delay (ms)',
						id: 'predelay',
						default: 0,
						min: 0,
						max: 50,
						step: 1
					},
					{
						type: 'number',
						label: 'Time (ms)',
						id: 'time',
						default: 1000,
						min: 200,
						max: 8000,
						step: 100
					},
					{
						type: 'number',
						label: 'Low-Pass Filter (Hz)',
						id: 'lpf',
						default: 10000,
						min: 400,
						max: 20000,
						step: 100
					}
				],
				callback: async (action) => {
					const unit = action.options.unit
					const prefix = `f.${unit}`
					
					// Normalize values
					const predelayNorm = action.options.predelay / 50
					const timeNorm = (action.options.time - 200) / (8000 - 200)
					const lpfNorm = Math.log(action.options.lpf / 400) / Math.log(20000 / 400)
					
					instance.setParameter(`${prefix}.predelay`, predelayNorm)
					instance.setParameter(`${prefix}.time`, timeNorm)
					instance.setParameter(`${prefix}.lpf`, lpfNorm)
				}
			},

			setDelay: {
				name: 'Set Delay Parameters',
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
					},
					{
						type: 'number',
						label: 'Time (ms)',
						id: 'time',
						default: 500,
						min: 100,
						max: 2000,
						step: 10
					},
					{
						type: 'number',
						label: 'Feedback (%)',
						id: 'feedback',
						default: 30,
						min: 0,
						max: 100,
						step: 1
					},
					{
						type: 'number',
						label: 'Low-Pass Filter (Hz)',
						id: 'lpf',
						default: 8000,
						min: 20,
						max: 20000,
						step: 100
					}
				],
				callback: async (action) => {
					const unit = action.options.unit
					const prefix = `f.${unit}`
					
					// Normalize values
					const timeNorm = (action.options.time - 100) / (2000 - 100)
					const feedbackNorm = action.options.feedback / 100
					const lpfNorm = Math.log(action.options.lpf / 20) / Math.log(20000 / 20)
					
					instance.setParameter(`${prefix}.time`, timeNorm)
					instance.setParameter(`${prefix}.feedback`, feedbackNorm)
					instance.setParameter(`${prefix}.lpf`, lpfNorm)
				}
			},

			setFXSend: {
				name: 'Set FX Send Level',
				options: [
					{
						type: 'dropdown',
						label: 'Source Channel Type',
						id: 'channelType',
						default: 'i',
						choices: [
							{ id: 'i', label: 'Input' },
							{ id: 'p', label: 'Player' },
							{ id: 's', label: 'Samples' }
						]
					},
					{
						type: 'number',
						label: 'Source Channel',
						id: 'channel',
						default: 1,
						min: 1,
						max: 4
					},
					{
						type: 'dropdown',
						label: 'FX Unit',
						id: 'fxUnit',
						default: 0,
						choices: [
							{ id: 0, label: 'FX 1' },
							{ id: 1, label: 'FX 2' }
						]
					},
					{
						type: 'number',
						label: 'Send Level (0.0-1.0)',
						id: 'level',
						default: 0.5,
						min: 0,
						max: 1,
						step: 0.01
					}
				],
				callback: async (action) => {
					const channelType = action.options.channelType
					const channel = action.options.channel - 1
					const fx = action.options.fxUnit
					const key = `${channelType}.${channel}.fx.${fx}.value`
					instance.setParameter(key, action.options.level)
				}
			},

			// === SAMPLE BANK CONTROLS ===
			triggerSample: {
				name: 'Trigger Sample Pad',
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
				callback: async (action) => {
					const bank = action.options.bank
					const pad = action.options.pad
					const key = `B.${bank}.${pad}.state`
					// State 3 = PLAY (from backend: PLAY:3)
					instance.setParameter(key, 3)
				}
			},

			stopSample: {
				name: 'Stop Sample Pad',
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
				callback: async (action) => {
					const bank = action.options.bank
					const pad = action.options.pad
					const key = `B.${bank}.${pad}.state`
					// State 2 = STOP
					instance.setParameter(key, 2)
				}
			},

			stopAllSamples: {
				name: 'Stop All Samples',
				options: [],
				callback: async (action) => {
					// Send command to stop all active pads
					instance.sendCommand('STOP_ACTIVE_PADS', {})
				}
			},

			selectBank: {
				name: 'Select Sample Bank',
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
					}
				],
				callback: async (action) => {
					instance.setParameter('bank', action.options.bank)
				}
			},

			// === RECORDING CONTROLS ===
			startRecording: {
				name: 'Start Recording',
				options: [
					{
						type: 'dropdown',
						label: 'Destination',
						id: 'destination',
						default: 'usb',
						choices: [
							{ id: 'usb', label: 'USB Drive' },
							{ id: 'sd', label: 'SD Card' },
							{ id: 'computer', label: 'To Computer' }
						]
					}
				],
				callback: async (action) => {
					const dest = action.options.destination
					
					// Set recording destination
					if (dest === 'usb') {
						instance.setParameter('settings.rec.toUSB', 1)
					} else if (dest === 'computer') {
						instance.setParameter('settings.rec.toComputer', 1)
					}
					
					// Start recording (recState: 1 = ACTIVE)
					instance.setParameter('recState', 1)
				}
			},

			stopRecording: {
				name: 'Stop Recording',
				options: [],
				callback: async (action) => {
					// Stop recording (recState: 3 = SAVING, then 4 = SAVED)
					instance.setParameter('recState', 3)
				}
			},

			pauseRecording: {
				name: 'Pause Recording',
				options: [],
				callback: async (action) => {
					// Pause recording (recState: 2 = PAUSED)
					instance.setParameter('recState', 2)
				}
			},

			// === NOISE GATE CONTROLS ===
			setGateBypass: {
				name: 'Gate Bypass',
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
						type: 'dropdown',
						label: 'Bypass State',
						id: 'bypass',
						default: 1,
						choices: [
							{ id: 0, label: 'Active (Gate On)' },
							{ id: 1, label: 'Bypass (Gate Off)' },
							{ id: 2, label: 'Toggle' }
						]
					}
				],
				callback: async (action) => {
					const channelType = action.options.channelType
					const channel = action.options.channel - 1
					let bypassState = action.options.bypass
					
					const key = `${channelType}.${channel}.gate.bypass`
					
					if (bypassState === 2) {
						const currentState = instance.state.channels[key] || 0
						bypassState = currentState ? 0 : 1
					}
					
					instance.setParameter(key, bypassState)
				}
			},

			setGate: {
				name: 'Set Noise Gate',
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
						label: 'Threshold (dB)',
						id: 'thresh',
						default: -40,
						min: -60,
						max: 0
					},
					{
						type: 'number',
						label: 'Range/Depth (dB)',
						id: 'range',
						default: -80,
						min: -80,
						max: 0
					},
					{
						type: 'number',
						label: 'Attack (ms)',
						id: 'attack',
						default: 1,
						min: 0.5,
						max: 500,
						step: 0.5
					},
					{
						type: 'number',
						label: 'Hold (ms)',
						id: 'hold',
						default: 10,
						min: 0,
						max: 500,
						step: 1
					},
					{
						type: 'number',
						label: 'Release (ms)',
						id: 'release',
						default: 100,
						min: 10,
						max: 2000,
						step: 10
					}
				],
				callback: async (action) => {
					const channelType = action.options.channelType
					const channel = action.options.channel - 1
					const prefix = `${channelType}.${channel}.gate`
					
					// Normalize to 0-1
					const threshNorm = (action.options.thresh + 60) / 60
					const rangeNorm = (action.options.range + 80) / 80
					const attackNorm = Math.log(action.options.attack / 0.5) / Math.log(500 / 0.5)
					const holdNorm = Math.sqrt(action.options.hold / 500)  // Squared curve
					const releaseNorm = Math.log(action.options.release / 10) / Math.log(2000 / 10)
					
					instance.setParameter(`${prefix}.thresh`, threshNorm)
					instance.setParameter(`${prefix}.range`, rangeNorm)
					instance.setParameter(`${prefix}.attack`, attackNorm)
					instance.setParameter(`${prefix}.hold`, holdNorm)
					instance.setParameter(`${prefix}.release`, releaseNorm)
				}
			},

			// === DE-ESSER CONTROLS ===
			setDeEsserBypass: {
				name: 'De-Esser Bypass',
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
						type: 'dropdown',
						label: 'Bypass State',
						id: 'bypass',
						default: 1,
						choices: [
							{ id: 0, label: 'Active (De-Esser On)' },
							{ id: 1, label: 'Bypass (De-Esser Off)' },
							{ id: 2, label: 'Toggle' }
						]
					}
				],
				callback: async (action) => {
					const channelType = action.options.channelType
					const channel = action.options.channel - 1
					let bypassState = action.options.bypass
					
					const key = `${channelType}.${channel}.ds.bypass`
					
					if (bypassState === 2) {
						const currentState = instance.state.channels[key] || 0
						bypassState = currentState ? 0 : 1
					}
					
					instance.setParameter(key, bypassState)
				}
			},

			setDeEsser: {
				name: 'Set De-Esser',
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
						label: 'Threshold (dB)',
						id: 'thresh',
						default: -20,
						min: -96,
						max: 0
					},
					{
						type: 'number',
						label: 'Frequency (Hz)',
						id: 'freq',
						default: 6000,
						min: 2000,
						max: 12000,
						step: 100
					},
					{
						type: 'number',
						label: 'Q (Bandwidth)',
						id: 'q',
						default: 1.0,
						min: 0.1,
						max: 15,
						step: 0.1
					},
					{
						type: 'number',
						label: 'Range (dB)',
						id: 'range',
						default: -6,
						min: -15,
						max: 0,
						step: 0.5
					}
				],
				callback: async (action) => {
					const channelType = action.options.channelType
					const channel = action.options.channel - 1
					const prefix = `${channelType}.${channel}.ds`
					
					// Normalize to 0-1
					const threshNorm = (action.options.thresh + 96) / 96
					const freqNorm = Math.log(action.options.freq / 20) / Math.log(20000 / 20)
					const qNorm = Math.log(action.options.q / 0.1) / Math.log(15 / 0.1)
					const rangeNorm = (action.options.range + 15) / 15
					
					instance.setParameter(`${prefix}.thresh`, threshNorm)
					instance.setParameter(`${prefix}.freq`, freqNorm)
					instance.setParameter(`${prefix}.q`, qNorm)
					instance.setParameter(`${prefix}.range`, rangeNorm)
				}
			},

			// === PLAYER CONTROLS ===
			playerPlay: {
				name: 'Player Play',
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
				callback: async (action) => {
					const player = action.options.player
					const key = `player.${player}.state`
					// State 3 = PLAY
					instance.setParameter(key, 3)
				}
			},

			playerPause: {
				name: 'Player Pause',
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
				callback: async (action) => {
					const player = action.options.player
					const key = `player.${player}.state`
					// State 5 = PAUSE
					instance.setParameter(key, 5)
				}
			},

			playerStop: {
				name: 'Player Stop',
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
				callback: async (action) => {
					const player = action.options.player
					const key = `player.${player}.state`
					// State 2 = STOP
					instance.setParameter(key, 2)
				}
			},

			playerSeek: {
				name: 'Player Seek Position',
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
					},
					{
						type: 'number',
						label: 'Position (seconds)',
						id: 'position',
						default: 0,
						min: 0,
						max: 7200
					}
				],
				callback: async (action) => {
					const player = action.options.player
					const key = `player.${player}.seekPos`
					instance.setParameter(key, action.options.position)
				}
			},

			// === AUX BUS CONTROLS ===
			setAuxBusFader: {
				name: 'Set Aux Bus Fader',
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
					},
					{
						type: 'number',
						label: 'Level (0.0-1.0)',
						id: 'level',
						default: 0.75,
						min: 0,
						max: 1,
						step: 0.01
					}
				],
				callback: async (action) => {
					const aux = action.options.auxBus
					const key = `a.${aux}.mix`
					instance.setParameter(key, action.options.level)
				}
			},

			muteAuxBus: {
				name: 'Mute Aux Bus',
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
					},
					{
						type: 'dropdown',
						label: 'Mute State',
						id: 'mute',
						default: 1,
						choices: [
							{ id: 0, label: 'Unmute' },
							{ id: 1, label: 'Mute' },
							{ id: 2, label: 'Toggle' }
						]
					}
				],
				callback: async (action) => {
					const aux = action.options.auxBus
					let muteState = action.options.mute
					
					const key = `a.${aux}.mute`
					
					if (muteState === 2) {
						const currentState = instance.state.channels[key] || 0
						muteState = currentState ? 0 : 1
					}
					
					instance.setParameter(key, muteState)
				}
			},

			setAuxBusPan: {
				name: 'Set Aux Bus Pan',
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
					},
					{
						type: 'number',
						label: 'Pan (0.0=Left, 0.5=Center, 1.0=Right)',
						id: 'pan',
						default: 0.5,
						min: 0,
						max: 1,
						step: 0.01
					}
				],
				callback: async (action) => {
					const aux = action.options.auxBus
					const key = `a.${aux}.pan`
					instance.setParameter(key, action.options.pan)
				}
			},

			// === SNAPSHOT/SCENE CONTROLS ===
			recallSnapshot: {
				name: 'Recall Snapshot',
				options: [
					{
						type: 'dropdown',
						label: 'Snapshot',
						id: 'snapshot',
						default: 0,
						choices: [
							{ id: 0, label: 'Snapshot 1' },
							{ id: 1, label: 'Snapshot 2' },
							{ id: 2, label: 'Snapshot 3' },
							{ id: 3, label: 'Snapshot 4' },
							{ id: 4, label: 'Snapshot 5' }
						]
					}
				],
				callback: async (action) => {
					const snapshot = action.options.snapshot
					// Send command to recall snapshot
					instance.sendCommand('RECALL_SNAPSHOT', { snapshot: snapshot })
				}
			},

			saveSnapshot: {
				name: 'Save Snapshot',
				options: [
					{
						type: 'dropdown',
						label: 'Snapshot',
						id: 'snapshot',
						default: 0,
						choices: [
							{ id: 0, label: 'Snapshot 1' },
							{ id: 1, label: 'Snapshot 2' },
							{ id: 2, label: 'Snapshot 3' },
							{ id: 3, label: 'Snapshot 4' },
							{ id: 4, label: 'Snapshot 5' }
						]
					}
				],
				callback: async (action) => {
					const snapshot = action.options.snapshot
					// Send command to save snapshot
					instance.sendCommand('SAVE_SNAPSHOT', { snapshot: snapshot })
				}
			},

			// === AUTO-GAIN CONTROLS ===
			setAutoGain: {
				name: 'Auto-Gain Enable',
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
					},
					{
						type: 'dropdown',
						label: 'Auto-Gain State',
						id: 'state',
						default: 1,
						choices: [
							{ id: 0, label: 'Off' },
							{ id: 1, label: 'On' },
							{ id: 2, label: 'Toggle' }
						]
					}
				],
				callback: async (action) => {
					const channelType = action.options.channelType
					const channel = action.options.channel - 1
					let state = action.options.state
					
					const key = `${channelType}.${channel}.autogain`
					
					if (state === 2) {
						const currentState = instance.state.channels[key] || 0
						state = currentState ? 0 : 1
					}
					
					instance.setParameter(key, state)
				}
			},

			// === AUTO-MIX CONTROLS ===
			setAutoMix: {
				name: 'Auto-Mix Enable',
				options: [
					{
						type: 'dropdown',
						label: 'Auto-Mix State',
						id: 'state',
						default: 1,
						choices: [
							{ id: 0, label: 'Off' },
							{ id: 1, label: 'On' },
							{ id: 2, label: 'Toggle' }
						]
					}
				],
				callback: async (action) => {
					let state = action.options.state
					const key = 'settings.automix'
					
					if (state === 2) {
						const currentState = instance.state.channels[key] || 0
						state = currentState ? 0 : 1
					}
					
					instance.setParameter(key, state)
				}
			},

			setAutoMixWeight: {
				name: 'Set Auto-Mix Channel Weight',
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
					},
					{
						type: 'number',
						label: 'Weight/Priority (0.0-1.0)',
						id: 'weight',
						default: 0.5,
						min: 0,
						max: 1,
						step: 0.01
					}
				],
				callback: async (action) => {
					const channelType = action.options.channelType
					const channel = action.options.channel - 1
					const key = `${channelType}.${channel}.automix.weight`
					instance.setParameter(key, action.options.weight)
				}
			},

			// === NDI STREAMING CONTROLS ===
			setNDIEnable: {
				name: 'NDI Enable',
				options: [
					{
						type: 'dropdown',
						label: 'NDI State',
						id: 'state',
						default: 1,
						choices: [
							{ id: 0, label: 'Disable' },
							{ id: 1, label: 'Enable' },
							{ id: 2, label: 'Toggle' }
						]
					}
				],
				callback: async (action) => {
					let state = action.options.state
					const key = 'settings.ndi.enable'
					
					if (state === 2) {
						const currentState = instance.state.channels[key] || 0
						state = currentState ? 0 : 1
					}
					
					instance.setParameter(key, state)
				}
			},

			setNDIDeviceName: {
				name: 'Set NDI Device Name',
				options: [
					{
						type: 'textinput',
						label: 'Device Name',
						id: 'name',
						default: 'DLZ Creator'
					}
				],
				callback: async (action) => {
					const key = 'settings.ndi.name'
					instance.setParameter(key, action.options.name)
				}
			},

			scanNDIDevices: {
				name: 'Scan for NDI Devices',
				options: [],
				callback: async (action) => {
					instance.sendCommand('SCAN_NDI', {})
				}
			},

			// === BLUETOOTH CONTROLS ===
			setBluetoothEnable: {
				name: 'Bluetooth Enable',
				options: [
					{
						type: 'dropdown',
						label: 'Bluetooth State',
						id: 'state',
						default: 1,
						choices: [
							{ id: 0, label: 'Disable' },
							{ id: 1, label: 'Enable' },
							{ id: 2, label: 'Toggle' }
						]
					}
				],
				callback: async (action) => {
					let state = action.options.state
					const key = 'settings.bluetooth.enable'
					
					if (state === 2) {
						const currentState = instance.state.channels[key] || 0
						state = currentState ? 0 : 1
					}
					
					instance.setParameter(key, state)
				}
			},

			bluetoothPair: {
				name: 'Bluetooth Start Pairing',
				options: [],
				callback: async (action) => {
					instance.sendCommand('BT_PAIR', {})
				}
			},

			bluetoothDisconnect: {
				name: 'Bluetooth Disconnect',
				options: [],
				callback: async (action) => {
					instance.sendCommand('BT_DISCONNECT', {})
				}
			},

			// === SYSTEM SETTINGS ===
			setScreenBrightness: {
				name: 'Set Screen Brightness',
				options: [
					{
						type: 'number',
						label: 'Brightness (0-100)',
						id: 'brightness',
						default: 75,
						min: 0,
						max: 100
					}
				],
				callback: async (action) => {
					const key = 'settings.brightness.screen'
					instance.setParameter(key, action.options.brightness / 100)
				}
			},

			setButtonBrightness: {
				name: 'Set Button Brightness',
				options: [
					{
						type: 'number',
						label: 'Brightness (0-100)',
						id: 'brightness',
						default: 75,
						min: 0,
						max: 100
					}
				],
				callback: async (action) => {
					const key = 'settings.brightness.button'
					instance.setParameter(key, action.options.brightness / 100)
				}
			},

			setLayoutMode: {
				name: 'Set Layout Mode',
				options: [
					{
						type: 'dropdown',
						label: 'Mode',
						id: 'mode',
						default: 0,
						choices: [
							{ id: 0, label: 'EZ Mode' },
							{ id: 1, label: 'Advanced Mode' }
						]
					}
				],
				callback: async (action) => {
					const key = 'settings.layout'
					instance.setParameter(key, action.options.mode)
				}
			},

			restartGUI: {
				name: 'Restart GUI',
				options: [],
				callback: async (action) => {
					instance.sendCommand('RESTART_GUI', {})
				}
			},

			factoryReset: {
				name: 'Factory Reset',
				options: [
					{
						type: 'dropdown',
						label: 'Confirmation',
						id: 'confirm',
						default: 0,
						choices: [
							{ id: 0, label: 'No - Cancel' },
							{ id: 1, label: 'Yes - Reset Everything!' }
						]
					}
				],
				callback: async (action) => {
					if (action.options.confirm === 1) {
						instance.sendCommand('FACTORY_RESET', {})
						instance.log('warn', 'Factory reset initiated!')
					}
				}
			},

			// === ADVANCED SAMPLE CONTROLS ===
			setSampleMode: {
				name: 'Set Sample Playback Mode',
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
					},
					{
						type: 'dropdown',
						label: 'Mode',
						id: 'mode',
						default: 0,
						choices: [
							{ id: 0, label: 'One-Shot' },
							{ id: 1, label: 'Loop' },
							{ id: 2, label: 'Hold' },
							{ id: 3, label: 'Bleep' }
						]
					}
				],
				callback: async (action) => {
					const bank = action.options.bank
					const pad = action.options.pad
					const key = `B.${bank}.${pad}.mode`
					instance.setParameter(key, action.options.mode)
				}
			},

			setSampleVolume: {
				name: 'Set Sample Volume/Trim',
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
					},
					{
						type: 'number',
						label: 'Volume (dB)',
						id: 'volume',
						default: 0,
						min: -40,
						max: 0,
						step: 0.5
					}
				],
				callback: async (action) => {
					const bank = action.options.bank
					const pad = action.options.pad
					const key = `B.${bank}.${pad}.trim`
					// Normalize -40 to 0 dB to 0.0-1.0
					const normalized = (action.options.volume + 40) / 40
					instance.setParameter(key, normalized)
				}
			},

			setSampleFade: {
				name: 'Set Sample Fade Times',
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
					},
					{
						type: 'number',
						label: 'Fade In (ms)',
						id: 'fadeIn',
						default: 10,
						min: 1,
						max: 1000
					},
					{
						type: 'number',
						label: 'Fade Out (ms)',
						id: 'fadeOut',
						default: 10,
						min: 1,
						max: 5000
					}
				],
				callback: async (action) => {
					const bank = action.options.bank
					const pad = action.options.pad
					const prefix = `B.${bank}.${pad}`
					
					// Normalize to 0-1
					const fadeInNorm = (action.options.fadeIn - 1) / 999
					const fadeOutNorm = (action.options.fadeOut - 1) / 4999
					
					instance.setParameter(`${prefix}.fadeIn`, fadeInNorm)
					instance.setParameter(`${prefix}.fadeOut`, fadeOutNorm)
				}
			},

			setSampleStartEnd: {
				name: 'Set Sample Start/End Points',
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
					},
					{
						type: 'number',
						label: 'Start Time (ms)',
						id: 'start',
						default: 0,
						min: 0,
						max: 3000
					},
					{
						type: 'number',
						label: 'End Time (ms)',
						id: 'end',
						default: 3000,
						min: 0,
						max: 3000
					}
				],
				callback: async (action) => {
					const bank = action.options.bank
					const pad = action.options.pad
					const prefix = `B.${bank}.${pad}`
					
					// Normalize to 0-1
					const startNorm = action.options.start / 3000
					const endNorm = action.options.end / 3000
					
					instance.setParameter(`${prefix}.start`, startNorm)
					instance.setParameter(`${prefix}.end`, endNorm)
				}
			},

			muteBank: {
				name: 'Mute Sample Bank',
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
						label: 'Mute State',
						id: 'mute',
						default: 1,
						choices: [
							{ id: 0, label: 'Unmute' },
							{ id: 1, label: 'Mute' },
							{ id: 2, label: 'Toggle' }
						]
					}
				],
				callback: async (action) => {
					const bank = action.options.bank
					let muteState = action.options.mute
					
					const key = `B.${bank}.mute`
					
					if (muteState === 2) {
						const currentState = instance.state.channels[key] || 0
						muteState = currentState ? 0 : 1
					}
					
					instance.setParameter(key, muteState)
				}
			},

			// === CHANNEL COLOR/NAMING ===
			setChannelColor: {
				name: 'Set Channel Color',
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
						type: 'dropdown',
						label: 'Color',
						id: 'color',
						default: 0,
						choices: [
							{ id: 0, label: 'Default' },
							{ id: 1, label: 'Red' },
							{ id: 2, label: 'Orange' },
							{ id: 3, label: 'Yellow' },
							{ id: 4, label: 'Green' },
							{ id: 5, label: 'Cyan' },
							{ id: 6, label: 'Blue' },
							{ id: 7, label: 'Purple' },
							{ id: 8, label: 'Pink' },
							{ id: 9, label: 'White' },
							{ id: 10, label: 'Gray' }
						]
					}
				],
				callback: async (action) => {
					const channelType = action.options.channelType
					const channel = action.options.channel - 1
					const key = `${channelType}.${channel}.color`
					instance.setParameter(key, action.options.color)
				}
			},

			// === MASTER DELAY ===
			setMasterDelay: {
				name: 'Set Master Delay',
				options: [
					{
						type: 'number',
						label: 'Delay (ms)',
						id: 'delay',
						default: 0,
						min: 0,
						max: 250,
						step: 1
					}
				],
				callback: async (action) => {
					const key = 'm.delay'
					// Normalize to 0-1
					const normalized = action.options.delay / 250
					instance.setParameter(key, normalized)
				}
			}
		}
	}
}
