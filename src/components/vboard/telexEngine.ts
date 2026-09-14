/**
 * Vietnamese Telex Engine for V-board
 * Supports full Vietnamese Telex rules:
 * - Vowel modification: aa->â, aw->ă, ee->ê, oo->ô, ow->ơ, uw->ư, dd->đ
 * - Diphthongs: uo+w -> ươ
 * - Tone marks: s (sắc), f (huyền), r (hỏi), x (ngã), j (nặng), z (xóa dấu)
 * - Intelligent tone placement (chuẩn chính tả tiếng Việt)
 * - Revert / undo tone when repeating key (e.g., as -> á, typing s again -> as / pass)
 * - Preserves capitalization (Uppercase / TitleCase)
 */

type Tone = 0 | 1 | 2 | 3 | 4 | 5;
// 0: None, 1: Sắc, 2: Huyền, 3: Hỏi, 4: Ngã, 5: Nặng

const VOWEL_TABLE: Record<string, string[]> = {
  a: ['a', 'á', 'à', 'ả', 'ã', 'ạ'],
  ă: ['ă', 'ắ', 'ằ', 'ẳ', 'ẵ', 'ặ'],
  â: ['â', 'ấ', 'ầ', 'ẩ', 'ẫ', 'ậ'],
  e: ['e', 'é', 'è', 'ẻ', 'ẽ', 'ẹ'],
  ê: ['ê', 'ế', 'ề', 'ể', 'ễ', 'ệ'],
  i: ['i', 'í', 'ì', 'ỉ', 'ĩ', 'ị'],
  o: ['o', 'ó', 'ò', 'ỏ', 'õ', 'ọ'],
  ô: ['ô', 'ố', 'ồ', 'ổ', 'ỗ', 'ộ'],
  ơ: ['ơ', 'ớ', 'ờ', 'ở', 'ỡ', 'ợ'],
  u: ['u', 'ú', 'ù', 'ủ', 'ũ', 'ụ'],
  ư: ['ư', 'ứ', 'ừ', 'ử', 'ữ', 'ự'],
  y: ['y', 'ý', 'ỳ', 'ỷ', 'ỹ', 'ỵ'],

  A: ['A', 'Á', 'À', 'Ả', 'Ã', 'Ạ'],
  Ă: ['Ă', 'Ắ', 'Ằ', 'Ẳ', 'Ẵ', 'Ặ'],
  Â: ['Â', 'Ấ', 'Ầ', 'Ẩ', 'Ẫ', 'Ậ'],
  E: ['E', 'É', 'È', 'Ẻ', 'Ẽ', 'Ẹ'],
  Ê: ['Ê', 'Ế', 'Ề', 'Ể', 'Ễ', 'Ệ'],
  I: ['I', 'Í', 'Ì', 'Ỉ', 'Ĩ', 'Ị'],
  O: ['O', 'Ó', 'Ò', 'Ỏ', 'Õ', 'Ọ'],
  Ô: ['Ô', 'Ố', 'Ồ', 'Ổ', 'Ỗ', 'Ộ'],
  Ơ: ['Ơ', 'Ớ', 'Ờ', 'Ở', 'Ỡ', 'Ợ'],
  U: ['U', 'Ú', 'Ù', 'Ủ', 'Ũ', 'Ụ'],
  Ư: ['Ư', 'Ứ', 'Ừ', 'Ử', 'Ữ', 'Ự'],
  Y: ['Y', 'Ý', 'Ỳ', 'Ỷ', 'Ỹ', 'Ỵ'],
};

// Reverse map: accented char -> { base: string, tone: Tone }
const CHAR_TO_BASE_TONE: Record<string, { base: string; tone: Tone }> = {};
Object.entries(VOWEL_TABLE).forEach(([base, tones]) => {
  tones.forEach((char, toneIdx) => {
    CHAR_TO_BASE_TONE[char] = { base, tone: toneIdx as Tone };
  });
});

