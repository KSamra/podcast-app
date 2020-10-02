
const FeedParser = require('feedparser');
const fetch = require('node-fetch');
const url = require('url');

const feedparser = new FeedParser();

export default async function handler(req, res) {
  const queryObj = url.parse(req.url, true).query.url.toString();
  console.log(queryObj);




  const request =  fetch(queryObj)
    .then(results => {
      const data = []

      feedparser.on('error', function(error) {
        console.error('CRITICAL ERROR!');
        console.error(error);
    
      })
    
      feedparser.on('data', function (chunk) {
      
        // console.log(Object.keys(chunk));
        let {url, length} = chunk.enclosures[0];
        // console.log(chunk.title);
        // console.log(url);
        // console.log(length);
        // console.log('')
        data.push(JSON.stringify({title:chunk.title, url, length}));
      });
    
      feedparser.on('end', ()=>{
    
        console.log('finished reading all data!')
        console.log(data);
    
    
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify(data));
      })
      
      results.body.pipe(feedparser);
    })

}