
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
      // console.log(j)
      this.push(j)
      callback();

    } catch (error) {
      callback(error);
      this.push(null)
    }
  }
})

jsonTransformer.on('error', () => {
  res.end()
});


export default async function handler(req, res) {
  console.log(req.body)
  
  let {feedUrl} = req.body;
  const request = await fetch(feedUrl);
  // res.write('sending data...')
  

  const feedparser = new FeedParser();
  // feedparser.on('error', function(error){
  //   console.error(error);
  //   res.send(error)
  // })

  // feedparser.on('readable', function() {
  //   let stream = this;
  //   let item;
  //   while(item = stream.read()){
  //     let {title, enclosures, author, date, link, origlink} = item
  //     let episode = item['itunes:episode']
  //     let pod = {title, author, date, enclosures, link, origlink, episode}
  //     feedparser.write(pod)
  //   }
  // })
  // jsonTransformer.on('data', () => {
  //   let stream = this;
  //   let item;
  //   console.log('transformer has received some data')
  //   let data = this.read();
  //   console.log('transformer data: ', data)
  //   // while(item = stream.read()){
  //   //   console.log('in transformer: ')
  //   //   console.log(item)
  //   //   res.write(item);
  //   // }
    
  // })

  
  request.body.pipe(feedparser).pipe(jsonTransformer).pipe(res);


}