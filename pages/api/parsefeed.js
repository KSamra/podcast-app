
const FeedParser = require('feedparser');
const fetch = require('node-fetch');
const { Transform } = require('stream');



export default async function handler(req, res) {
  console.log(req.body)
  let {headers, method, url, body} = req;
  console.log(method)
  console.log(headers);
  
  let {feedUrl} = req.body;
  const request = await fetch(feedUrl);
  
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
        this.push(null);
        callback(error);
      }
    }
  })
  
  jsonTransformer.on('error', () => {
    console.log('JsonTransformer errored or finished!')
    res.end()
  });
  

  const feedparser = new FeedParser();
  res.status(200)
  request.body.pipe(feedparser).pipe(jsonTransformer).pipe(res);
}