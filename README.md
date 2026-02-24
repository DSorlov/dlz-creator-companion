# Mackie DLZ Creator Module for Bitfocus Companion

Professional control module for the Mackie DLZ Creator digital mixer, providing complete control over all mixer functions through Bitfocus Companion.

Made with ❤️ for audio professionals.

## Features

### 🎚️ Complete Mixer Control
- **4 Input Channels** - Full control with faders, mute, solo, pan, gain, phantom power
- **3 Media Players** - Play, pause, stop, seek, and monitor playback
- **4 Aux Buses** - Individual sends per channel plus aux master controls
- **2 FX Units** - Reverb and Delay with full parameter control
- **48 Sample Pads** - 8 banks × 6 pads with advanced playback control
- **Master Section** - Master fader, mute, and delay compensation

### 🎛️ Professional Processing
- **4-Band EQ** - High-pass filter + 3 parametric bands per channel
- **Compressor** - Full dynamics control with threshold, ratio, attack, release, makeup
- **Noise Gate** - Threshold, range, attack, hold, release per channel
- **De-Esser** - Frequency-selective compression for sibilance control

### 🎪 Advanced Features
- **5 Snapshots** - Save and recall complete mixer scenes
- **Recording Control** - Start/stop/pause recording to USB/SD/Computer
- **Auto-Mix** - Automatic gain sharing with per-channel weight control
- **Auto-Gain** - Automatic input level optimization
- **NDI Streaming** - Network audio distribution
- **Bluetooth Control** - Wireless audio connectivity

### 📊 Real-Time Monitoring
- **VU Meters** - All channels with peak detection
- **36+ Variables** - Channel levels, player status, recording state, system info
- **16 Feedbacks** - Visual indicators for mute, solo, processing, playback states
- **48+ Presets** - Ready-to-use button configurations

## Installation

### Requirements
- Bitfocus Companion v3.0 or later
- Mackie DLZ Creator with network connectivity
- Both devices on the same network

### Install from Package

1. **Download** the latest release `.tgz` file from the releases page

2. **Import into Companion:**
   - Open Companion web interface
   - Go to the **Connections** tab
   - Click **Import Module**
   - Select the `.tgz` file
   - Companion will install and load the module

3. **Add Connection:**
   - Click **Add Connection**
   - Search for "Mackie DLZ Creator"
   - Configure the IP address (default: 192.168.8.30)
   - Connection should show as "Connected"

### Manual Installation

```bash
# Copy to Companion modules directory
# macOS:
cp mackie-dlz-creator-companion-1.0.0.tgz ~/Library/Application\ Support/companion-modules/

# Windows:
copy mackie-dlz-creator-companion-1.0.0.tgz %APPDATA%\companion-modules\

# Linux:
cp mackie-dlz-creator-companion-1.0.0.tgz ~/.local/share/companion-modules/

# Extract and restart Companion
cd [companion-modules directory]
tar -xzf mackie-dlz-creator-companion-1.0.0.tgz
```

## Configuration

### Connection Settings

- **Host**: IP address of your DLZ Creator (default: `192.168.8.30`)
- **Port**: Web interface port (default: `80`)

### Finding Your DLZ Creator IP

1. On the DLZ Creator, press **Settings**
2. Navigate to **Network Settings**
3. Note the IP address displayed
4. Enter this IP in Companion's connection settings

## Quick Start

### Using Presets

The module includes ready-to-use presets for common operations:

1. **Drag and drop presets** onto Companion buttons
2. Presets include:
   - Channel controls (fader, mute, solo)
   - Sample pad triggers
   - Recording controls
   - Player controls
   - Processing toggles
   - Snapshot recall

### Creating Custom Buttons

1. **Add a button** in Companion
2. **Add Action** - Choose from 51+ available actions
3. **Add Feedback** - Visual indicators for button states
4. **Use Variables** - Display real-time values on buttons

### Example: Channel Mute Button

1. Create button
2. Add Action: "Mute Channel" → Select channel, set to "Toggle"
3. Add Feedback: "Channel Muted" → Select same channel
4. Result: Button lights red when muted, toggles on press

### Example: VU Meter Display

1. Create button
2. Set button text: `IN 1\n$(dlzcreator:input_1_level_db)`
3. Result: Button displays real-time input level

## Available Actions

### Channel Control
- Set Fader/Mix Level
- Mute/Unmute Channel
- Solo/Unsolo Channel
- Set Pan
- Set Input Gain
- Toggle Phantom Power (+48V)
- Set Channel Color

### Processing
- EQ: Set HPF, Band 1/2/3 Frequency/Gain/Q, Bypass
- Compressor: Threshold, Ratio, Attack, Release, Makeup, Bypass
- Noise Gate: Threshold, Range, Attack, Hold, Release, Bypass
- De-Esser: Threshold, Frequency, Q, Range, Bypass

