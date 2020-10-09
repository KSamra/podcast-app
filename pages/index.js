import Nav from '../components/nav'
import Player from '../components/player';
// import fetch from 'node-fetch';
import axios from 'axios';
import {useState, useEffect} from 'react';
import {execPipeline} from './api/parsefeedv3';

// import fs from 'fs';

export default function IndexPage({data, podcasts, podcastTitle}) {
  

  let [podcastList, setPodcastList] = useState(null);
 
  useEffect(() => {
    let arr = podcasts.split('\n');

    arr.pop()
    // let obj = arr.map(elem => JSON.parse(elem));
    // console.log(obj);
    setPodcastList(arr);
  }, [podcasts, podcastTitle])
  
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
         {/* {podcastList ? podcastList[0].title : null} */}
         {podcastList ? podcastList[0] : null}
        </ul>
        
      </div>
    </div>
  )
}

export async function getServerSideProps(context) {
  // const host = 'http://localhost:3000'

  // try {
  //   // const response = await axios.get( host + '/api/parsefeed?url=https://atp.fm/rss');

  //   const post = await axios.post(host + '/api/parsefeed', {
  //     url: 'https://atp.fm/rss'
  //   })
  //   // console.log(post.data);

  //   return {
  //     props: {
  //       data: 'some data',
  //       podcasts: post.data
  //     }
  //   }
  // } catch (error) {
  //   console.error(error);
    
  //   return {
  //     props: {data: 'some data'}
  //   }
  // }

  try {
    const data = await execPipeline('https://atp.fm/rss', ['title', 'author', 'date', 'enclosures', 'link', 'origlink', 'episode'])

    // data.on('data', (chunk) => {

    //   console.log(chunk)
      
    // })

    data.on('readable', function() {
      var chunk = null;
      while (chunk = data.read()) {
        console.log(chunk);
      }
    })

    return {
      props: {
          data: 'some data',
          podcasts: 'Title: ATP\nDesc: nothing much\n w\n'
      }
    }
      
  } catch (error) {
    console.log('error in index.js');
    console.error(error);

    return {
      props: {
        data: 'error',
        podcasts: []
      }
    }
  }
}