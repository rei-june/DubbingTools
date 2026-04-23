import { describe, it, expect } from 'vitest';
import { processEpisodeTracker } from '../episodeTracker.js';

describe('processEpisodeTracker', () => {
  it('preserves CSV character order when sort=false (default)', () => {
    const csv = `Character,Episode Appearances
Alice,"1"
Bob,"1-3"`;

    const { sortedEpisodes, characterData } = processEpisodeTracker(csv);
    expect(characterData.map((c) => c.character)).toEqual(['Alice', 'Bob']);
    expect(sortedEpisodes).toEqual(['1', '2', '3']);
  });

  it('sorts characters when sort=true (by number of episodes desc)', () => {
    const csv = `Character,Episode Appearances
Alice,"1"
Bob,"1-3"`;

    const { characterData } = processEpisodeTracker(csv, true);
    // Bob has 3 appearances, Alice 1, so Bob should come first
    expect(characterData[0].character).toBe('Bob');
    expect(characterData[1].character).toBe('Alice');
  });
});
