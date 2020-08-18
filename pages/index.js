import Nav from '../components/nav'
import Player from '../components/player';

export default function IndexPage() {
  return (
    <div>
      <Nav />
      <div className="py-20">
        <h1 className="text-5xl text-center text-accent-1">
          Next.js + Tailwind CSS
        </h1>
        <Player/>
      </div>
    </div>
  )
}
