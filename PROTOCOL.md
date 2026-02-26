# Mackie DLZ Creator - Protocol Documentation

Technical documentation for the DLZ Creator network protocol.

## Overview

The Mackie DLZ Creator communicates using **Socket.IO** over WebSocket, providing real-time bidirectional communication for control and monitoring.

### Connection Details

- **Protocol**: Socket.IO (WebSocket transport)
- **Default Port**: 80 (HTTP)
- **Namespace**: Default (`/`)
- **Transport**: WebSocket with fallback to polling
- **Authentication**: None required

### Connection URL

```
http://[IP_ADDRESS]:80/socket.io/
```

Example: `http://192.168.8.30:80/socket.io/`

---

## Message Format

All messages use Socket.IO event-based messaging with JSON payloads.

### General Structure

```javascript
socket.emit(eventType, messageData)
```

### Value Ranges

Most control values are normalized to **0.0 - 1.0** range:

- `0.0` = Minimum/Off
- `1.0` = Maximum/On
- `0.5` = Center (for pan)

### Channel Addressing

Channels are identified using dot notation:

```
[type].[index].[parameter]
```

**Types**:

- `i` = Input channels (0-3)
- `p` = Player channels (0-2)
- `m` = Master
- `a` = Aux buses (0-3)
- `fx` = FX returns (0-1)

**Examples**:

- `i.0.mix` = Input 1 fader
- `p.1.mute` = Player 2 mute
- `m.mix` = Master fader
- `a.0.mix` = Aux 1 master

---

## Message Types

### 1. Channel Control (`channelCtl`)

Main control message for all mixer parameters.

#### Format

```javascript
socket.emit('channelCtl', {
	id: 'channel.parameter',
	value: numberValue,
})
```

#### Examples

**Set Input 1 Fader to 75%**:

```javascript
{
  id: 'i.0.mix',
  value: 0.75
}
```

**Mute Input 2**:

```javascript
{
  id: 'i.1.mute',
  value: 1
}
```

**Set Master Pan to Center**:

```javascript
{
  id: 'm.pan',
  value: 0.5
}
```

#### Common Parameters

| Parameter | Range   | Description                                |
| --------- | ------- | ------------------------------------------ |
| `mix`     | 0.0-1.0 | Channel fader level                        |
| `mute`    | 0/1     | Mute state (0=unmuted, 1=muted)            |
| `solo`    | 0/1     | Solo state                                 |
| `pan`     | 0.0-1.0 | Pan position (0=left, 0.5=center, 1=right) |
| `gain`    | 0.0-1.0 | Input gain (0-60dB)                        |
| `phantom` | 0/1     | Phantom power +48V                         |

---

### 2. Processing Control

#### EQ Parameters

**High-Pass Filter**:

```javascript
{
  id: 'i.0.hpf.freq',
  value: 0.0-1.0  // Logarithmic 20-700 Hz
}
```

**EQ Bands** (1, 2, 3):

```javascript
// Frequency (logarithmic 20Hz-20kHz)
{ id: 'i.0.eq1.freq', value: 0.0-1.0 }

// Gain (-12 to +12 dB)
{ id: 'i.0.eq1.gain', value: 0.0-1.0 }  // 0.5 = 0dB

// Q Factor (0.5 to 4.0)
{ id: 'i.0.eq1.q', value: 0.0-1.0 }

// Bypass
{ id: 'i.0.eq.bypass', value: 0/1 }
```

#### Compressor Parameters

```javascript
// Threshold (-40 to 0 dB)
{ id: 'i.0.comp.thresh', value: 0.0-1.0 }

// Ratio (1:1 to 20:1, logarithmic)
{ id: 'i.0.comp.ratio', value: 0.0-1.0 }

// Attack (1-100 ms, logarithmic)
{ id: 'i.0.comp.attack', value: 0.0-1.0 }

// Release (10-1000 ms, logarithmic)
{ id: 'i.0.comp.release', value: 0.0-1.0 }

// Makeup Gain (0-20 dB)
{ id: 'i.0.comp.makeup', value: 0.0-1.0 }

// Bypass
{ id: 'i.0.comp.bypass', value: 0/1 }
```

