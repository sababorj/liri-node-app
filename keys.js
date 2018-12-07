console.log('this is loaded');

spotify = {
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
};

OMDB = process.env.OMDB_KEY

module.exports = {
    spotify,
    OMDB
}