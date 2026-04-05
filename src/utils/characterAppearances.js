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

function toRanges(episodes) {
  if (episodes.length === 0) return '0';
  
  const nums = episodes.map((ep) => parseInt(ep, 10)).sort((a, b) => a - b);
  const ranges = [];
  let start = nums[0];
  let end = nums[0];

  for (let i = 1; i < nums.length; i++) {
    if (nums[i] === end + 1) {
      end = nums[i];
    } else {
      ranges.push(start === end ? `${start}` : `${start}-${end}`);
      start = nums[i];
      end = nums[i];
    }
  }
  ranges.push(start === end ? `${start}` : `${start}-${end}`);
  return ranges.join(', ');
}

export function processCharacterAppearances(scriptCsvContent, castCsvContent) {
  // Parse cast CSV to get character order (first column only)
  const castLines = castCsvContent.split('\n');
  const characterOrder = [];

  for (const line of castLines) {
    if (!line.trim()) continue;
    const cols = parseCSVLine(line);
    const character = unquote(cols[0] || '').trim();

    // Skip header
    if (character === 'Character' || !character) continue;

    characterOrder.push(character);
  }

  // Parse script CSV to get episode data
  const scriptLines = scriptCsvContent.split('\n');
  let epIndex = -1;
  let characterIndex = -1;
  const characterEpisodes = new Map();

  for (const line of scriptLines) {
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

    // Store using lowercase key for case-insensitive matching
    const characterKey = character.toLowerCase();

    if (!characterEpisodes.has(characterKey)) {
      characterEpisodes.set(characterKey, []);
    }
    if (!characterEpisodes.get(characterKey).includes(episode)) {
      characterEpisodes.get(characterKey).push(episode);
    }
  }

  // Build output data using the specified order from Cast CSV
  const tableData = [];

  for (const character of characterOrder) {
    const characterKey = character.toLowerCase();

    if (characterEpisodes.has(characterKey)) {
      const episodes = characterEpisodes.get(characterKey);
      const sortedEps = episodes.sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
      const ranges = toRanges(sortedEps);
      tableData.push({ character, appearances: ranges });
    } else {
      // Character in Cast CSV but not in Script CSV - show 0
      tableData.push({ character, appearances: '0' });
    }
  }

  return tableData;
}

export function generateCharacterAppearancesCSV(tableData) {
  const lines = ['Character\tAppearances'];
  for (const row of tableData) {
    lines.push(`${row.character}\t${row.appearances}`);
  }
  return lines.join('\n');
}
