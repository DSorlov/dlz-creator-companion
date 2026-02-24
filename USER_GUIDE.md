# Mackie DLZ Creator - User Guide

Complete guide to using the Mackie DLZ Creator module in Bitfocus Companion.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Channel Control](#channel-control)
3. [Signal Processing](#signal-processing)
4. [Routing & Mixing](#routing--mixing)
5. [Effects](#effects)
6. [Media & Samples](#media--samples)
7. [Recording](#recording)
8. [Snapshots](#snapshots)
9. [Automation](#automation)
10. [System Features](#system-features)
11. [Variables Reference](#variables-reference)
12. [Workflows & Examples](#workflows--examples)

---

## Getting Started

### First Connection

1. Power on your DLZ Creator
2. Note the IP address from Network Settings
3. In Companion, add the DLZ Creator connection
4. Enter the IP address
5. Connection status should show "Connected"

### Using Presets

The fastest way to get started is using the included presets:

1. Open **Buttons** tab in Companion
2. Open **Presets** panel
3. Find "Mackie DLZ Creator" category
4. Drag presets onto buttons
5. Test immediately!

---

## Channel Control

### Input Channels (1-4)

The DLZ Creator has 4 input channels with full processing.

#### Fader Control

**Action**: Set Fader Level
- **Channel Type**: Input
- **Channel**: 1-4
- **Level**: 0-100% or -∞ to 0 dB
- **Use**: Main mix level for each input

**Variables**:
- `$(mackie-dlz-creator:input_1_level)` - Shows percentage
- `$(mackie-dlz-creator:input_1_level_db)` - Shows dB value

**Example Button**:
```
Text: IN 1\n$(mackie-dlz-creator:input_1_level_db)
Action: Set Fader Level → Input 1 → 75%
```

#### Mute Control

**Action**: Mute Channel
- **Options**: Mute, Unmute, Toggle
- **Use**: Silence channel without changing fader

**Feedback**: Channel Muted
- Button turns red when muted

**Example**: Mute Toggle
```
Action: Mute Channel → Input 1 → Toggle
Feedback: Channel Muted → Input 1 (Red background)
Text: MUTE\nIN 1
```

#### Solo Control

**Action**: Solo Channel
- **Options**: Solo, Unsolo, Toggle
- **Use**: Listen to one channel alone (mutes others)

**Feedback**: Channel Solo
- Button turns yellow when solo active

#### Input Gain

**Action**: Set Input Gain
- **Range**: 0-60 dB
- **Use**: Set microphone/line input sensitivity
- **Tip**: Start at 30dB for dynamic mics, 20dB for condenser mics

#### Phantom Power (+48V)

**Action**: Set Phantom Power
- **Options**: On, Off, Toggle
- **Use**: Power condenser microphones
- **⚠️ Warning**: Turn off before connecting/disconnecting mics

**Feedback**: Phantom Power Active
- Button turns blue when +48V active

#### Pan Control

**Action**: Set Pan
- **Range**: 0 (Full Left) to 1 (Full Right)
- **Center**: 0.5
- **Use**: Position channel in stereo field

---

## Signal Processing

### High-Pass Filter (HPF)

**Action**: Set HPF Frequency
- **Range**: 20 Hz to 700 Hz
- **Use**: Remove low-frequency rumble, stage noise, handling noise
- **Tip**: Start at 80-100 Hz for speech

**Common Settings**:
- Male voice: 80 Hz
- Female voice: 100 Hz
- Instruments: 40-60 Hz
- Remove room rumble: 120 Hz

### 3-Band Parametric EQ

Each channel has 3 fully parametric EQ bands.

#### Band 1 (Low)
**Typical Range**: 80 Hz - 500 Hz
- **Use**: Body, warmth, thickness
- **Common**: Boost 120-150 Hz for warmth, cut 200-300 Hz for muddiness

#### Band 2 (Mid)
**Typical Range**: 500 Hz - 4 kHz
- **Use**: Presence, clarity, intelligibility  
- **Common**: Boost 2-3 kHz for speech clarity

#### Band 3 (High)
**Typical Range**: 2 kHz - 12 kHz
- **Use**: Brilliance, air, detail
- **Common**: Boost 8-10 kHz for sparkle, cut 6-8 kHz for harshness

**Actions**:
- **Set EQ Band Frequency** - Which frequency to adjust
- **Set EQ Band Gain** - How much to boost/cut (-12 to +12 dB)
- **Set EQ Band Q** - Width of adjustment (0.5 = wide, 4.0 = narrow)
- **Set EQ Bypass** - Turn EQ on/off

**Feedback**: EQ Active
- Shows when EQ is processing

**EQ Workflow**:
1. Solo the channel
2. Play/speak into mic
3. Adjust frequency/gain/Q
4. Unsolo and check in mix
5. Fine-tune as needed

### Compressor

Controls dynamic range by reducing loud signals.

**Parameters**:
- **Threshold**: Level where compression starts (-40 to 0 dB)
  - Lower = more compression
  - Start at -20dB
  
- **Ratio**: How much to compress (1:1 to 20:1)
  - 2:1 = gentle
  - 4:1 = moderate
  - 10:1 = heavy
  
- **Attack**: How fast compression starts (1-100 ms)
  - Fast (1-5ms) = controls transients
  - Slow (20-50ms) = preserves punch
  
- **Release**: How fast compression stops (10-1000 ms)
  - Fast = pumping effect
  - Slow = smooth, natural
  
- **Makeup Gain**: Compensate for level reduction (0-20 dB)
  - Add gain lost to compression

**Actions**: Set Compressor [Parameter]
**Feedback**: Compressor Active

**Starting Settings (Speech)**:
- Threshold: -20 dB
- Ratio: 3:1
- Attack: 10 ms
- Release: 100 ms
- Makeup: 3-6 dB

### Noise Gate

Silences channel when signal is below threshold.

**Parameters**:
- **Threshold**: Level to open gate (-80 to 0 dB)
  - Set just above noise floor
  
- **Range**: How much to reduce when closed (0-80 dB)
  - 20 dB = subtle
  - 80 dB = full silence
  
- **Attack**: How fast gate opens (0.1-50 ms)
  - Fast = immediate
  
- **Hold**: How long gate stays open (0-2000 ms)
  - Prevents chattering
  
- **Release**: How fast gate closes (10-2000 ms)
  - Slow = natural

**Actions**: Set Gate [Parameter]
**Feedback**: Gate Active

**Tip**: Use with compressor to control background noise.

### De-Esser

Reduces harsh "S" sounds (sibilance).

**Parameters**:
- **Threshold**: When de-essing starts (-40 to 0 dB)
- **Frequency**: Target frequency (4-12 kHz)
  - Start at 6-8 kHz
- **Q**: Width of frequency reduction
- **Range**: Amount of reduction (0-20 dB)

**Actions**: Set De-Esser [Parameter]
**Feedback**: De-Esser Active

**When to Use**:
- Bright/sibilant voices
- Close-mic'd vocals
- Compressed speech
- Broadcast/podcast quality

---

## Routing & Mixing

### Aux Sends (4 buses)

Send channels to auxiliary outputs for monitors, effects, or submixes.

#### Per-Channel Aux Send

**Action**: Set Aux Send Level
- **Channel**: Select source channel
- **Aux Bus**: 1-4
- **Level**: 0-100%
- **Use**: How much of channel to send to aux

**Action**: Mute Aux Send
- **Use**: Temporarily disable send

**Example**: Monitor Mix
```
Aux 1 = Stage Monitor
Input 1 (Host): Aux 1 Send = 100%
Input 2 (Guest): Aux 1 Send = 80%
Input 3 (Music): Aux 1 Send = 50%
Input 4 (Phone): Aux 1 Send = 0% (don't send to monitor)
```

#### Aux Bus Master

**Actions**:
- **Set Aux Bus Level** - Master level for aux output
- **Set Aux Bus Pan** - Stereo position of aux
- **Mute Aux Bus** - Mute entire aux output

**Variables**:
- `$(mackie-dlz-creator:aux_1_fader)`
- `$(mackie-dlz-creator:aux_1_mute)`

### FX Sends (2 units)

Send channels to internal effects (Reverb, Delay).

**Action**: Set FX Send Level
- **Channel**: Source channel
- **FX Unit**: 1 (Reverb) or 2 (Delay)
- **Level**: 0-100%

**Example**: Reverb Mix
```
Input 1: FX1 Send = 25% (subtle reverb)
Input 2: FX1 Send = 40% (more reverb)
Player 1: FX1 Send = 15% (light ambience)
```

---

## Effects

### Reverb (FX Unit 1)

Adds acoustic space and depth.

**Parameters**:
- **Pre-Delay**: Gap before reverb starts (0-200 ms)
  - 0ms = immediate
  - 50ms = vocal clarity
  - 100ms+ = distinct echo then reverb
  
- **Time**: Reverb duration (0.1-5.0 seconds)
  - 0.5s = small room
  - 1.5s = medium hall
  - 3.0s+ = large cathedral
  
- **Low-Pass Filter**: Remove high frequencies (1-20 kHz)
  - 20kHz = bright reverb
  - 8kHz = dark, distant reverb

**Actions**: Set Reverb [Parameter], Set Reverb Bypass
**Feedback**: Reverb Active

**Preset Suggestions**:
- **Vocal Plate**: Pre-delay 40ms, Time 1.2s, LP 12kHz
- **Room Ambience**: Pre-delay 0ms, Time 0.8s, LP 15kHz
- **Large Hall**: Pre-delay 80ms, Time 2.5s, LP 10kHz

### Delay (FX Unit 2)

Repeating echoes.

**Parameters**:
- **Time**: Delay between repeats (1-2000 ms)
  - 100-200ms = slapback
  - 400-600ms = rhythmic
  - 1000ms+ = long echo
  
- **Feedback**: Number of repeats (0-100%)
  - 0% = single repeat
  - 30% = 3-4 repeats
  - 70%+ = many repeats (runaway!)
  
- **Low-Pass Filter**: Dampen repeats (1-20 kHz)
  - Makes repeats darker/more natural

**Actions**: Set Delay [Parameter], Set Delay Bypass
**Feedback**: Delay Active

**Preset Suggestions**:
- **Slapback**: Time 120ms, Feedback 0%, LP 20kHz
- **Rhythmic**: Time 500ms, Feedback 30%, LP 12kHz
- **Ambient**: Time 800ms, Feedback 40%, LP 8kHz

---

## Media & Samples

### Media Players (1-3)

Play audio files from USB/SD card.

**Actions**:
- **Player Play** - Start playback
- **Player Pause** - Pause (resume with Play)
- **Player Stop** - Stop and rewind
- **Player Seek** - Jump to position (seconds or percentage)

**Variables**:
- `$(mackie-dlz-creator:player_1_status)` - Playing/Paused/Stopped
- `$(mackie-dlz-creator:player_1_position)` - Current time (mm:ss)

**Feedback**: Player Playing
- Button highlights during playback

**Example: Play Button**
```
Text: PLAY\n$(mackie-dlz-creator:player_1_position)
Actions:
  Down: Player Play → Player 1
  Up: Player Pause → Player 1
Feedback: Player Playing → Player 1
```

### Sample Pads (48 pads)

Instant playback of sound effects, jingles, stingers.

**Organization**: 8 Banks × 6 Pads = 48 total
- Bank A: Sound effects
- Bank B: Jingles
- Bank C: Music beds
- (etc.)

**Actions**:
- **Trigger Sample** - Play sample
- **Stop Sample** - Stop playback
- **Select Sample Bank** - Switch banks (A-H)
- **Mute Sample Bank** - Mute all 6 pads in bank

**Feedback**: Sample Playing
- Button highlights while sample plays

**Playback Modes**:

**Action**: Set Sample Playback Mode
- **One-Shot**: Play once, stop automatically
  - Use: Sound effects, stingers
- **Loop**: Play continuously until stopped
  - Use: Background music, ambience
- **Hold**: Play while button held
  - Use: Manual triggering
- **Bleep**: Censor mode (loop while held)
  - Use: Profanity button

**Advanced Sample Control**:

**Action**: Set Sample Volume
- **Range**: -40 to 0 dB
- **Use**: Normalize loud/quiet samples

**Action**: Set Sample Fade Times
- **Fade In**: 1-1000 ms (smooth entry)
- **Fade Out**: 1-5000 ms (clean exit)

**Action**: Set Sample Start/End Points
- **Start Point**: 0-3000 ms (skip intro)
- **End Point**: 0-3000 ms (skip outro)

**Example: Sound FX Bank**
```
Bank A, Pad 1: Applause (One-Shot)
Bank A, Pad 2: Airhorn (One-Shot)  
Bank A, Pad 3: Drumroll (Hold)
Bank A, Pad 4: Bleep (Bleep mode)
Bank A, Pad 5: Intro Music (Loop)
Bank A, Pad 6: Phone Ring (Loop)
```

---

## Recording

Record your mix to USB drive, SD card, or computer.

**Actions**:
- **Start Recording** - Begin recording
- **Stop Recording** - Stop and save file
- **Pause Recording** - Pause (resume with Start)
- **Set Recording Destination** - USB/SD/Computer

**Variables**:
- `$(mackie-dlz-creator:recording_status)` - Recording/Paused/Stopped
- `$(mackie-dlz-creator:recording_time)` - Duration (hh:mm:ss)

**Feedback**: Recording Active
- Button turns red when recording

**Recording Workflow**:
1. Set destination (USB/SD/Computer)
2. Start recording
3. Perform your show/podcast
4. Stop recording
5. File saved automatically

**Example: Record Button**
```
Text: REC\n$(mackie-dlz-creator:recording_time)
Actions:
  Down: Start Recording
  Up: Stop Recording
Feedback: Recording Active (Red when recording)
```

**Tips**:
- Test recording before important sessions
- Check storage space
- Files saved as WAV (48kHz, 24-bit)

---

## Snapshots

Save and recall complete mixer settings.

**5 Snapshot Slots** (0-4)

**Actions**:
- **Recall Snapshot** - Load saved settings
- **Save Snapshot** - Store current settings

**What's Saved**:
- All fader levels
- All mute/solo states
- All EQ settings
- All compressor/gate/de-esser settings
- All routing (aux sends, FX sends)
- FX settings
- System settings

**Example Uses**:
- **Snapshot 0**: Opening show (music bed)
- **Snapshot 1**: Main show (host + guests)
- **Snapshot 2**: Interview segment
- **Snapshot 3**: Call-in segment (phone mix)
- **Snapshot 4**: Closing show

**Workflow**:
1. Set up mixer for a segment
2. Save to snapshot slot
3. During show, recall snapshot to instantly switch settings

**Example Button**:
```
Text: SCENE\n1
Action: Recall Snapshot → Snapshot 0
```

---

## Automation

### Auto-Gain

Automatically adjusts input gain for optimal level.

**Action**: Set Auto-Gain
- **Channel**: Input 1-4
- **Options**: On, Off, Toggle

**How It Works**:
1. Enable auto-gain
2. Speak/sing at normal level
3. Mixer automatically adjusts gain
4. Green indicator shows active
5. Turn off once level is set

**Feedback**: Auto-Gain Active (Green)

**When to Use**:
- Unknown microphones
- Guest speakers with varying volume
- Quick setup situations
- Safety net for gain staging

**Example**:
```
Text: AUTO\nGAIN\nIN 1
Action: Set Auto-Gain → Input 1 → Toggle
Feedback: Auto-Gain Active → Input 1
```

### Auto-Mix

Automatically manages multiple microphones, reducing feedback and noise.

**Action**: Set Auto-Mix
- **Options**: On, Off, Toggle
- **Use**: Global auto-mix enable

**Action**: Set Auto-Mix Channel Weight
- **Channel**: Input 1-4
- **Weight**: 0.0-1.0 (priority)
  - 1.0 = highest priority (host)
  - 0.7 = medium priority (guests)
  - 0.5 = lower priority (audience)

**How It Works**:
- Active mics stay at full level
- Inactive mics automatically reduced
- Number of Open Mics (NOM) attenuation
- Smooth, natural transitions

**Feedback**: Auto-Mix Active (Orange)

**Setup Example**:
```
Input 1 (Host): Weight 1.0
Input 2 (Guest 1): Weight 0.7
Input 3 (Guest 2): Weight 0.7
Input 4 (Audience): Weight 0.5
Enable Auto-Mix
```

**Benefits**:
- Reduces feedback potential
- Lowers ambient noise
- Maintains natural conversation
- Automatic mix-minus

---

## System Features

### NDI Streaming

Network audio distribution to video production systems.

**Actions**:
- **Set NDI Enable** - Turn NDI on/off
- **Set NDI Device Name** - How device appears on network
- **Scan for NDI Devices** - Discover NDI sources

**Feedback**: NDI Enabled (Blue)

**Variable**: `$(mackie-dlz-creator:ndi_status)`

**Workflow**:
1. Set device name (e.g., "Studio A Mixer")
2. Enable NDI
3. Device appears on network
4. OBS/vMix/Tricaster receives audio

**Use Cases**:
- Send audio to video production
- Network audio routing
- IP-based distribution
- Multi-room broadcasting

### Bluetooth

Wireless audio connectivity.

**Actions**:
- **Set Bluetooth Enable** - Turn Bluetooth on/off
- **Bluetooth Start Pairing** - Make device discoverable
- **Bluetooth Disconnect** - Disconnect current device

**Feedback**: Bluetooth Connected (Blue)

**Variable**: `$(mackie-dlz-creator:bluetooth_status)`
- Disabled / Unpaired / Paired / Connected

**Workflow**:
1. Enable Bluetooth
2. Start pairing mode
3. Connect from phone/tablet
4. Play audio wirelessly

**Use Cases**:
- Background music from phone
- Guest audio playback
- Wireless audio input

### System Settings

**Action**: Set Screen Brightness (0-100%)
- Adjust display brightness

**Action**: Set Button Brightness (0-100%)
- Adjust LED button brightness

**Action**: Set Layout Mode
- **EZ Mode**: Simplified interface
- **Advanced Mode**: Full features

**Action**: Set Master Delay (0-250 ms)
- Compensate for video processing delay
- Align with PA system
- Multi-room synchronization

**Action**: Set Channel Color
- Visual organization (11 colors)
- Identify channels at a glance

---

## Variables Reference

### Format
All variables: `$(mackie-dlz-creator:variable_name)`

### Input Channels (1-4)
- `input_X_level` - Level percentage
- `input_X_level_db` - Level in dB
- `input_X_mute` - Muted/Unmuted
- `input_X_solo` - Solo On/Off
- `input_X_phantom` - +48V On/Off
- `input_X_gain` - Input gain in dB
- `input_X_vu` - VU meter value

### Player Channels (1-3)
- `player_X_level` - Level percentage
- `player_X_level_db` - Level in dB
- `player_X_mute` - Muted/Unmuted
- `player_X_status` - Playing/Paused/Stopped
- `player_X_position` - Position (mm:ss)
- `player_X_vu` - VU meter value

### Master
- `master_level` - Level percentage
- `master_level_db` - Level in dB
- `master_mute` - Muted/Unmuted
- `master_vu_l` - Master left VU
- `master_vu_r` - Master right VU

### Aux Buses (1-4)
- `aux_X_fader` - Level percentage
- `aux_X_fader_db` - Level in dB
- `aux_X_mute` - Muted/Unmuted

### FX Returns (1-2)
- `fx_X_level` - Level percentage
- `fx_X_level_db` - Level in dB

### Recording
- `recording_status` - Recording/Paused/Stopped
- `recording_time` - Duration (hh:mm:ss)

### System
- `bluetooth_status` - Disabled/Unpaired/Paired/Connected
- `ndi_status` - Enabled/Disabled
- `automix_status` - Active/Inactive
- `layout_mode` - EZ/Advanced
- `screen_brightness` - Brightness %

---

## Workflows & Examples

### Podcast Setup

**Requirements**: 2 hosts, 1 guest via phone, intro music

**Configuration**:
```
Input 1 (Host 1):
- Gain: 35 dB
- HPF: 100 Hz
- EQ Band 2: +3dB @ 3kHz (clarity)
- Compressor: Threshold -18dB, Ratio 3:1
- De-Esser: Threshold -12dB @ 6.5kHz
- FX1 Send: 20% (light reverb)

Input 2 (Host 2):
- (Same as Input 1)

Input 3 (Phone):
- Gain: 25 dB
- HPF: 150 Hz (remove phone rumble)
- EQ Band 2: +4dB @ 2.5kHz (intelligibility)
- Compressor: Threshold -15dB, Ratio 4:1 (control phone)

Player 1 (Intro Music):
- Level: 70%
- No processing

Snapshots:
- Snapshot 0: Intro (Music loud, hosts muted)
- Snapshot 1: Main show (Music off, hosts active)
- Snapshot 2: Interview (Phone in mix)
- Snapshot 3: Outro (Music back)

Recording:
- Destination: USB Drive
- Started before intro
```

**Companion Buttons**:
```
Row 1: Mute IN1, Mute IN2, Mute IN3, Mute Player1
Row 2: Scene 0, Scene 1, Scene 2, Scene 3
Row 3: Play Intro, Stop, Play Stinger, Play Outro
Row 4: Start Rec, Stop Rec, (shows rec time)
```

### Live Streaming Setup

**Requirements**: Host, 2 guests, background music, sound effects

**Configuration**:
```
Auto-Mix: Enabled
- Input 1 (Host): Weight 1.0
- Input 2 (Guest 1): Weight 0.7
- Input 3 (Guest 2): Weight 0.7

NDI: Enabled (send to OBS)

Sample Bank A: Applause, Airhorn, Drumroll, etc.
Sample Bank B: Music beds (loop mode)

Master Delay: 100ms (match video processing in OBS)

Snapshots:
- Snapshot 0: Startup (just host)
- Snapshot 1: Full panel (auto-mix active)
- Snapshot 2: Host solo (guests muted)
```

**Companion Integration**:
```
Stream Deck Page 1 - Main Control:
- Host Mute
- Guest 1 Mute
- Guest 2 Mute
- Music Fade (player fader control)

Stream Deck Page 2 - Sound FX:
- Applause, Airhorn, Drumroll, Bleep (samples)

Stream Deck Page 3 - Scenes:
- Scene: Startup
- Scene: Full Panel  
- Scene: Host Solo
- Scene: Break (music up, mics down)
```

### Conference Room Setup

**Requirements**: 1 presenter, 2 panel mics, 1 audience mic, wireless lav

**Configuration**:
```
Input 1 (Presenter Lav):
- Gain: 30 dB
- Phantom: On
- Auto-Gain: Enabled

Input 2 (Panel Mic 1):
- Gain: 35 dB
- Phantom: On

Input 3 (Panel Mic 2):
- Gain: 35 dB
- Phantom: On

Input 4 (Audience Mic):
- Gain: 40 dB
- Phantom: On
- Gate: Enabled (reduce room noise)

Auto-Mix: Enabled
- Input 1: Weight 1.0 (presenter priority)
- Input 2: Weight 0.8
- Input 3: Weight 0.8
- Input 4: Weight 0.5 (audience lower)

Aux 1: Stage monitors
Aux 2: Lobby speakers (delayed)

Recording: USB Drive
NDI: Enabled (to video system)
```

### House of Worship

**Requirements**: Pastor mic, choir mics, music playback, congregation mic

**Configuration**:
```
Snapshots:
- Snapshot 0: Pre-service (music only)
- Snapshot 1: Worship (music + choir)
- Snapshot 2: Sermon (pastor only)
- Snapshot 3: Altar call (pastor + music)
- Snapshot 4: Postlude (music only)

Input 1 (Pastor):
- Phantom: On
- Auto-Gain: On (handles distance changes)
- Reverb: 15%

Input 2 & 3 (Choir):
- Phantom: On
- Reverb: 30%

Input 4 (Congregation):
- Phantom: On
- Gate: Enabled
- Auto-Mix Weight: 0.3

Player 1: Worship music tracks
Player 2: Service music
Player 3: Prelude/Postlude

Aux 1: Stage monitors (pastor)
Aux 2: Choir monitors
Aux 3: Lobby feed
Aux 4: Cry room

Recording: Always on (SD Card)
```

**Companion Control**:
```
Main Page:
- Recall Scene buttons (0-4)
- Pastor Mute
- Music Fader Up/Down

Music Page:
- Player 1 Play/Pause/Stop
- Player 2 Play/Pause/Stop
- Player 3 Play/Pause/Stop
- Show positions and levels

Emergency:
- Mute All Inputs
- Mute All Players
- Master Mute
```

---

## Tips & Best Practices

### Gain Staging
1. Start with input gain, aim for -18 dB average
2. Use compression to control dynamics
3. Set faders around 75% (0 dB = unity)
4. Leave headroom for peaks
5. Master should peak around -6 dB

### Using EQ
- Cut frequencies you don't want
- Boost frequencies you do want
- Cut before boost (cleaner sound)
- Use narrow Q for cutting problems
- Use wider Q for boosting enhancements
- Solo channel while adjusting
- Check in context with full mix

### Compression Tips
- Start with moderate settings
- Fast attack for controlling peaks
- Slow attack for preserving transients
- Fast release for dynamic material
- Slow release for smooth compression
- Add makeup gain to compensate
- Don't over-compress (keep dynamics)

### Reducing Feedback
1. Lower gain on problematic mics
2. Use HPF on all mics
3. Enable auto-mix for multi-mic setups
4. Gate unused mics
5. EQ cut problem frequencies
6. Position mics away from speakers
7. Use directional mics

### Recording Best Practices
- Always test before important recordings
- Monitor levels (avoid clipping)
- Use high-quality storage (fast USB/SD)
- Check recording destination
- Start recording early (capture everything)
- Leave recording running through breaks
- Verify recording after session

### Snapshot Workflow
- Build scenes during rehearsal/setup
- Save often (don't lose work)
- Name/document what each snapshot is for
- Practice transitions between scenes
- Keep similar snapshots consistent
- Use snapshots for entire service/show structure

---

## Troubleshooting

### No Sound from Channel
1. Check mute (channel and master)
2. Check fader levels
3. Verify input gain
4. Check phantom power (condenser mics)
5. Test cable/microphone
6. Check channel routing

### Distortion/Clipping
1. Reduce input gain (red = too hot)
2. Lower fader level
3. Reduce compression makeup gain
4. Check VU meters (should not stay red)

### Feedback (Squealing)
1. Lower master fader immediately
2. Reduce problem mic gain
3. Enable HPF
4. Cut problem frequency with EQ
5. Enable noise gate
6. Move mic away from speakers

### Thin/Weak Sound
1. Check HPF isn't too high
2. Boost low-mid EQ (120-250 Hz)
3. Check mic placement (closer = more body)
4. Increase input gain

### Muddy/Unclear Mix
1. Cut low-mids (200-400 Hz)
2. Boost upper-mids (2-4 kHz)
3. Use HPF aggressively
4. Reduce reverb
5. Use compression to control dynamics

### Samples Not Playing
1. Check sample bank selection
2. Check sample pad assignment
3. Verify files loaded on device
4. Check sample bank mute
5. Check player faders

---

## Keyboard Shortcuts

When using Companion with keyboard control:

- **Mute**: `M` (+ number for channel)
- **Solo**: `S` (+ number for channel)
- **Record**: `R` (toggle)
- **Play/Pause Player 1**: `Space`
- **Scene Recall**: `1-5` (number keys)

Configure in Companion key mapping settings.

