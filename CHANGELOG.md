# Changelog

All notable changes to the Mackie DLZ Creator Companion module will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.2] - 2025-02-26

### Changed

- Implemented yarn to comply with rules for companion
- Implemented prettier for code formatting
- Added .gitattributes, .yarnrc.yml and .prettierignore
- Created detailed help file for Companion

## [1.0.1] - 2025-02-24

### Fixed

- Companion manifest broken (#1)

## [1.0.0] - 2025-02-23

### Added - Initial Release

Complete feature implementation for Mackie DLZ Creator control.

#### Channel Control

- Fader/Mix level control for all channels (Inputs, Players, Master, Aux, FX)
- Mute and Solo functionality
- Pan control
- Input gain control (0-60 dB)
- Phantom power (+48V) control
- Channel color coding (11 colors)

#### Signal Processing

- **EQ**: High-pass filter + 3-band parametric EQ per channel
  - Frequency, Gain, Q control for each band
  - EQ bypass
- **Compressor**: Full dynamics control
  - Threshold, Ratio, Attack, Release, Makeup Gain
  - Compressor bypass
- **Noise Gate**: Threshold, Range, Attack, Hold, Release
  - Gate bypass
- **De-Esser**: Frequency-selective compression
  - Threshold, Frequency, Q, Range
  - De-esser bypass

#### Routing & Mixing

- 4 Aux buses with per-channel sends
- Aux bus master controls (level, pan, mute)
- 2 FX sends per channel
- FX return level control

#### Effects

- **Reverb (FX1)**: Pre-delay, Time, Low-Pass Filter, Bypass
- **Delay (FX2)**: Time, Feedback, Low-Pass Filter, Bypass

#### Media & Samples

- 3 Media Players with Play/Pause/Stop/Seek
- 48 Sample Pads (8 banks × 6 pads)
- Sample playback modes (One-Shot, Loop, Hold, Bleep)
- Advanced sample editing:
  - Volume control per sample
  - Fade in/out times
  - Start/end point trimming
- Sample bank selection and muting

#### Recording

- Start/Stop/Pause recording
- Recording destination selection (USB/SD/Computer)
- Recording status and time monitoring

#### Snapshots

- 5 snapshot slots
- Recall and save complete mixer scenes

#### Automation

- Auto-Gain per input channel
- Auto-Mix with per-channel weight control

#### Connectivity

- NDI streaming enable/disable
- NDI device naming and scanning
- Bluetooth enable/disable/pairing
- Bluetooth connection status monitoring

#### System Features

- Screen brightness control
- Button LED brightness control
- Layout mode switching (EZ/Advanced)
- Master delay compensation (0-250ms)
- GUI restart
- Factory reset

#### Monitoring & Feedback

- Real-time VU meters for all channels
- 36+ variables for displaying mixer state
- 16 feedback types for visual indicators
- Connection status monitoring

#### Presets

- 48+ ready-to-use button presets
- Organized by category (Inputs, Players, Samples, System, etc.)
- Pre-configured with actions and feedbacks

### Technical Features

- Socket.IO WebSocket connection with auto-reconnection
- Real-time bidirectional state synchronization
- Proper value normalization and conversion
- Logarithmic scaling for frequency and time parameters
- dB conversion utilities
- Comprehensive error handling

### Documentation

- Complete README with installation instructions
- Comprehensive USER_GUIDE with examples and workflows
- Technical PROTOCOL documentation
- CHANGELOG (this file)

---

## Version History

[1.0.1]: https://github.com/dsorlov/dlz-creator-companion/releases/tag/v1.0.1
[1.0.0]: https://github.com/dsorlov/dlz-creator-companion/releases/tag/v1.0.0
