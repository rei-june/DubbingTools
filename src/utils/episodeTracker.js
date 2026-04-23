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

function parseEpisodeAppearances(appearancesStr) {
  const episodes = [];
  if (!appearancesStr) return episodes;

  const parts = appearancesStr.split(',').map(p => p.trim());
  
  for (const part of parts) {
    if (part.includes('-')) {
      const [start, end] = part.split('-').map(n => parseInt(n.trim(), 10));
      if (!isNaN(start) && !isNaN(end)) {
        for (let i = start; i <= end; i++) {
          episodes.push(String(i));
        }
      }
    } else {
      const ep = parseInt(part.trim(), 10);
      if (!isNaN(ep)) {
        episodes.push(String(ep));
      }
    }
  }
  
  return episodes;
}

// Split CSV content into records while respecting quoted newlines
function splitCSVRecords(csvContent) {
  const records = [];
  let cur = '';
  let inQuotes = false;

  for (let i = 0; i < csvContent.length; i++) {
    const ch = csvContent[i];

    if (ch === '"') {
      cur += ch;
      if (i + 1 < csvContent.length && csvContent[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (ch === '\r') {
      if (inQuotes) cur += ch;
      continue;
    }

    if (ch === '\n' && !inQuotes) {
      records.push(cur);
      cur = '';
      continue;
    }

    cur += ch;
  }

  if (cur.length > 0) records.push(cur);
  return records;
}

export function processEpisodeTracker(csvContent, sort = false) {
  const lines = splitCSVRecords(csvContent);

  let characterIndex = -1;
  let appearancesIndex = -1;
  const characterEpisodes = new Map();
  const allEpisodes = new Set();

  for (const line of lines) {
    if (!line.trim()) continue;

    const cols = parseCSVLine(line);

    // Detect header row
    if (characterIndex === -1 || appearancesIndex === -1) {
      for (let i = 0; i < cols.length; i++) {
        const header = unquote(cols[i]).trim().toLowerCase();
        if (header === 'character' || header.includes('char')) characterIndex = i;
        if (header === 'episode appearances' || header === 'episode' || header.startsWith('ep')) appearancesIndex = i;
      }
      if (characterIndex !== -1 && appearancesIndex !== -1) {
        continue;
      }
    }

    if (characterIndex === -1 || appearancesIndex === -1) continue;

    const character = unquote(cols[characterIndex] || '').trim();
    const appearancesStr = unquote(cols[appearancesIndex] || '').trim();

    if (!character || !appearancesStr) continue;

    const episodes = parseEpisodeAppearances(appearancesStr);
    
    episodes.forEach(ep => allEpisodes.add(ep));
    characterEpisodes.set(character, episodes);
  }

  if (characterEpisodes.size === 0) {
    throw new Error('No character data found in CSV');
  }

  // Sort episodes numerically
  const sortedEpisodes = Array.from(allEpisodes).sort(
    (a, b) => parseInt(a, 10) - parseInt(b, 10)
  );

  // Create character list sorted by total appearances (most to least)
  const characterData = Array.from(characterEpisodes.entries()).map(
    ([char, episodes]) => {
      const sortedEps = episodes.sort(
        (a, b) => parseInt(a, 10) - parseInt(b, 10)
      );
      return {
        character: char,
        episodes: sortedEps,
        firstEpisode: parseInt(sortedEps[0], 10),
      };
    }
  );

  if (sort) {
    characterData.sort((a, b) => {
      // Sort by number of episodes (descending), then by first appearance (ascending)
      if (b.episodes.length !== a.episodes.length) {
        return b.episodes.length - a.episodes.length;
      }
      return a.firstEpisode - b.firstEpisode;
    });
  }

  return { sortedEpisodes, characterData };
}

export function generateEpisodeTrackerCSV(sortedEpisodes, characterData) {
  const csvLines = [];

  // Header row
  const headers = ['Episodes:', ...characterData.map((cd) => cd.character)];
  csvLines.push(headers.join('\t'));

  // Data rows
  sortedEpisodes.forEach((ep, rowIndex) => {
    const row = [`Episode ${ep} (#1.${ep})`];
    characterData.forEach((cd) => {
      if (rowIndex < cd.episodes.length) {
        const charEp = cd.episodes[rowIndex];
        row.push(`Episode ${charEp} (#1.${charEp})`);
      } else {
        row.push('');
      }
    });
    csvLines.push(row.join('\t'));
  });

  return csvLines.join('\n');
}