#### Noise Gate Parameters

```javascript
// Threshold (-80 to 0 dB)
{ id: 'i.0.gate.thresh', value: 0.0-1.0 }

// Range (0-80 dB)
{ id: 'i.0.gate.range', value: 0.0-1.0 }

// Attack (0.1-50 ms, logarithmic)
{ id: 'i.0.gate.attack', value: 0.0-1.0 }

// Hold (0-2000 ms, logarithmic)
{ id: 'i.0.gate.hold', value: 0.0-1.0 }

// Release (10-2000 ms, logarithmic)
{ id: 'i.0.gate.release', value: 0.0-1.0 }

// Bypass
{ id: 'i.0.gate.bypass', value: 0/1 }
```

#### De-Esser Parameters

```javascript
// Threshold (-40 to 0 dB)
{ id: 'i.0.ds.thresh', value: 0.0-1.0 }

// Frequency (4-12 kHz, logarithmic)
{ id: 'i.0.ds.freq', value: 0.0-1.0 }

// Q Factor (0.5-4.0)
{ id: 'i.0.ds.q', value: 0.0-1.0 }

// Range (0-20 dB)
{ id: 'i.0.ds.range', value: 0.0-1.0 }

// Bypass
{ id: 'i.0.ds.bypass', value: 0/1 }
```

---

### 3. Routing

#### Aux Sends

**Per-Channel Aux Send**:

```javascript
// Send level (0.0-1.0)
{ id: 'i.0.aux.0.send', value: 0.75 }

// Send mute
{ id: 'i.0.aux.0.mute', value: 1 }
```

**Aux Bus Master**:

```javascript
// Aux bus fader
{ id: 'a.0.mix', value: 0.85 }

// Aux bus pan
{ id: 'a.0.pan', value: 0.5 }

// Aux bus mute
{ id: 'a.0.mute', value: 0 }
```

#### FX Sends

```javascript
// FX send level (0.0-1.0)
{ id: 'i.0.fx.0.send', value: 0.25 }

// FX return level
{ id: 'fx.0.mix', value: 0.80 }
```

---

### 4. Effects

#### Reverb (FX Unit 1)

```javascript
// Pre-delay (0-200 ms, logarithmic)
{ id: 'fx.0.predelay', value: 0.0-1.0 }

// Time (0.1-5.0 seconds, logarithmic)
{ id: 'fx.0.time', value: 0.0-1.0 }

// Low-Pass Filter (1-20 kHz, logarithmic)
{ id: 'fx.0.lpf', value: 0.0-1.0 }

// Bypass
{ id: 'fx.0.bypass', value: 0/1 }
```

#### Delay (FX Unit 2)

```javascript
// Time (1-2000 ms, logarithmic)
{ id: 'fx.1.time', value: 0.0-1.0 }

// Feedback (0-100%)
{ id: 'fx.1.feedback', value: 0.0-1.0 }

// Low-Pass Filter (1-20 kHz, logarithmic)
{ id: 'fx.1.lpf', value: 0.0-1.0 }

// Bypass
{ id: 'fx.1.bypass', value: 0/1 }
```

---

### 5. Media Players

#### Player Control

```javascript
// Play
socket.emit('playerCtl', {
	player: 0, // Player index 0-2
	command: 'play',
})

// Pause
socket.emit('playerCtl', {
	player: 0,
	command: 'pause',
})

// Stop
socket.emit('playerCtl', {
	player: 0,
	command: 'stop',
})

// Seek (position in seconds)
socket.emit('playerCtl', {
	player: 0,
	command: 'seek',
	position: 30.5,
})
```

