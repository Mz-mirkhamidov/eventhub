/** Uzbek Latin ↔ Cyrillic character maps (single letters; digraphs handled separately). */
const LATIN_TO_CYRILLIC: Record<string, string> = {
  a: "а", b: "б", c: "ц", d: "д", e: "е", f: "ф", g: "г", h: "ҳ",
  i: "и", j: "ж", k: "к", l: "л", m: "м", n: "н", o: "о", p: "п",
  q: "қ", r: "р", s: "с", t: "т", u: "у", v: "в", w: "в", x: "х",
  y: "й", z: "з",
};

const CYRILLIC_TO_LATIN: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo", ж: "j",
  з: "z", и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o",
  п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "x", ц: "c",
  ч: "ch", ш: "sh", ъ: "", ы: "i", ь: "", э: "e", ю: "yu", я: "ya",
  қ: "q", ғ: "g'", ў: "o'", ҳ: "h",
};

const LATIN_DIGRAPHS: [string, string][] = [
  ["sh", "ш"], ["ch", "ч"], ["ng", "нг"], ["o'", "ў"], ["g'", "ғ"],
];

const CYRILLIC_DIGRAPHS: [string, string][] = [
  ["ш", "sh"], ["ч", "ch"], ["нг", "ng"], ["ў", "o'"], ["ғ", "g'"],
];

export function latinToCyrillic(text: string): string {
  let result = "";
  let i = 0;
  const lower = text.toLowerCase();
  while (i < lower.length) {
    let matched = false;
    for (const [lat, cyr] of LATIN_DIGRAPHS) {
      if (lower.startsWith(lat, i)) {
        result += preserveCase(text, i, lat.length, cyr);
        i += lat.length;
        matched = true;
        break;
      }
    }
    if (matched) continue;
    const ch = lower[i];
    const mapped = LATIN_TO_CYRILLIC[ch];
    result += mapped ? preserveCase(text, i, 1, mapped) : text[i];
    i += 1;
  }
  return result;
}

export function cyrillicToLatin(text: string): string {
  let result = "";
  let i = 0;
  const lower = text.toLowerCase();
  while (i < lower.length) {
    let matched = false;
    for (const [cyr, lat] of CYRILLIC_DIGRAPHS) {
      if (lower.startsWith(cyr, i)) {
        result += preserveCase(text, i, cyr.length, lat);
        i += cyr.length;
        matched = true;
        break;
      }
    }
    if (matched) continue;
    const ch = lower[i];
    const mapped = CYRILLIC_TO_LATIN[ch];
    result += mapped !== undefined ? preserveCase(text, i, 1, mapped) : text[i];
    i += 1;
  }
  return result;
}

function preserveCase(source: string, start: number, len: number, replacement: string): string {
  const slice = source.slice(start, start + len);
  if (slice === slice.toUpperCase() && slice !== slice.toLowerCase()) {
    return replacement.toUpperCase();
  }
  if (slice[0] === slice[0]?.toUpperCase()) {
    return replacement[0].toUpperCase() + replacement.slice(1);
  }
  return replacement;
}

/** Returns unique search variants (original + script-converted form). */
export function getSearchVariants(query: string): string[] {
  const trimmed = query.trim();
  if (!trimmed) return [];
  const variants = new Set<string>([trimmed]);
  const toCyr = latinToCyrillic(trimmed);
  const toLat = cyrillicToLatin(trimmed);
  if (toCyr !== trimmed) variants.add(toCyr);
  if (toLat !== trimmed) variants.add(toLat);
  return [...variants];
}
