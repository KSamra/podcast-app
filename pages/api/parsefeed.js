
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
      let pod = JSON.stringify({title, author, date, enclosures, link, origlink, episode})
      this.push(pod)
      callback();

    } catch (error) {
      this.push(null);
      callback(error);
    }
  }
})

jsonTransformer.on('error', () => {
  console.log('JsonTransformer errored or finished!')
  res.end();
});

jsonTransformer.on('finish', () => {
  console.log(`JSONTransformer finished it's transformation!`);
})


export default async function handler(req, res) {
  console.log(req.body)
  let {headers, method, url, body} = req;
  console.log(method)
  console.log(headers);
  
  let {feedUrl} = req.body;
  const request = await fetch(feedUrl);
  
  

  const feedparser = new FeedParser();
  res.status(200)
  request.body.pipe(feedparser).pipe(jsonTransformer).pipe(res);
}