const queries = [
  'love', 'war', 'dark', 'fire', 'blood',
  'night', 'man', 'king', 'dead', 'lost',
  'rise', 'fall', 'black', 'secret', 'ghost',
  'storm', 'shadow', 'hero', 'last', 'new',
  'city', 'dream', 'red', 'star', 'wild',
];

export function getRandomQuery() {
  return queries[Math.floor(Math.random() * queries.length)];
}
