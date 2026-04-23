import { describe, it, expect } from 'vitest';
import { processCharacterAppearances } from '../characterAppearances.js';

describe('processCharacterAppearances', () => {
  it('handles multiline quoted fields in Cast CSV and maps appearances correctly', () => {
    const castCsv = `Character,Description,Episode Appearances
Anna,"Voice Type: Female mezzo-soprano. Sweet and soft on the surface\nAge: Around 24", "1-2"\nBob,"Some description", "2"`;

    const scriptCsv = `EP,CUE,Character
1,1,Anna
2,1,Bob
2,2,Anna`;

    const table = processCharacterAppearances(scriptCsv, castCsv);
    // Expect order from cast CSV: ['Anna','Bob']
    expect(table[0].character).toBe('Anna');
    expect(table[1].character).toBe('Bob');

    // Anna appears in episodes 1 and 2 => ranges '1-2'
    expect(table[0].appearances).toBe('1-2');
    // Bob appears in episode 2
    expect(table[1].appearances).toBe('2');
  });
});
