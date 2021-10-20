import Head from 'next/head'

import Navbar from '../components/Navbar'
import Exchange from '../components/Exchange'
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Exchange />
    </div>
  )
}
