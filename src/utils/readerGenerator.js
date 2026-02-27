import { v4 as uuidv4 } from 'uuid';

const REAPER_TEMPLATE = `<REAPER_PROJECT 0.1 "7.55/macOS-arm64" {TIMESTAMP} 0
  <NOTES 0 2
  >
  RIPPLE 0 0
  GROUPOVERRIDE 1 0 0 0
  AUTOXFADE 128
  ENVATTACH 2
  POOLEDENVATTACH 0
  TCPUIFLAGS 0
  MIXERUIFLAGS 11 48
  ENVFADESZ10 40
  PEAKGAIN 1
  FEEDBACK 0
  PANLAW 1
  PROJOFFS 0 0 0
  MAXPROJLEN 0 0
  GRID 3454 8 1 8 1 0 0 0
  TIMEMODE 0 5 -1 30 0 0 -1 0
  VIDEO_CONFIG 0 0 65792
  PANMODE 3
  PANLAWFLAGS 3
  CURSOR 0
  ZOOM 3.67959872335353 0 0
  VZOOMEX 6 0
  USE_REC_CFG 0
  RECMODE 1
  SMPTESYNC 0 30 100 40 1000 300 0 0 1 0 0
  LOOP 0
  LOOPGRAN 0 4
  RECORD_PATH "Media" ""
  <RECORD_CFG
    ZXZhdXgAAQ==
  >
  <APPLYFX_CFG
  >
  RENDER_FILE ""
  RENDER_PATTERN ""
  RENDER_FMT 0 1 44100
  RENDER_1X 0
  RENDER_RANGE 1 0 0 0 1000
  RENDER_RESAMPLE 3 0 1
  RENDER_ADDTOPROJ 0
  RENDER_STEMS 0
  RENDER_DITHER 0
  RENDER_TRIM 0.000001 0.000001 0 0
  TIMELOCKMODE 1
  TEMPOENVLOCKMODE 1
  ITEMMIX 1
  DEFPITCHMODE 589824 0
  TAKELANE 1
  SAMPLERATE 44100 0 0
  <RENDER_CFG
    ZXZhdxgBAQ==
  >
  LOCK 1
  <METRONOME 6 2
    VOL 0.25 0.125
    BEATLEN 4
    FREQ 1760 880 1
    SAMPLES "" "" "" ""
    SPLIGNORE 0 0
    SPLDEF 2 660 "" 0 ""
    SPLDEF 3 440 "" 0 ""
    PATTERN 0 169
    PATTERNSTR ABBB
    MULT 1
  >
  GLOBAL_AUTO -1
  TEMPO 120 4 4 0
  PLAYRATE 1 0 0.25 4
  SELECTION 0 0
  SELECTION2 0 0
  MASTERAUTOMODE 0
  MASTERTRACKHEIGHT 0 0
  MASTERPEAKCOL 16576
  MASTERMUTESOLO 0
  MASTERTRACKVIEW 0 0.6667 0.5 0.5 0 0 0 0 0 0 0 0 0 0 1
  MASTERHWOUT 0 0 1 0 0 0 0 -1
  MASTER_NCH 2 2
  MASTER_VOLUME 1 0 -1 -1 1
  MASTER_PANMODE 3
  MASTER_PANLAWFLAGS 3
  MASTER_FX 1
  MASTER_SEL 0
  <MASTERPLAYSPEEDENV
    EGUID {35509087-BEB2-9444-A15C-8ABEE927037C}
    ACT 0 -1
    VIS 0 1 1
    LANEHEIGHT 0 0
    ARM 0
    DEFSHAPE 0 -1 -1
  >
  <TEMPOENVEX
    EGUID {C41F9C13-06E1-6F46-BF76-7D28BB338903}
    ACT 0 -1
    VIS 1 0 1
    LANEHEIGHT 0 0
    ARM 0
    DEFSHAPE 1 -1 -1
  >
  {MARKERS}
  <PROJBAY
  >
  <TRACK {TRACK_ID_1}
    NAME ""
    PEAKCOL 16576
    BEAT -1
    AUTOMODE 0
    PANLAWFLAGS 3
    VOLPAN 1 0 -1 -1 1
    MUTESOLO 0 0 0
    IPHASE 0
    PLAYOFFS 0 1
    ISBUS 0 0
    BUSCOMP 0 0 0 0 0
    SHOWINMIX 1 0.6667 0.5 1 0.5 0 0 0 0
    FIXEDLANES 9 0 0 0 0
    LANEREC -1 -1 -1 0
    SEL 0
    REC 1 0 0 0 0 0 0 0
    VU 64
    TRACKHEIGHT 0 0 0 0 0 0 0
    INQ 0 0 0 0.5 100 0 0 100
    NCHAN 2
    FX 1
    TRACKID {TRACK_ID_1}
    PERF 0
    MIDIOUT -1
    MAINSEND 1 0
  >
  <TRACK {TRACK_ID_2}
    NAME ""
    PEAKCOL 16576
    BEAT -1
    AUTOMODE 0
    PANLAWFLAGS 3
    VOLPAN 1 0 -1 -1 1
    MUTESOLO 1 0 0
    IPHASE 0
    PLAYOFFS 0 1
    ISBUS 0 0
    BUSCOMP 0 0 0 0 0
    SHOWINMIX 1 0.6667 0.5 1 0.5 0 0 0 0
    FIXEDLANES 9 0 0 0 0
    LANEREC -1 -1 -1 0
    SEL 0
    REC 0 0 0 0 0 0 0 0
    VU 64
    TRACKHEIGHT 0 0 0 0 0 0 0
    INQ 0 0 0 0.5 100 0 0 100
    NCHAN 2
    FX 1
    TRACKID {TRACK_ID_2}
    PERF 0
    MIDIOUT -1
    MAINSEND 1 0
  >
  <TRACK {TRACK_ID_3}
    NAME 01
    PEAKCOL 16576
    BEAT -1
    AUTOMODE 0
    PANLAWFLAGS 3
    VOLPAN 0.26351193423099 0 -1 -1 1
    MUTESOLO 0 0 0
    IPHASE 0
    PLAYOFFS 0 1
    ISBUS 0 0
    BUSCOMP 0 0 0 0 0
    SHOWINMIX 1 0.6667 0.5 1 0.5 0 0 0 0
    FIXEDLANES 9 0 0 0 0
    LANEREC -1 -1 -1 0
    SEL 1
    REC 0 0 1 0 0 0 0 0
    VU 64
    TRACKHEIGHT 0 0 0 0 0 0 0
    INQ 0 0 0 0.5 100 0 0 100
    NCHAN 2
    FX 1
    TRACKID {TRACK_ID_3}
    PERF 0
    MIDIOUT -1
    MAINSEND 1 0
  >
>
`;

