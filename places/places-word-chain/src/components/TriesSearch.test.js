import searchPrefix from './TriesSearch';

const trie = {
  "a": {
    "p": {
      "p": {
        "l": {
          "e": {
            "_end": { "name": "apple" }
          }
        }
      }
    },
    "n": {
      "t": {
        "_end": { "name": "ant" }
      }
    }
  }
};

describe('searchPrefix', () => {
  it('should return an empty array if no results are found', () => {
    expect(searchPrefix(trie, 'b')).toEqual([]);
  });

  it('should return an array of results if matches are found', () => {
    expect(searchPrefix(trie, 'a')).toEqual([
      { name: 'apple' },
      { name: 'ant' },
    ]);
  });

  it('should return a single result if a full match is found', () => {
    expect(searchPrefix(trie, 'apple')).toEqual([{ name: 'apple' }]);
  });

  it('should be case-insensitive', () => {
    expect(searchPrefix(trie, 'A')).toEqual([
      { name: 'apple' },
      { name: 'ant' },
    ]);
  });
});
