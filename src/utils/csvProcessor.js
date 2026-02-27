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

export function processCSV(csvContent, actorFilter, characterFilter = []) {
  const lines = csvContent.split('\n');
  const episodes = new Map();
  let headerMap = null;

  for (const line of lines) {
    if (!line.trim()) continue;

    const cols = parseCSVLine(line);

    // header detection
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
      continue;
    }

    const episode = unquote(cols[0] || '').trim();
    const cue = unquote(cols[1] || '').trim();
    const character = unquote(cols[2] || '').trim();
    const actor = unquote(cols[4] || '').trim();

    // filter by actor
    if (!actor || actor.indexOf(actorFilter) === -1) continue;

    // filter by character if specified
    if (characterFilter.length > 0 && !characterFilter.includes(character))
      continue;

    if (!episode) continue;

    // get timecode
    let timecode = '';
    if (headerMap && typeof headerMap['timecode start'] !== 'undefined') {
      timecode = unquote(cols[headerMap['timecode start']] || '').trim();
    } else {
      timecode = unquote(cols[5] || '').trim();
    }

    // extract start time
    let start = '';
    if (timecode) {
      const parts = timecode.split('-->');
      let s = parts[0] ? parts[0].trim() : '';
      const m = s.match(/^(\d+):(\d{2}):(\d{2}),(\d{3})$/);
      if (m) {
        const hours = parseInt(m[1], 10);
        const minutes = parseInt(m[2], 10);
        const seconds = m[3];
        const ms = m[4];
        const totalMinutes = hours * 60 + minutes;
        start = `${totalMinutes}:${seconds}.${ms}`;
      } else {
        start = s.replace(',', '.');
      }
    }

    const lineOut = `M${cue},${character},${start}`;
    if (!episodes.has(episode)) episodes.set(episode, { markers: [] });
    episodes.get(episode).markers.push(lineOut);
  }

  return episodes;
}