// Helper: Check if a character is a vowel (accented or unaccented)
export function isVowel(c: string): boolean {
  return c in CHAR_TO_BASE_TONE;
}

// Helper: Get base vowel without tone
export function getBaseVowel(c: string): string {
  return CHAR_TO_BASE_TONE[c]?.base ?? c;
}

// Helper: Get current tone of a character
export function getCharTone(c: string): Tone {
  return CHAR_TO_BASE_TONE[c]?.tone ?? 0;
}

// Helper: Apply a tone to a base vowel
export function applyToneToVowel(baseVowel: string, tone: Tone): string {
  const tones = VOWEL_TABLE[baseVowel];
  if (!tones) return baseVowel;
  return tones[tone] || baseVowel;
}

// Helper: Find current tone of a whole word
export function getWordTone(word: string): { tone: Tone; vowelIndex: number } {
  for (let i = 0; i < word.length; i++) {
    const tone = getCharTone(word[i]);
    if (tone > 0) {
      return { tone, vowelIndex: i };
    }
  }
  return { tone: 0, vowelIndex: -1 };
}

// Helper: Remove all tones from a word, keeping base vowels (â, ă, ê, ô, ơ, ư remain)
export function removeWordTone(word: string): string {
  let result = '';
  for (let i = 0; i < word.length; i++) {
    const c = word[i];
    if (isVowel(c)) {
      result += getBaseVowel(c);
    } else {
      result += c;
    }
  }
  return result;
}

/**
 * Determine the optimal vowel index in the word to place the tone mark
 * according to standard Vietnamese phonology rules.
 */
function findTonePosition(wordWithoutTone: string): number {
  const vowelIndices: number[] = [];
  for (let i = 0; i < wordWithoutTone.length; i++) {
    if (isVowel(wordWithoutTone[i])) {
      vowelIndices.push(i);
    }
  }

  if (vowelIndices.length === 0) return -1;
  if (vowelIndices.length === 1) return vowelIndices[0];

  const lastVowelIdx = vowelIndices[vowelIndices.length - 1];
  const hasEndingConsonant = lastVowelIdx < wordWithoutTone.length - 1;

  // If word has ending consonant: tone goes on the vowel closest to ending consonant,
  // or on modified vowels like ê, ô, ơ, ư, â, ă
  if (hasEndingConsonant) {
    // Check if any vowel has a hat/horn (ê, ô, ơ, ư, â, ă)
    for (let k = vowelIndices.length - 1; k >= 0; k--) {
      const idx = vowelIndices[k];
      const char = wordWithoutTone[idx].toLowerCase();
      if (['ê', 'ô', 'ơ', 'ư', 'â', 'ă'].includes(char)) {
        return idx;
      }
    }
    // Otherwise second vowel in pair (e.g., toan -> o, a -> a; muon -> u, o -> o)
    return vowelIndices[vowelIndices.length - 1];
  }

  // Word does NOT have ending consonant (ends in vowel):
  if (vowelIndices.length === 2) {
    const first = wordWithoutTone[vowelIndices[0]].toLowerCase();
    const second = wordWithoutTone[vowelIndices[1]].toLowerCase();

    // Diphthongs ia, ua, ưa -> tone on first (mía, múa, chửa)
    if ((first === 'i' && second === 'a') ||
        (first === 'u' && second === 'a') ||
        (first === 'ư' && second === 'a')) {
      return vowelIndices[0];
    }

    // Diphthongs ending in i, y, u, o -> tone on first (bài, sáo, tàu, máy, tối)
    // Exception: uy -> tone on y (thúy, tùy)
    if (first === 'u' && second === 'y') {
      return vowelIndices[1];
    }

    if (['i', 'y', 'u', 'o'].includes(second)) {
      return vowelIndices[0];
    }

    // oa, oe -> tone on second (hóa, hòe)
    if ((first === 'o' && second === 'a') || (first === 'o' && second === 'e')) {
      return vowelIndices[1];
    }

    // Default for 2 vowels: second vowel
    return vowelIndices[1];
  }

  // 3 vowels (e.g. ươi, uôi, iêu, yêu, oai, oay, uay) -> tone on middle vowel
  if (vowelIndices.length >= 3) {
    return vowelIndices[1];
  }

  return vowelIndices[0];
}

