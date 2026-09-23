const queries = [
  // Common movie words
  'love', 'war', 'dark', 'fire', 'blood',
  'night', 'man', 'king', 'dead', 'lost',
  'rise', 'fall', 'black', 'secret', 'ghost',
  'storm', 'shadow', 'hero', 'last', 'new',
  'city', 'dream', 'red', 'star', 'wild',
  
  // Action & Adventure
  'dragon', 'fight', 'gun', 'mission', 'escape',
  'hunt', 'revenge', 'attack', 'chase', 'battle',
  
  // Drama & Emotion
  'heart', 'soul', 'life', 'death', 'hope',
  'fear', 'rage', 'tears', 'forever', 'truth',
  
  // Mystery & Thriller
  'murder', 'killer', 'crime', 'detective', 'spy',
  'conspiracy', 'danger', 'trap', 'suspect', 'witness',
  
  // Fantasy & Sci-Fi
  'magic', 'alien', 'space', 'future', 'time',
  'galaxy', 'planet', 'legend', 'curse', 'power',
  
  // Horror
  'evil', 'demon', 'devil', 'haunted', 'nightmare',
  'zombie', 'monster', 'terror', 'darkness', 'scream',
  
  // Romance
  'kiss', 'wedding', 'bride', 'hearts', 'passion',
  
  // Classic movie titles & themes
  'American', 'beautiful', 'final', 'invisible', 'perfect',
  'silent', 'golden', 'midnight', 'world', 'girl',
  'boy', 'mother', 'father', 'brother', 'sister',
];

export function getRandomQuery() {
  return queries[Math.floor(Math.random() * queries.length)];
}
