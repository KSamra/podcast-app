import { getQueryParser } from 'next/dist/next-server/server/api-utils';

const FeedParser = require('feedparser');
const fetch = require('node-fetch');
const { Transform, pipeline } = require('stream');
const url = require('url');

const jsonTransformer = new Transform({
  writableObjectMode: true,
  transform(chunk, encoding, callback) {
    try {
      if(chunk === null){
        this.push(null);
      }

      let {title, enclosures, author, date, link, origlink} = chunk
      let episode = chunk['itunes:episode']
      // let pod = JSON.stringify({title, author, date, enclosures, link, origlink, episode})
      let pod = JSON.stringify({title, enclosures, date}) + '\n';
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
  // res.statusCode = 500;
  // res.end();
});

jsonTransformer.on('finish', () => {
  console.log(`JSONTransformer finished it's transformation!`);
})


export default async function handler(req, res) {
  
  const queryObj = req.body.url;
  // let queryObj = url.parse(req.url, true).query.url.toString();
  console.log('request feed for: ', queryObj);

  const request = await fetch(queryObj);
  const feedparser = new FeedParser();


  // res.writeHead(200, {'Content-Type': 'application/json'})
  res.setHeader('Content-Type', 'application/json')

  res.on('finish', () => {
    console.log(res.writableFinished)
  })

  pipeline(
    request.body,
    feedparser,
    jsonTransformer,
    res, (error) => {
      if (error) {
        // console.error(error);
        res.end({message: error})
      }
    })

}