import Nav from '../components/nav'
import Player from '../components/player';
// import fetch from 'node-fetch';
import axios from 'axios';
// import fs from 'fs';

export default function IndexPage({data, podcasts}) {
  
  let arr = podcasts.split('\n');

  arr.pop()
  let obj = arr.map(elem => JSON.parse(elem));
  console.log(obj);
 
  
  return (
    <div>
      <Nav />
      <div className="py-20">
        <h1 className="text-5xl text-center text-accent-1">
          Next.js + Tailwind CSS
        </h1>
        <Player/>
        <div>
          {data}
        </div>

        <ul>
         <li>{obj[1].title}</li>
        </ul>
        
      </div>
    </div>
  )
}

export async function getServerSideProps() {

  let podcastList = []

  // const res = await fetch(`http://localhost:3000/api/parsefeed?url=https://mcsorleys.barstoolsports.com/feed/call-her-daddy`, {
  //   method: 'GET',
  // })
  // console.log(res);
  // try {
  //   // let content = await res.text();
  //   // console.log(content)

  //   return {
  //     props: {data: 'some data'}
  //   }
  // } catch (error) {
  //   console.log(error);
  //   return {
  //     props: {}
  //   }
  // }

  

  try {
    const response = await axios.get('http://localhost:3000/api/parsefeed?url=https://atp.fm/rss');
    // const response = await axios({
    //   method: 'GET',
    //   url: 'http://localhost:3000/api/parsefeed?url=https://mcsorleys.barstoolsports.com/feed/call-her-daddy',
    //   responseType: 'stream',
    // })
    // // response.data.pipe(fs.createWriteStream('response.json'))
    // const stream = response.data;
    // stream.on('data', (chunk) => {
    //   console.log(typeof chunk)
    //   podcastList.push(chunk);
    // })
    // console.log(response.data);

    return {
      props: {
        data: 'some data',
        podcasts: response.data
      }
    }
  } catch (error) {
    console.error(error);
    
    return {
      props: {data: 'some data'}
    }
  }
}