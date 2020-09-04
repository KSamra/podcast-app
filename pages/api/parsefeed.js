
const FeedParser = require('feedparser');
const fetch = require('node-fetch');
const { Transform } = require('stream');

const jsonTransformer = new Transform({
  writableObjectMode: true,
  transform(chunk, encoding, callback) {
    try {
      if(chunk === null){
        this.push(null);
      }

      let {title, enclosures, author, date, link, origlink} = chunk
      let episode = chunk['itunes:episode']
      let pod = {title, author, date, enclosures, link, origlink, episode}
      let j = JSON.stringify(pod);
      this.push(j)
      callback();

    } catch (error) {
      callback(error);
      this.push(null)
    }
  }
})

jsonTransformer.on('error', () => {
  console.log('JsonTransformer errored or finished!')
  res.end()
});


export default async function handler(req, res) {
  console.log(req.body)
  
  let {feedUrl} = req.body;
  const request = await fetch(feedUrl);
  

  const feedparser = new FeedParser();

  request.body.pipe(feedparser).pipe(jsonTransformer).pipe(res);
}