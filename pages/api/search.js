const FeedParser = require('feedparser');
const fetch = require('node-fetch')

const iTunesUrl = 'https://itunes.apple.com/search?entity=podcast'
const feedparser = new FeedParser();

feedparser.on('readable', function() {
  let stream = this;
  let meta = this.meta;

  let item;

  while(item = stream.read()){
    console.dir(item, {depth: 0})
  }
})

export default async function handler(req, res) {
  
  let {key,limit=25} = req.query;
  console.log('received search key = ', key, ' with limit ', limit);
  try {
    const response = await fetch(`${iTunesUrl}&term=${key}&limit=${limit}`);
    const results = await response.json();

    const podcastFeed = await fetch(results.results.feedUrl)
    console.log(podcastFeed.body)

    podcastFeed.body.pipe(feedparser)

    return res.status(200).send({data: results.results[0]})
  } catch (error) {
    console.log(error)
    return res.status(500).send({error})
  }
  
  
}