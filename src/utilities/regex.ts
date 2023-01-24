export function matchWord(words: string, word: string): RegExpMatchArray {
  const re = new RegExp('\\b' + word + '\\b');
  return words.match(re);
}
