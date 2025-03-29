import dynamic from 'next/dynamic'

// Dynamically import the LandingPage component with no SSR
// This is important for the animations that use document in useEffect
const LandingPage = dynamic(() => import('../landing'), { ssr: false })

export default function LandingRoute() {
  return <LandingPage />
} 