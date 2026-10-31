import { supabase } from '../supabaseClient'

export default async function HomePage() {
  return (
    <main style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>Welcome to Alphatails</h1>
      <p>Next.js and Supabase are connected and live!</p>
    </main>
  )
}