### Routing & Mixing
- Set Aux Send Level (per channel)
- Set FX Send Level (per channel)
- Mute Aux Send
- Set Aux Bus Level/Pan/Mute

### Effects
- Reverb: Pre-delay, Time, Low-Pass Filter, Bypass
- Delay: Time, Feedback, Low-Pass Filter, Bypass

### Media & Samples
- Player: Play, Pause, Stop, Seek
- Sample: Trigger, Stop, Set Mode (One-Shot/Loop/Hold/Bleep)
- Sample: Volume, Fade Times, Start/End Points
- Select Sample Bank, Mute Bank

### Recording
- Start/Stop/Pause Recording
- Set Recording Destination (USB/SD/Computer)

### Scenes & Automation
- Recall Snapshot
- Save Snapshot
- Set Auto-Mix Enable/Weight
- Set Auto-Gain Enable
- Set Master Delay

### System
- NDI: Enable, Set Name, Scan Devices
- Bluetooth: Enable, Pair, Disconnect
- Set Screen/Button Brightness
- Set Layout Mode (EZ/Advanced)
- Restart GUI, Factory Reset

## Variables

All variables use the format: `$(dlzcreator:variable_name)`

### Channel Variables (per Input/Player)
- `input_X_level` - Channel level (0-100%)
- `input_X_level_db` - Channel level in dB
- `input_X_mute` - Muted/Unmuted
- `input_X_solo` - Solo On/Off
- `input_X_phantom` - +48V On/Off
- `input_X_vu` - VU meter value

### Player Variables
- `player_X_status` - Playing/Paused/Stopped
- `player_X_position` - Current position (mm:ss)

### Recording Variables
- `recording_status` - Recording/Paused/Stopped
- `recording_time` - Recording duration

### System Variables
- `bluetooth_status` - Disabled/Unpaired/Paired/Connected
- `ndi_status` - Enabled/Disabled
- `automix_status` - Active/Inactive
- `layout_mode` - EZ/Advanced
- `screen_brightness` - Brightness percentage

See full variable list in USER_GUIDE.md

## Feedbacks

Visual indicators that change button appearance based on mixer state:

- **Channel Muted** - Button turns red when channel muted
- **Channel Solo** - Button turns yellow when channel solo
- **Phantom Power** - Button turns blue when +48V active
- **Sample Playing** - Button highlights when sample playing
- **Recording Active** - Button turns red when recording
- **Player Playing** - Button highlights during playback
- **Processing Active** - Indicators for EQ, Comp, Gate, DS
- **Auto-Mix/Gain Active** - Shows automation status
- **NDI/Bluetooth Status** - Connection indicators

## Troubleshooting

### Connection Issues

**"Connection Failed"**
- Verify DLZ Creator is powered on
- Check IP address in Companion settings
- Ensure both devices on same network
- Try pinging the DLZ Creator IP
- Check firewall settings

**"Disconnected" after working**
- DLZ Creator may have restarted
- Network interruption
- Module will auto-reconnect

### Control Issues

**Actions not working**
- Check connection status (should be green)
- Verify in Companion logs (Help → View Logs)
- Try reconnecting (disable/enable connection)

**Variables not updating**
- VU meters update every 100ms
- Other variables update on change
- Check connection is established

### Performance

**Lag or delay**
- Network latency (check WiFi signal)
- Multiple Companion instances
- Companion on slow hardware

## Development

### Building from Source

```bash
# Clone repository
git clone [repository-url]
cd companion-module-mackie-dlz-creator

# Install dependencies
npm install

# Build package
npm run package

# Package will be in dist/ folder
```

### Testing

```bash
# Test connection
npm run test

# Run with Companion Developer Tools
# See Companion documentation for module development
```

## Technical Details

- **Protocol**: Socket.IO over WebSocket
- **Default Port**: 80 (HTTP)
- **Message Format**: JSON with Socket.IO framing
- **State Management**: Real-time bidirectional synchronization
- **Connection**: Automatic reconnection with exponential backoff

See [PROTOCOL.md](PROTOCOL.md) for detailed technical information.

## License

MIT License - see [LICENSE](LICENSE) file for details.

This module is not affiliated with, endorsed by, or supported by Mackie or LOUD Audio, LLC. Mackie and DLZ Creator are trademarks of LOUD Audio, LLC.

## Credits

- Developed for Bitfocus Companion
- Mackie DLZ Creator is a product of LOUD Audio, LLC
- Protocol analysis based on DLZ Creator web interface

## Version

**v1.0.0** - Complete feature implementation (2025-02-23)