function parseMarkerLine(line) {
  const parts = line.split(',');
  if (parts.length < 3) return null;

  return {
    cue: parts[0].trim(),
    character: parts[1].trim(),
    start: parts[2].trim(),
  };
}

function timecodeToSeconds(timecode) {
  if (!timecode) return 0;

  const parts = timecode.split(':');
  if (parts.length === 2) {
    const [minutes, secondsWithMs] = parts;
    const [seconds] = secondsWithMs.split('.');
    return parseInt(minutes, 10) * 60 + parseInt(seconds, 10);
  }
  return 0;
}

function generateMarkerLine(index, marker, markerIndex) {
  const seconds = timecodeToSeconds(marker.start);
  const guid = `{${uuidv4().toUpperCase()}}`;
  return `  MARKER ${markerIndex} ${seconds} "${marker.character}" 0 0 1 B ${guid} 0`;
}

export function generateReaperFile(episodeNumber, markerLines) {
  const timestamp = Math.floor(Date.now() / 1000);
  const trackId1 = `{${uuidv4().toUpperCase()}}`;
  const trackId2 = `{${uuidv4().toUpperCase()}}`;
  const trackId3 = `{${uuidv4().toUpperCase()}}`;

  const markerContent = markerLines
    .map((line, idx) => {
      const marker = parseMarkerLine(line);
      if (!marker) return null;
      return generateMarkerLine(idx, marker, idx + 1);
    })
    .filter((m) => m !== null)
    .join('\n');

  // Extract first character name for render pattern
  const firstCharacterName = markerLines
    .map((line) => parseMarkerLine(line))
    .find((m) => m !== null)?.character || 'Character';

  const renderPattern = `${firstCharacterName}_${episodeNumber}`;

  const content = REAPER_TEMPLATE.replace('{TIMESTAMP}', timestamp)
    .replace('{EPISODE_NUMBER}', renderPattern)
    .replace('{TRACK_ID_1}', trackId1)
    .replace('{TRACK_ID_2}', trackId2)
    .replace('{TRACK_ID_3}', trackId3)
    .replace('{MARKERS}', markerContent);

  return content;
}
