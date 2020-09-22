import Nav from '../components/nav'
import Player from '../components/player';
import fetch from 'node-fetch';

export default function IndexPage({data}) {
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
        
      </div>
    </div>
  )
}

export async function getServerSideProps(){
  const res = await fetch(`http://localhost:3000/api/parsefeed/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: "https://mcsorleys.barstoolsports.com/feed/call-her-daddy"
  })

  console.log(res)

  return {
    props: {data: 'some data'}
  }
}