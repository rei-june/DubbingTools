#!/usr/bin/env node
// Formerly known as convert_split_by_episode_with_stats
const fs = require('fs');
const path = require('path');
const readline = require('readline');

function parseCSVLine(line) {
  const res = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      res.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  res.push(cur);
  return res;
}

function unquote(s) {
  if (!s) return '';
  return s.trim().replace(/^"(.*)"$/, '$1');
}

const inputFileArg = process.argv[2];
const actorFilterArg = process.argv[3];
const inputFile = inputFileArg;

if (!inputFile || !actorFilterArg) {
  console.error(
    'Usage: node create-episode-markers.js <inputfile.csv> <actor-name>'
  );
  process.exit(1);
}

if (!fs.existsSync(inputFile)) {
  console.error('Input file not found:', inputFile);
  process.exit(1);
}

const characters = (process.argv[4] || '')
  .split(',')
  .map((c) => c.trim())
  .filter((c) => c.length > 0);

if (characters.length > 0) {
  console.log('Filtering for characters:', characters);
}

const baseName = path.basename(inputFile, path.extname(inputFile));

console.log('baseName:', baseName);

const outDir = path.dirname(inputFile);

const episodes = new Map();
let headerMap = null;

const rl = readline.createInterface({
  input: fs.createReadStream(inputFile),
  crlfDelay: Infinity,
});
rl.on('line', (line) => {
  if (!line.trim()) return;
  const cols = parseCSVLine(line);
  // header detection and map: if second column says CUE or third says Character
  if (
    (cols.length > 1 && /CUE/i.test(cols[1])) ||
    (cols.length > 2 && /Character/i.test(cols[2]))
  ) {
    headerMap = {};
    for (let i = 0; i < cols.length; i++) {
      const key = unquote(cols[i] || '')
        .toLowerCase()
        .trim()
        .replace(/\s+/g, ' ');
      headerMap[key] = i;
    }
    return;
  }

  const episode = unquote(cols[0] || '').trim();
  const cue = unquote(cols[1] || '').trim();
  // console.log("Episode:", episode, "Cue:", cols);
  const character = unquote(cols[2] || '').trim();
  const actor = unquote(cols[4] || '').trim();

  console.log(episode, character, actor);

  // prefer explicit 'Timecode Start' column if present (case-insensitive)
  let timecode = '';
  if (headerMap && typeof headerMap['timecode start'] !== 'undefined') {
    timecode = unquote(cols[headerMap['timecode start']] || '').trim();
  } else {
    timecode = unquote(cols[5] || '').trim();
  }

  // include rows where Actor contains the specified actor
  if (!actor || actor.indexOf(actorFilterArg) === -1) return;

  if (characters.length > 0 && !characters.includes(character)) return;

  if (!episode) return;

  // extract start time (first part before -->) and convert to M:SS.mmm (minutes:seconds.milliseconds)
  let start = '';
  if (timecode) {
    const parts = timecode.split('-->');
    let s = parts[0] ? parts[0].trim() : '';
    // expect format HH:MM:SS,mmm ; convert to minutes:seconds.milliseconds (e.g., 00:00:47,320 -> 0:47.320)
    const m = s.match(/^(\d+):(\d{2}):(\d{2}),(\d{3})$/);
    if (m) {
      const hours = parseInt(m[1], 10);
      const minutes = parseInt(m[2], 10);
      const seconds = m[3];
      const ms = m[4];
      const totalMinutes = hours * 60 + minutes;
      start = `${totalMinutes}:${seconds}.${ms}`;
    } else {
      // fallback: replace comma with dot
      start = s.replace(',', '.');
    }
  }

  const lineOut = `M${cue},${character},${start}`;
  if (!episodes.has(episode)) episodes.set(episode, { markers: [] });
  episodes.get(episode).markers.push(lineOut);
});

rl.on('close', () => {
  if (episodes.size === 0) {
    console.error('No data written; check filters or input file.');
    process.exit(1);
  }

  const stats = new Map();

  let total = 0;
  for (const [ep, data] of episodes.entries()) {
    total += data.markers.length;
  }

  let cumulative = 0;

  for (const [ep, data] of episodes.entries()) {
    cumulative += data.markers.length;
    stats.set(ep, {
      markerCount: data.markers.length,
      cumulative,
      percentage: ((cumulative / total) * 100).toFixed(2),
    });
  }

  const statsFile = path.join(outDir, `${baseName}-stats.csv`);
  const statsHeader = `Episode,Marker Count,Cumulative Count, Percentage Done (${total})`;
  const statsLines = [statsHeader];
  for (const [ep, stat] of stats.entries()) {
    statsLines.push(
      `${ep},${stat.markerCount},${stat.cumulative},${stat.percentage}`
    );
  }

  fs.writeFileSync(statsFile, statsLines.join('\n') + '\n', 'utf8');

  for (const [ep, data] of episodes.entries()) {
    const outFile = path.join(outDir, `${ep}-markers.csv`);
    const header = '#,Name,Start';
    const content = [header].concat(data.markers).join('\n') + '\n';
    fs.writeFileSync(outFile, content, 'utf8');
    console.log('Wrote', outFile);
  }
});
