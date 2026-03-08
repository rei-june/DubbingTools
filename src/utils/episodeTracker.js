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

export function processEpisodeTracker(csvContent) {
  const lines = csvContent.split('\n');

  let epIndex = -1;
  let characterIndex = -1;
  const characterEpisodes = new Map();
  const allEpisodes = new Set();

  for (const line of lines) {
    if (!line.trim()) continue;

    const cols = parseCSVLine(line);

    // Detect header row
    if (epIndex === -1 || characterIndex === -1) {
      for (let i = 0; i < cols.length; i++) {
        const header = unquote(cols[i]).trim().toUpperCase();
        if (header === 'EP') epIndex = i;
        if (header === 'CHARACTER') characterIndex = i;
      }
      if (epIndex !== -1 && characterIndex !== -1) {
        continue;
      }
    }

    if (epIndex === -1 || characterIndex === -1) continue;

    const episode = unquote(cols[epIndex] || '').trim();
    const character = unquote(cols[characterIndex] || '').trim();

    if (!episode || !character) continue;

    allEpisodes.add(episode);

    if (!characterEpisodes.has(character)) {
      characterEpisodes.set(character, []);
    }
    if (!characterEpisodes.get(character).includes(episode)) {
      characterEpisodes.get(character).push(episode);
    }
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

  characterData.sort((a, b) => {
    // Sort by number of episodes (descending), then by first appearance (ascending)
    if (b.episodes.length !== a.episodes.length) {
      return b.episodes.length - a.episodes.length;
    }
    return a.firstEpisode - b.firstEpisode;
  });

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
