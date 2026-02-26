module.exports = {
	getVariables(instance) {
		const variables = []

		// Connection status
		variables.push({
			variableId: 'connection_status',
			name: 'Connection Status',
		})

		// Input channel variables
		for (let i = 0; i < 4; i++) {
			variables.push({
				variableId: `input_${i + 1}_fader`,
				name: `Input ${i + 1} Fader Level`,
			})

			variables.push({
				variableId: `input_${i + 1}_fader_db`,
				name: `Input ${i + 1} Fader (dB)`,
			})

			variables.push({
				variableId: `input_${i + 1}_mute`,
				name: `Input ${i + 1} Mute State`,
			})

			variables.push({
				variableId: `input_${i + 1}_solo`,
				name: `Input ${i + 1} Solo State`,
			})

			variables.push({
				variableId: `input_${i + 1}_pan`,
				name: `Input ${i + 1} Pan`,
			})

			variables.push({
				variableId: `input_${i + 1}_gain`,
				name: `Input ${i + 1} Gain`,
			})

			variables.push({
				variableId: `input_${i + 1}_phantom`,
				name: `Input ${i + 1} Phantom Power`,
			})

			variables.push({
				variableId: `input_${i + 1}_meter`,
				name: `Input ${i + 1} VU Meter Level`,
			})
		}

		// Player channel variables
		for (let i = 0; i < 3; i++) {
			variables.push({
				variableId: `player_${i + 1}_fader`,
				name: `Player ${i + 1} Fader Level`,
			})

			variables.push({
				variableId: `player_${i + 1}_fader_db`,
				name: `Player ${i + 1} Fader (dB)`,
			})

			variables.push({
				variableId: `player_${i + 1}_mute`,
				name: `Player ${i + 1} Mute State`,
			})

			variables.push({
				variableId: `player_${i + 1}_solo`,
				name: `Player ${i + 1} Solo State`,
			})

			variables.push({
				variableId: `player_${i + 1}_pan`,
				name: `Player ${i + 1} Pan`,
			})
		}

		// Master variables
		variables.push({
			variableId: 'master_fader',
			name: 'Master Fader Level',
		})

		variables.push({
			variableId: 'master_fader_db',
			name: 'Master Fader (dB)',
		})

		variables.push({
			variableId: 'master_mute',
			name: 'Master Mute State',
		})

		// Recording variables
		variables.push({
			variableId: 'recording_state',
			name: 'Recording State',
		})

		variables.push({
			variableId: 'recording_time',
			name: 'Recording Time',
		})

		variables.push({
			variableId: 'recording_destination',
			name: 'Recording Destination',
		})

		// Current bank
		variables.push({
			variableId: 'current_bank',
			name: 'Current Sample Bank',
		})

		// Sample states (for current bank)
		for (let i = 0; i < 6; i++) {
			variables.push({
				variableId: `sample_${i + 1}_state`,
				name: `Sample Pad ${i + 1} State`,
			})

			variables.push({
				variableId: `sample_${i + 1}_name`,
				name: `Sample Pad ${i + 1} Name`,
			})
		}

		// Player states
		for (let i = 0; i < 3; i++) {
			variables.push({
				variableId: `player_${i + 1}_state`,
				name: `Player ${i + 1} State`,
			})

			variables.push({
				variableId: `player_${i + 1}_position`,
				name: `Player ${i + 1} Position`,
			})

			variables.push({
				variableId: `player_${i + 1}_duration`,
				name: `Player ${i + 1} Duration`,
			})
		}

		// Aux bus variables
		for (let i = 0; i < 4; i++) {
			variables.push({
				variableId: `aux_${i + 1}_fader`,
				name: `Aux ${i + 1} Fader Level`,
			})

			variables.push({
				variableId: `aux_${i + 1}_fader_db`,
				name: `Aux ${i + 1} Fader (dB)`,
			})

			variables.push({
				variableId: `aux_${i + 1}_mute`,
				name: `Aux ${i + 1} Mute State`,
			})
		}

		// System status variables
		variables.push({
			variableId: 'bluetooth_status',
			name: 'Bluetooth Status',
		})

		variables.push({
			variableId: 'ndi_status',
			name: 'NDI Status',
		})

		variables.push({
			variableId: 'automix_status',
			name: 'Auto-Mix Status',
		})

		variables.push({
			variableId: 'layout_mode',
			name: 'Layout Mode',
		})

		variables.push({
			variableId: 'screen_brightness',
			name: 'Screen Brightness',
		})

		return variables
	},
}
