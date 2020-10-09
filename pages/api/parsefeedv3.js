import { type } from 'os';

const FeedParser = require('feedparser');
const fetch = require('node-fetch');
const { Transform, pipeline } = require('stream');
const url = require('url');

function createJsonTransformer (fields) {
  const jsonTransformer = new Transform({
    writableObjectMode: true,
    transform(chunk, encoding, callback) {

      let data = {};

      try {
        if(chunk === null){
          this.push(null);
        }        

        
        for (const key of fields) {
          if (key in chunk) {
            data[key] = chunk[key];
          }
        }
  
        // let {title, enclosures, author, date, link, origlink} = chunk

        // let pod = JSON.stringify({title, author, date, enclosures, link, origlink, episode})
        let pod = JSON.stringify(data) + '\n';
        this.push(pod)
        callback();
  
      } catch (error) {
        this.push(null);
        callback(error);
      }
    }
  })

  // jsonTransformer.on('error', (err) => {
  //   console.error('JsonTransformer errored!', err);
    
  // });
  
  jsonTransformer.on('finish', () => {
    console.log(`JSONTransformer finished it's transformation!`);
  })

  return jsonTransformer;
}




export async function execPipeline(url, fields) {

  if (!Array.isArray(fields)){
    return new Error('fields is required to be passed as an array.')
  }

  const request = await fetch(url);
  const jsonTransformer = createJsonTransformer(fields);

  return pipeline(request.body, new FeedParser(), jsonTransformer, (err) => {console.error('made it this far in the pipeline', err)});
}

export default async function handler(req, res) {
  
  const queryObj = req.body.url;
  // let queryObj = url.parse(req.url, true).query.url.toString();
  console.log('request feed for: ', queryObj);


  // res.writeHead(200, {'Content-Type': 'application/json'})
  res.setHeader('Content-Type', 'application/json')

  res.on('finish', () => {
    console.log(res.writableFinished)
  })

  const transformPipeline = execPipeline(queryObj, ['title', 'author', 'date', 'enclosures', 'link', 'origlink', 'episode']);
  
  pipeline(transformPipeline, res, (err) => {
    console.log('There was an error in the handler pipeline: ', err);
  })
}