const FeedParser = require('feedparser');
const fetch = require('node-fetch');

const feedparser = new FeedParser();
feedparser.on('error', function(error){
  console.error(error);
})

feedparser.on('readable', function() {
  let stream = this;
  let item;
  while(item = stream.read()){
    console.dir(item, {depth: 0})
  }
})


export default async function handler(req, res) {
  console.log(req.body)
  let {feedUrl} = req.body;

  const request = await fetch(feedUrl);
  request.body.pipe(feedparser)

  res.status(200).send({msg: 'successful!'})

}