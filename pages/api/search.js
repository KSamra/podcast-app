
const fetch = require('node-fetch')

const iTunesUrl = 'https://itunes.apple.com/search?entity=podcast'

export default async function handler(req, res) {
  
  let {key,limit=25} = req.query;
  console.log('received search key = ', key, ' with limit ', limit);
  try {
    const response = await fetch(`${iTunesUrl}&term=${key}&limit=${limit}`);
    const results = await response.json();

    console.dir(results.results[0], {depth: 0})
    return res.status(200).send({data: results.results[0]})
  } catch (error) {
    console.log(error)
    return res.status(500).send({error})
  }
  
  
}