---

### 6. Sample Banks

#### Sample Control

```javascript
// Trigger sample
socket.emit('sampleCtl', {
	bank: 0, // Bank 0-7 (A-H)
	pad: 0, // Pad 0-5
	command: 'trigger',
})

// Stop sample
socket.emit('sampleCtl', {
	bank: 0,
	pad: 0,
	command: 'stop',
})

// Select bank
socket.emit('sampleCtl', {
	command: 'selectBank',
	bank: 1, // Bank 0-7
})
```

#### Sample Parameters

```javascript
// Playback mode
{ id: 'sample.0.0.mode', value: 0-3 }
// 0=One-Shot, 1=Loop, 2=Hold, 3=Bleep

// Volume (-40 to 0 dB)
{ id: 'sample.0.0.volume', value: 0.0-1.0 }

// Fade in (1-1000 ms, logarithmic)
{ id: 'sample.0.0.fadein', value: 0.0-1.0 }

// Fade out (1-5000 ms, logarithmic)
{ id: 'sample.0.0.fadeout', value: 0.0-1.0 }

// Start point (0-3000 ms)
{ id: 'sample.0.0.start', value: 0.0-1.0 }

// End point (0-3000 ms from end)
{ id: 'sample.0.0.end', value: 0.0-1.0 }
```

---

### 7. Recording

```javascript
// Start recording
socket.emit('recordCtl', {
	command: 'start',
	destination: 'usb', // 'usb', 'sd', 'computer'
})

// Stop recording
socket.emit('recordCtl', {
	command: 'stop',
})

// Pause recording
socket.emit('recordCtl', {
	command: 'pause',
})
```

---

### 8. Snapshots

```javascript
// Recall snapshot
socket.emit('snapshotCtl', {
	command: 'recall',
	snapshot: 0, // Snapshot 0-4
})

// Save snapshot
socket.emit('snapshotCtl', {
	command: 'save',
	snapshot: 0,
})
```

---

### 9. System Settings

#### Auto-Mix

```javascript
// Enable auto-mix
{ id: 'settings.automix', value: 0/1 }

// Channel weight (priority)
{ id: 'i.0.automix.weight', value: 0.0-1.0 }
```

#### Auto-Gain

```javascript
// Enable auto-gain
{ id: 'i.0.autogain', value: 0/1 }
```

#### NDI

```javascript
// Enable NDI
{ id: 'settings.ndi.enable', value: 0/1 }

// Set device name
socket.emit('systemCtl', {
  command: 'ndi.setname',
  name: 'Studio A Mixer'
})

// Scan for devices
socket.emit('systemCtl', {
  command: 'ndi.scan'
})
```

#### Bluetooth

```javascript
// Enable Bluetooth
{ id: 'settings.bluetooth.enable', value: 0/1 }

// Start pairing
socket.emit('systemCtl', {
  command: 'bluetooth.pair'
})

// Disconnect
socket.emit('systemCtl', {
  command: 'bluetooth.disconnect'
})
```

#### Display Settings

```javascript
// Screen brightness (0-100%)
{ id: 'settings.brightness.screen', value: 0.0-1.0 }

// Button brightness (0-100%)
{ id: 'settings.brightness.buttons', value: 0.0-1.0 }

// Layout mode
{ id: 'settings.layout', value: 0/1 }
// 0=EZ Mode, 1=Advanced Mode
```

#### System Control

```javascript
// Restart GUI
socket.emit('systemCtl', {
  command: 'restart.gui'
})

// Factory reset
socket.emit('systemCtl', {
  command: 'factory.reset',
  confirm: true
})

// Master delay (0-250 ms)
{ id: 'settings.delay.master', value: 0.0-1.0 }
```

#### Channel Color

```javascript
// Set color (0-10)
{ id: 'i.0.color', value: 0-10 }
// 0=Red, 1=Orange, 2=Yellow, 3=Green, 4=Cyan
// 5=Blue, 6=Purple, 7=Pink, 8=White, 9=Gray, 10=Off
```