/**
 * Applies a tone to a word
 */
function applyToneToWord(word: string, targetTone: Tone): string {
  const plainWord = removeWordTone(word);
  if (targetTone === 0) return plainWord;

  const pos = findTonePosition(plainWord);
  if (pos === -1) return word;

  const baseVowel = plainWord[pos];
  const accentedVowel = applyToneToVowel(baseVowel, targetTone);

  return plainWord.slice(0, pos) + accentedVowel + plainWord.slice(pos + 1);
}

/**
 * Processes Telex input when a user types a new key.
 * @param currentWord The word token currently being typed at cursor
 * @param key The new character key pressed (e.g. 'a', 's', 'w', etc.)
 * @returns { newWord: string, handled: boolean }
 */
export function processTelexWord(currentWord: string, key: string): { newWord: string; handled: boolean } {
  if (!key || key.length !== 1) {
    return { newWord: currentWord + key, handled: false };
  }

  const lowerKey = key.toLowerCase();

  // 1. TONE KEYS: s (sắc), f (huyền), r (hỏi), x (ngã), j (nặng), z (xóa dấu)
  const TONE_MAP: Record<string, Tone> = {
    s: 1, // Sắc
    f: 2, // Huyền
    r: 3, // Hỏi
    x: 4, // Ngã
    j: 5, // Nặng
    z: 0, // Xóa dấu
  };

  if (lowerKey in TONE_MAP) {
    const targetTone = TONE_MAP[lowerKey];
    const { tone: currentTone } = getWordTone(currentWord);

    // Tone keys only apply if the word already contains at least one vowel
    const hasVowel = Array.from(currentWord).some(isVowel);

    if (hasVowel) {
      if (lowerKey === 'z') {
        // Remove tone
        return { newWord: removeWordTone(currentWord), handled: true };
      }

      if (currentTone === targetTone) {
        // REVERT / UNDO RULE: typing tone key again restores plain word + key (e.g. pass, boss)
        const plain = removeWordTone(currentWord);
        return { newWord: plain + key, handled: true };
      }

      // Apply the requested tone mark
      const accented = applyToneToWord(currentWord, targetTone);
      return { newWord: accented, handled: true };
    }
  }

  // 2. DOUBLE LETTER & VOWEL MODIFICATIONS:
  // dd -> đ, aa -> â, aw -> ă, ee -> ê, oo -> ô, ow -> ơ, uw -> ư, uow -> ươ
  const len = currentWord.length;
  if (len > 0) {
    const lastChar = currentWord[len - 1];
    const lowerLast = lastChar.toLowerCase();
    const isUpper = lastChar === lastChar.toUpperCase() && lastChar !== lowerLast;

    // 'd' + 'd' -> 'đ'
    if (lowerKey === 'd' && lowerLast === 'd') {
      const isWordUpper = currentWord === currentWord.toUpperCase();
      const rep = isWordUpper || isUpper ? 'Đ' : 'đ';
      return { newWord: currentWord.slice(0, len - 1) + rep, handled: true };
    }
    // 'đ' + 'd' -> revert to 'dd'
    if (lowerKey === 'd' && (lowerLast === 'đ' || lowerLast === 'Đ')) {
      const rep = isUpper ? 'Dd' : 'dd';
      return { newWord: currentWord.slice(0, len - 1) + rep, handled: true };
    }

    // 'a' + 'a' -> 'â'
    if (lowerKey === 'a') {
      const base = getBaseVowel(lastChar);
      const lowerBase = base.toLowerCase();
      if (lowerBase === 'a') {
        const tone = getCharTone(lastChar);
        const nextChar = isUpper ? 'Â' : 'â';
        const accented = applyToneToVowel(nextChar, tone);
        return { newWord: currentWord.slice(0, len - 1) + accented, handled: true };
      }
      if (lowerBase === 'â') {
        // Revert 'â' + 'a' -> 'aa'
        return { newWord: removeWordTone(currentWord) + key, handled: true };
      }
    }

    // 'e' + 'e' -> 'ê'
    if (lowerKey === 'e') {
      const base = getBaseVowel(lastChar);
      const lowerBase = base.toLowerCase();
      if (lowerBase === 'e') {
        const tone = getCharTone(lastChar);
        const nextChar = isUpper ? 'Ê' : 'ê';
        const accented = applyToneToVowel(nextChar, tone);
        return { newWord: currentWord.slice(0, len - 1) + accented, handled: true };
      }
      if (lowerBase === 'ê') {
        // Revert 'ê' + 'e' -> 'ee'
        return { newWord: removeWordTone(currentWord) + key, handled: true };
      }
    }

    // 'o' + 'o' -> 'ô'
    if (lowerKey === 'o') {
      const base = getBaseVowel(lastChar);
      const lowerBase = base.toLowerCase();
      if (lowerBase === 'o') {
        const tone = getCharTone(lastChar);
        const nextChar = isUpper ? 'Ô' : 'ô';
        const accented = applyToneToVowel(nextChar, tone);
        return { newWord: currentWord.slice(0, len - 1) + accented, handled: true };
      }
      if (lowerBase === 'ô') {
        // Revert 'ô' + 'o' -> 'oo'
        return { newWord: removeWordTone(currentWord) + key, handled: true };
      }
    }

    // 'w' key transformations:
    // aw -> ă, ow -> ơ, uw -> ư, uow / uo+w -> ươ
    if (lowerKey === 'w') {
      // Check for uo + w -> ươ
      if (len >= 2) {
        const char1 = currentWord[len - 2];
        const char2 = currentWord[len - 1];
        const base1 = getBaseVowel(char1).toLowerCase();
        const base2 = getBaseVowel(char2).toLowerCase();

        if (base1 === 'u' && base2 === 'o') {
          const tone = getCharTone(char2) || getCharTone(char1);
          const uHorn = char1 === char1.toUpperCase() ? 'Ư' : 'ư';
          const oHorn = char2 === char2.toUpperCase() ? 'Ơ' : 'ơ';
          const accentedO = applyToneToVowel(oHorn, tone);
          return {
            newWord: currentWord.slice(0, len - 2) + uHorn + accentedO,
            handled: true,
          };
        }
      }

      const base = getBaseVowel(lastChar);
      const lowerBase = base.toLowerCase();
      const tone = getCharTone(lastChar);

      if (lowerBase === 'a') {
        const nextChar = isUpper ? 'Ă' : 'ă';
        return { newWord: currentWord.slice(0, len - 1) + applyToneToVowel(nextChar, tone), handled: true };
      }
      if (lowerBase === 'o') {
        const nextChar = isUpper ? 'Ơ' : 'ơ';
        return { newWord: currentWord.slice(0, len - 1) + applyToneToVowel(nextChar, tone), handled: true };
      }
      if (lowerBase === 'u') {
        const nextChar = isUpper ? 'Ư' : 'ư';
        return { newWord: currentWord.slice(0, len - 1) + applyToneToVowel(nextChar, tone), handled: true };
      }
      if (lowerBase === 'ă' || lowerBase === 'ơ' || lowerBase === 'ư') {
        // Revert to unaccented + w
        return { newWord: removeWordTone(currentWord) + key, handled: true };
      }

      // Standalone 'w' -> 'ư'
      return { newWord: currentWord + (key === 'W' ? 'Ư' : 'ư'), handled: true };
    }
  } else {
    // Current word is empty, typing 'w'
    if (lowerKey === 'w') {
      return { newWord: key === 'W' ? 'Ư' : 'ư', handled: true };
    }
  }

  // Normal character insertion
  return { newWord: currentWord + key, handled: false };
}
