const { combineRgb } = require('@companion-module/base')

module.exports = {
	getPresets(instance) {
		const presets = {}

		// Input channel presets
		for (let i = 1; i <= 4; i++) {
			// Mute button
			presets[`mute_input_${i}`] = {
				type: 'button',
				category: `Input ${i}`,
				name: `Mute Input ${i}`,
				style: {
					text: `Mute\\nIN ${i}`,
					size: '18',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 0, 0),
				},
				steps: [
					{
						down: [
							{
								actionId: 'muteChannel',
								options: {
									channelType: 'i',
									channel: i,
									mute: 2, // Toggle
								},
							},
						],
						up: [],
					},
				],
				feedbacks: [
					{
						feedbackId: 'channel_mute',
						options: {
							channelType: 'i',
							channel: i,
						},
						style: {
							bgcolor: combineRgb(255, 0, 0),
							color: combineRgb(255, 255, 255),
						},
					},
				],
			}

			// Solo button
			presets[`solo_input_${i}`] = {
				type: 'button',
				category: `Input ${i}`,
				name: `Solo Input ${i}`,
				style: {
					text: `Solo\\nIN ${i}`,
					size: '18',
					color: combineRgb(0, 0, 0),
					bgcolor: combineRgb(128, 128, 128),
				},
				steps: [
					{
						down: [
							{
								actionId: 'soloChannel',
								options: {
									channelType: 'i',
									channel: i,
									solo: 2, // Toggle
								},
							},
						],
						up: [],
					},
				],
				feedbacks: [
					{
						feedbackId: 'channel_solo',
						options: {
							channelType: 'i',
							channel: i,
						},
						style: {
							bgcolor: combineRgb(255, 255, 0),
							color: combineRgb(0, 0, 0),
						},
					},
				],
			}

			// Phantom power button
			presets[`phantom_input_${i}`] = {
				type: 'button',
				category: `Input ${i}`,
				name: `Phantom Power Input ${i}`,
				style: {
					text: `48V\\nIN ${i}`,
					size: '18',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 0, 0),
				},
				steps: [
					{
						down: [
							{
								actionId: 'setPhantomPower',
								options: {
									channel: i,
									phantom: 2, // Toggle
								},
							},
						],
						up: [],
					},
				],
				feedbacks: [
					{
						feedbackId: 'phantom_power',
						options: {
							channel: i,
						},
						style: {
							bgcolor: combineRgb(255, 100, 0),
							color: combineRgb(255, 255, 255),
						},
					},
				],
			}

			// Fader level display
			presets[`fader_input_${i}`] = {
				type: 'button',
				category: `Input ${i}`,
				name: `Input ${i} Fader Level`,
				style: {
					text: `IN ${i}\\n$(mackie-dlz-creator:input_${i}_fader_db)`,
					size: '14',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 0, 0),
				},
				steps: [
					{
						down: [],
						up: [],
					},
				],
				feedbacks: [],
			}

			// VU meter
			presets[`vu_input_${i}`] = {
				type: 'button',
				category: `Input ${i}`,
				name: `Input ${i} VU Meter`,
				style: {
					text: `VU\\nIN ${i}\\n$(mackie-dlz-creator:input_${i}_meter)`,
					size: '14',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 0, 0),
				},
				steps: [
					{
						down: [],
						up: [],
					},
				],
				feedbacks: [
					{
						feedbackId: 'vu_level',
						options: {
							channelType: 'i',
							channel: i,
							red_threshold: -3,
							yellow_threshold: -12,
						},
					},
				],
			}
		}

		// Player channel presets
		for (let i = 1; i <= 3; i++) {
			// Mute button
			presets[`mute_player_${i}`] = {
				type: 'button',
				category: `Player ${i}`,
				name: `Mute Player ${i}`,
				style: {
					text: `Mute\\nPLR ${i}`,
					size: '18',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 0, 0),
				},
				steps: [
					{
						down: [
							{
								actionId: 'muteChannel',
								options: {
									channelType: 'p',
									channel: i,
									mute: 2, // Toggle
								},
							},
						],
						up: [],
					},
				],
				feedbacks: [
					{
						feedbackId: 'channel_mute',
						options: {
							channelType: 'p',
							channel: i,
						},
						style: {
							bgcolor: combineRgb(255, 0, 0),
							color: combineRgb(255, 255, 255),
						},
					},
				],
			}

			// Solo button
			presets[`solo_player_${i}`] = {
				type: 'button',
				category: `Player ${i}`,
				name: `Solo Player ${i}`,
				style: {
					text: `Solo\\nPLR ${i}`,
					size: '18',
					color: combineRgb(0, 0, 0),
					bgcolor: combineRgb(128, 128, 128),
				},
				steps: [
					{
						down: [
							{
								actionId: 'soloChannel',
								options: {
									channelType: 'p',
									channel: i,
									solo: 2, // Toggle
								},
							},
						],
						up: [],
					},
				],
				feedbacks: [
					{
						feedbackId: 'channel_solo',
						options: {
							channelType: 'p',
							channel: i,
						},
						style: {
							bgcolor: combineRgb(255, 255, 0),
							color: combineRgb(0, 0, 0),
						},
					},
				],
			}
		}

		// Master presets
		presets['mute_master'] = {
			type: 'button',
			category: 'Master',
			name: 'Mute Master',
			style: {
				text: 'Mute\\nMaster',
				size: '18',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 0),
			},
			steps: [
				{
					down: [
						{
							actionId: 'muteChannel',
							options: {
								channelType: 'm',
								channel: 1,
								mute: 2, // Toggle
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'channel_mute',
					options: {
						channelType: 'm',
						channel: 1,
					},
					style: {
						bgcolor: combineRgb(255, 0, 0),
						color: combineRgb(255, 255, 255),
					},
				},
			],
		}

		presets['fader_master'] = {
			type: 'button',
			category: 'Master',
			name: 'Master Fader Level',
			style: {
				text: 'Master\\n$(mackie-dlz-creator:master_fader_db)',
				size: '14',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 0),
			},
			steps: [
				{
					down: [],
					up: [],
				},
			],
			feedbacks: [],
		}

		// Recording presets
		presets['start_recording'] = {
			type: 'button',
			category: 'Recording',
			name: 'Start Recording',
			style: {
				text: 'REC\\nStart',
				size: '18',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(64, 0, 0),
			},
			steps: [
				{
					down: [
						{
							actionId: 'startRecording',
							options: {
								destination: 'usb',
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'recording_active',
					options: {},
					style: {
						bgcolor: combineRgb(255, 0, 0),
						color: combineRgb(255, 255, 255),
					},
				},
			],
		}

		presets['stop_recording'] = {
			type: 'button',
			category: 'Recording',
			name: 'Stop Recording',
			style: {
				text: 'REC\\nStop',
				size: '18',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 0),
			},
			steps: [
				{
					down: [
						{
							actionId: 'stopRecording',
							options: {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		}

		presets['recording_status'] = {
			type: 'button',
			category: 'Recording',
			name: 'Recording Status',
			style: {
				text: 'REC\\n$(mackie-dlz-creator:recording_state)\\n$(mackie-dlz-creator:recording_time)',
				size: '14',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 0),
			},
			steps: [
				{
					down: [],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'recording_active',
					options: {},
					style: {
						bgcolor: combineRgb(255, 0, 0),
						color: combineRgb(255, 255, 255),
					},
				},
			],
		}

		// Sample bank presets
		for (let bank = 0; bank < 8; bank++) {
			presets[`select_bank_${bank + 1}`] = {
				type: 'button',
				category: 'Sample Banks',
				name: `Select Bank ${bank + 1}`,
				style: {
					text: `Bank\\n${bank + 1}`,
					size: '18',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 64, 0),
				},
				steps: [
					{
						down: [
							{
								actionId: 'selectBank',
								options: {
									bank: bank,
								},
							},
						],
						up: [],
					},
				],
				feedbacks: [],
			}
		}

		// Sample pad presets (for bank 0 as example)
		for (let pad = 0; pad < 6; pad++) {
			presets[`trigger_pad_${pad + 1}`] = {
				type: 'button',
				category: 'Sample Pads',
				name: `Trigger Pad ${pad + 1}`,
				style: {
					text: `PAD\\n${pad + 1}\\n$(mackie-dlz-creator:sample_${pad + 1}_name)`,
					size: '14',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(64, 64, 0),
				},
				steps: [
					{
						down: [
							{
								actionId: 'triggerSample',
								options: {
									bank: 0,
									pad: pad,
								},
							},
						],
						up: [
							{
								actionId: 'stopSample',
								options: {
									bank: 0,
									pad: pad,
								},
							},
						],
					},
				],
				feedbacks: [
					{
						feedbackId: 'sample_playing',
						options: {
							bank: 0,
							pad: pad,
						},
						style: {
							bgcolor: combineRgb(0, 255, 0),
							color: combineRgb(0, 0, 0),
						},
					},
				],
			}
		}

		// EQ/Compressor presets (for input 1 as example)
		presets['eq_bypass_in1'] = {
			type: 'button',
			category: 'Input 1',
			name: 'Input 1 EQ Bypass',
			style: {
				text: 'EQ\\nIN 1',
				size: '18',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 0),
			},
			steps: [
				{
					down: [
						{
							actionId: 'setEQBypass',
							options: {
								channelType: 'i',
								channel: 1,
								bypass: 2, // Toggle
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'eq_bypass',
					options: {
						channelType: 'i',
						channel: 1,
					},
					style: {
						bgcolor: combineRgb(0, 128, 0),
						color: combineRgb(255, 255, 255),
					},
				},
			],
		}

		presets['comp_bypass_in1'] = {
			type: 'button',
			category: 'Input 1',
			name: 'Input 1 Compressor Bypass',
			style: {
				text: 'COMP\\nIN 1',
				size: '18',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 0),
			},
			steps: [
				{
					down: [
						{
							actionId: 'setCompressorBypass',
							options: {
								channelType: 'i',
								channel: 1,
								bypass: 2, // Toggle
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'compressor_bypass',
					options: {
						channelType: 'i',
						channel: 1,
					},
					style: {
						bgcolor: combineRgb(0, 150, 255),
						color: combineRgb(255, 255, 255),
					},
				},
			],
		}

		// FX presets
		presets['reverb_bypass'] = {
			type: 'button',
			category: 'FX',
			name: 'Reverb Bypass',
			style: {
				text: 'REVERB',
				size: '18',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 0),
			},
			steps: [
				{
					down: [
						{
							actionId: 'setReverbBypass',
							options: {
								unit: 0,
								bypass: 2, // Toggle
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'fx_bypass',
					options: {
						unit: 0,
					},
					style: {
						bgcolor: combineRgb(150, 0, 255),
						color: combineRgb(255, 255, 255),
					},
				},
			],
		}

		// Player controls
		for (let player = 0; player < 3; player++) {
			presets[`player_${player + 1}_play`] = {
				type: 'button',
				category: `Player ${player + 1}`,
				name: `Player ${player + 1} Play`,
				style: {
					text: `▶\\nPLR ${player + 1}`,
					size: '24',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 64, 0),
				},
				steps: [
					{
						down: [
							{
								actionId: 'playerPlay',
								options: {
									player: player,
								},
							},
						],
						up: [],
					},
				],
				feedbacks: [
					{
						feedbackId: 'player_playing',
						options: {
							player: player,
						},
						style: {
							bgcolor: combineRgb(0, 200, 0),
							color: combineRgb(255, 255, 255),
						},
					},
				],
			}

			presets[`player_${player + 1}_stop`] = {
				type: 'button',
				category: `Player ${player + 1}`,
				name: `Player ${player + 1} Stop`,
				style: {
					text: `■\\nPLR ${player + 1}`,
					size: '24',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(64, 0, 0),
				},
				steps: [
					{
						down: [
							{
								actionId: 'playerStop',
								options: {
									player: player,
								},
							},
						],
						up: [],
					},
				],
				feedbacks: [],
			}

			presets[`player_${player + 1}_status`] = {
				type: 'button',
				category: `Player ${player + 1}`,
				name: `Player ${player + 1} Status`,
				style: {
					text: `PLR ${player + 1}\\n$(mackie-dlz-creator:player_${player + 1}_state)\\n$(mackie-dlz-creator:player_${player + 1}_position)`,
					size: '14',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 0, 0),
				},
				steps: [
					{
						down: [],
						up: [],
					},
				],
				feedbacks: [
					{
						feedbackId: 'player_playing',
						options: {
							player: player,
						},
						style: {
							bgcolor: combineRgb(0, 128, 0),
							color: combineRgb(255, 255, 255),
						},
					},
				],
			}
		}

		// Aux bus controls
		for (let aux = 0; aux < 4; aux++) {
			presets[`aux_${aux + 1}_mute`] = {
				type: 'button',
				category: `Aux ${aux + 1}`,
				name: `Aux ${aux + 1} Mute`,
				style: {
					text: `Mute\\nAux ${aux + 1}`,
					size: '18',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 0, 0),
				},
				steps: [
					{
						down: [
							{
								actionId: 'muteAuxBus',
								options: {
									auxBus: aux,
									mute: 2, // Toggle
								},
							},
						],
						up: [],
					},
				],
				feedbacks: [
					{
						feedbackId: 'aux_muted',
						options: {
							auxBus: aux,
						},
						style: {
							bgcolor: combineRgb(255, 0, 0),
							color: combineRgb(255, 255, 255),
						},
					},
				],
			}

			presets[`aux_${aux + 1}_fader`] = {
				type: 'button',
				category: `Aux ${aux + 1}`,
				name: `Aux ${aux + 1} Fader`,
				style: {
					text: `Aux ${aux + 1}\\n$(mackie-dlz-creator:aux_${aux + 1}_fader_db)`,
					size: '14',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 0, 0),
				},
				steps: [
					{
						down: [],
						up: [],
					},
				],
				feedbacks: [],
			}
		}

		// Gate/De-esser for Input 1
		presets['gate_bypass_in1'] = {
			type: 'button',
			category: 'Input 1',
			name: 'Input 1 Gate Bypass',
			style: {
				text: 'GATE\\nIN 1',
				size: '18',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 0),
			},
			steps: [
				{
					down: [
						{
							actionId: 'setGateBypass',
							options: {
								channelType: 'i',
								channel: 1,
								bypass: 2, // Toggle
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'gate_bypass',
					options: {
						channelType: 'i',
						channel: 1,
					},
					style: {
						bgcolor: combineRgb(255, 150, 0),
						color: combineRgb(255, 255, 255),
					},
				},
			],
		}

		presets['deesser_bypass_in1'] = {
			type: 'button',
			category: 'Input 1',
			name: 'Input 1 De-Esser Bypass',
			style: {
				text: 'DS\\nIN 1',
				size: '18',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 0),
			},
			steps: [
				{
					down: [
						{
							actionId: 'setDeEsserBypass',
							options: {
								channelType: 'i',
								channel: 1,
								bypass: 2, // Toggle
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'deesser_bypass',
					options: {
						channelType: 'i',
						channel: 1,
					},
					style: {
						bgcolor: combineRgb(255, 200, 0),
						color: combineRgb(0, 0, 0),
					},
				},
			],
		}

		// Snapshot controls
		for (let snap = 0; snap < 5; snap++) {
			presets[`recall_snapshot_${snap + 1}`] = {
				type: 'button',
				category: 'Snapshots',
				name: `Recall Snapshot ${snap + 1}`,
				style: {
					text: `SNAP\\n${snap + 1}`,
					size: '18',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 64, 64),
				},
				steps: [
					{
						down: [
							{
								actionId: 'recallSnapshot',
								options: {
									snapshot: snap,
								},
							},
						],
						up: [],
					},
				],
				feedbacks: [],
			}
		}

		// Auto-Mix controls
		presets['automix_toggle'] = {
			type: 'button',
			category: 'System',
			name: 'Auto-Mix Toggle',
			style: {
				text: 'AUTO\\nMIX',
				size: '18',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 0),
			},
			steps: [
				{
					down: [
						{
							actionId: 'setAutoMix',
							options: {
								state: 2, // Toggle
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'automix_active',
					options: {},
					style: {
						bgcolor: combineRgb(255, 150, 0),
						color: combineRgb(0, 0, 0),
					},
				},
			],
		}

		// Auto-Gain for Input 1
		presets['autogain_in1'] = {
			type: 'button',
			category: 'Input 1',
			name: 'Input 1 Auto-Gain',
			style: {
				text: 'AUTO\\nGAIN\\nIN 1',
				size: '14',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 0),
			},
			steps: [
				{
					down: [
						{
							actionId: 'setAutoGain',
							options: {
								channelType: 'i',
								channel: 1,
								state: 2, // Toggle
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'autogain_active',
					options: {
						channelType: 'i',
						channel: 1,
					},
					style: {
						bgcolor: combineRgb(0, 255, 100),
						color: combineRgb(0, 0, 0),
					},
				},
			],
		}

		// NDI controls
		presets['ndi_toggle'] = {
			type: 'button',
			category: 'System',
			name: 'NDI Toggle',
			style: {
				text: 'NDI\\n$(mackie-dlz-creator:ndi_status)',
				size: '18',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 0),
			},
			steps: [
				{
					down: [
						{
							actionId: 'setNDIEnable',
							options: {
								state: 2, // Toggle
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'ndi_enabled',
					options: {},
					style: {
						bgcolor: combineRgb(0, 150, 255),
						color: combineRgb(255, 255, 255),
					},
				},
			],
		}

		// Bluetooth controls
		presets['bluetooth_toggle'] = {
			type: 'button',
			category: 'System',
			name: 'Bluetooth Toggle',
			style: {
				text: 'BT\\n$(mackie-dlz-creator:bluetooth_status)',
				size: '14',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 0),
			},
			steps: [
				{
					down: [
						{
							actionId: 'setBluetoothEnable',
							options: {
								state: 2, // Toggle
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'bluetooth_connected',
					options: {},
					style: {
						bgcolor: combineRgb(0, 100, 255),
						color: combineRgb(255, 255, 255),
					},
				},
			],
		}

		// System info
		presets['system_status'] = {
			type: 'button',
			category: 'System',
			name: 'System Status',
			style: {
				text: 'SYS\\n$(mackie-dlz-creator:layout_mode)\\nBr:$(mackie-dlz-creator:screen_brightness)',
				size: '12',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 0),
			},
			steps: [
				{
					down: [],
					up: [],
				},
			],
			feedbacks: [],
		}

		return presets
	},
}