---

### 10. State Updates (Received from Device)

The DLZ Creator sends state updates to keep clients synchronized.

#### VU Meters (`VU`)

Sent approximately every 100ms with real-time meter values.

```javascript
socket.on('VU', (data) => {
	// data contains meter values for all channels
	// Format: { 'i.0.vu': value, 'i.1.vu': value, ... }
})
```

**VU Value Range**: 0.0 (silence) to 1.0+ (over 0dBFS)

#### Channel State Updates (`channelState`)

Sent whenever a parameter changes.

```javascript
socket.on('channelState', (data) => {
	// data contains updated parameter values
	// Format: { id: 'i.0.mix', value: 0.75 }
})
```

#### Player Status (`playerState`)

```javascript
socket.on('playerState', (data) => {
	// data.player: 0-2
	// data.status: 'playing', 'paused', 'stopped'
	// data.position: seconds
	// data.duration: seconds
})
```

#### Recording Status (`recordState`)

```javascript
socket.on('recordState', (data) => {
	// data.status: 'recording', 'paused', 'stopped'
	// data.time: seconds
	// data.destination: 'usb', 'sd', 'computer'
})
```

#### Sample Status (`sampleState`)

```javascript
socket.on('sampleState', (data) => {
	// data.bank: 0-7
	// data.pad: 0-5
	// data.playing: true/false
})
```

#### System Status (`systemState`)

```javascript
socket.on('systemState', (data) => {
	// data contains system state variables
	// Examples:
	// { 'bluetooth.status': 3 }  // 0=Disabled, 1=Unpaired, 2=Paired, 3=Connected
	// { 'ndi.enable': 1 }
})
```

---

## Value Conversion

### Linear to dB Conversion

```javascript
// Linear (0.0-1.0) to dB
function linearToDb(linear) {
	if (linear <= 0) return '-∞'
	return (20 * Math.log10(linear)).toFixed(1)
}

// dB to Linear (0.0-1.0)
function dbToLinear(db) {
	if (db <= -80) return 0
	return Math.pow(10, db / 20)
}
```

### Logarithmic Parameter Conversion

Many parameters use logarithmic scaling for musical/natural feel.

```javascript
// Frequency (20 Hz - 20 kHz)
function linearToFreq(linear, min = 20, max = 20000) {
	return min * Math.pow(max / min, linear)
}

function freqToLinear(freq, min = 20, max = 20000) {
	return Math.log(freq / min) / Math.log(max / min)
}

// Time (ms)
function linearToTime(linear, min, max) {
	return min * Math.pow(max / min, linear)
}

function timeToLinear(time, min, max) {
	return Math.log(time / min) / Math.log(max / min)
}
```

### Example Conversions

```javascript
// EQ Frequency: 0.5 (linear) → ~632 Hz
linearToFreq(0.5, 20, 20000) // = 632.45 Hz

// Compressor Attack: 0.3 (linear) → ~5 ms
linearToTime(0.3, 1, 100) // = 5.01 ms

// Gate Release: 0.7 (linear) → ~251 ms
linearToTime(0.7, 10, 2000) // = 251.18 ms
```

---

## Connection Management

### Initial Connection

```javascript
const io = require('socket.io-client')

const socket = io(`http://${host}:${port}`, {
	reconnection: true,
	reconnectionDelay: 1000,
	reconnectionDelayMax: 5000,
	reconnectionAttempts: Infinity,
	transports: ['websocket', 'polling'],
})

socket.on('connect', () => {
	console.log('Connected to DLZ Creator')
})

socket.on('disconnect', () => {
	console.log('Disconnected from DLZ Creator')
})

