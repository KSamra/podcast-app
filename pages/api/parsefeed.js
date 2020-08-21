const FeedParser = require('feedparser');
const fetch = require('node-fetch');




export default async function handler(req, res) {
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
  //     let pod = [title, author, date, enclosures, link, origlink, episode]
  //     feedparser.write(res)
  //   }
  //   res.status(200).send({status: "all good"})
    
  // })
  console.log(req.body)
  let {feedUrl} = req.body;

  const request = await fetch(feedUrl);
  // res.write('sending data...')
  request.body.pipe(feedparser).pipe(res)

  // res.status(200).send({msg: 'successful!'})

}