socket.on('connect_error', (error) => {
	console.error('Connection error:', error)
})
```

### Reconnection Strategy

The module implements automatic reconnection with exponential backoff:

1. Initial delay: 1 second
2. Maximum delay: 30 seconds
3. Multiplier: 1.5x per attempt
4. Infinite attempts

---

## Implementation Notes

### State Synchronization

- DLZ Creator maintains authoritative state
- All control commands are acknowledged with state updates
- VU meters stream continuously (~100ms intervals)
- Other parameters update on change only

### Rate Limiting

- No hard rate limits observed
- Recommend max 20 commands/second per parameter
- VU meter updates are throttled by device (~10 Hz)

### Error Handling

- Invalid parameters are silently ignored
- Out-of-range values are clamped
- Unknown channels return no error

### Best Practices

1. **Debounce Rapid Changes**: Avoid sending the same parameter too frequently
2. **Cache State Locally**: Don't query device, listen to updates
3. **Handle Reconnection**: Expect temporary disconnections
4. **Validate Ranges**: Clamp values before sending
5. **Use Normalized Values**: Always use 0.0-1.0 range

---

## Testing

### Test Connection

```javascript
// Simple connection test
const socket = io('http://192.168.8.30:80')

socket.on('connect', () => {
	console.log('Connected!')

	// Test: Mute Input 1
	socket.emit('channelCtl', {
		id: 'i.0.mute',
		value: 1,
	})
})

socket.on('channelState', (data) => {
	console.log('State update:', data)
})

socket.on('VU', (data) => {
	console.log('VU meters:', data)
})
```

### Monitoring Traffic

Use browser developer tools on `http://192.168.8.30/` to observe Socket.IO messages.

---

## Appendix A: Complete Parameter List

### Input Channels (i.0 - i.3)

| Parameter        | Range   | Description                   |
| ---------------- | ------- | ----------------------------- |
| `mix`            | 0.0-1.0 | Fader level                   |
| `mute`           | 0/1     | Mute state                    |
| `solo`           | 0/1     | Solo state                    |
| `pan`            | 0.0-1.0 | Pan position                  |
| `gain`           | 0.0-1.0 | Input gain (0-60dB)           |
| `phantom`        | 0/1     | +48V phantom power            |
| `color`          | 0-10    | Channel color                 |
| `hpf.freq`       | 0.0-1.0 | HPF frequency (20-700Hz)      |
| `eq1.freq`       | 0.0-1.0 | EQ band 1 frequency           |
| `eq1.gain`       | 0.0-1.0 | EQ band 1 gain (-12 to +12dB) |
| `eq1.q`          | 0.0-1.0 | EQ band 1 Q factor            |
| `eq2.freq`       | 0.0-1.0 | EQ band 2 frequency           |
| `eq2.gain`       | 0.0-1.0 | EQ band 2 gain                |
| `eq2.q`          | 0.0-1.0 | EQ band 2 Q factor            |
| `eq3.freq`       | 0.0-1.0 | EQ band 3 frequency           |
| `eq3.gain`       | 0.0-1.0 | EQ band 3 gain                |
| `eq3.q`          | 0.0-1.0 | EQ band 3 Q factor            |
| `eq.bypass`      | 0/1     | EQ bypass                     |
| `comp.thresh`    | 0.0-1.0 | Compressor threshold          |
| `comp.ratio`     | 0.0-1.0 | Compressor ratio              |
| `comp.attack`    | 0.0-1.0 | Compressor attack             |
| `comp.release`   | 0.0-1.0 | Compressor release            |
| `comp.makeup`    | 0.0-1.0 | Compressor makeup gain        |
| `comp.bypass`    | 0/1     | Compressor bypass             |
| `gate.thresh`    | 0.0-1.0 | Gate threshold                |
| `gate.range`     | 0.0-1.0 | Gate range                    |
| `gate.attack`    | 0.0-1.0 | Gate attack                   |
| `gate.hold`      | 0.0-1.0 | Gate hold                     |
| `gate.release`   | 0.0-1.0 | Gate release                  |
| `gate.bypass`    | 0/1     | Gate bypass                   |
| `ds.thresh`      | 0.0-1.0 | De-esser threshold            |
| `ds.freq`        | 0.0-1.0 | De-esser frequency            |
| `ds.q`           | 0.0-1.0 | De-esser Q                    |
| `ds.range`       | 0.0-1.0 | De-esser range                |
| `ds.bypass`      | 0/1     | De-esser bypass               |
| `aux.0.send`     | 0.0-1.0 | Aux 1 send level              |
| `aux.1.send`     | 0.0-1.0 | Aux 2 send level              |
| `aux.2.send`     | 0.0-1.0 | Aux 3 send level              |
| `aux.3.send`     | 0.0-1.0 | Aux 4 send level              |
| `aux.0.mute`     | 0/1     | Aux 1 send mute               |
| `aux.1.mute`     | 0/1     | Aux 2 send mute               |
| `aux.2.mute`     | 0/1     | Aux 3 send mute               |
| `aux.3.mute`     | 0/1     | Aux 4 send mute               |
| `fx.0.send`      | 0.0-1.0 | FX1 (Reverb) send             |
| `fx.1.send`      | 0.0-1.0 | FX2 (Delay) send              |
| `autogain`       | 0/1     | Auto-gain enable              |
| `automix.weight` | 0.0-1.0 | Auto-mix weight               |

### Player Channels (p.0 - p.2)

| Parameter                       | Range   | Description   |
| ------------------------------- | ------- | ------------- |
| `mix`                           | 0.0-1.0 | Fader level   |
| `mute`                          | 0/1     | Mute state    |
| `solo`                          | 0/1     | Solo state    |
| `pan`                           | 0.0-1.0 | Pan position  |
| `color`                         | 0-10    | Channel color |
| (All processing same as inputs) |         |               |

### Master (m)

| Parameter | Range   | Description  |
| --------- | ------- | ------------ |
| `mix`     | 0.0-1.0 | Master fader |
| `mute`    | 0/1     | Master mute  |

### Aux Buses (a.0 - a.3)

| Parameter | Range   | Description      |
| --------- | ------- | ---------------- |
| `mix`     | 0.0-1.0 | Aux master level |
| `mute`    | 0/1     | Aux mute         |
| `pan`     | 0.0-1.0 | Aux pan          |

### FX Returns (fx.0 - fx.1)

| Parameter | Range   | Description     |
| --------- | ------- | --------------- |
| `mix`     | 0.0-1.0 | FX return level |

---

## Appendix B: Socket.IO Events Summary

### Outgoing (Client → Device)

| Event         | Purpose                     |
| ------------- | --------------------------- |
| `channelCtl`  | Control any mixer parameter |
| `playerCtl`   | Control media players       |
| `sampleCtl`   | Control sample pads         |
| `recordCtl`   | Control recording           |
| `snapshotCtl` | Recall/save snapshots       |
| `systemCtl`   | System commands             |

### Incoming (Device → Client)

| Event          | Purpose                         |
| -------------- | ------------------------------- |
| `VU`           | Real-time meter values (~100ms) |
| `channelState` | Parameter change notifications  |
| `playerState`  | Player status updates           |
| `recordState`  | Recording status                |
| `sampleState`  | Sample playback status          |
| `systemState`  | System status updates           |

---

## Appendix C: Error Codes

The DLZ Creator does not return explicit error codes. Invalid commands are silently ignored.

**Common Issues**:

- Invalid channel: Ignored
- Out-of-range value: Clamped to valid range
- Unknown parameter: Ignored

---

**Protocol Version**: 1.0  
**Document Version**: 1.0.0  
**Last Updated**: 2025-02-23

This protocol documentation is based on analysis of the DLZ Creator web interface and may not be officially supported by Mackie/LOUD Audio.
