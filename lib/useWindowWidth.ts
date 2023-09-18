import { useEffect, useState } from 'react'

export function useWindowWidth() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  useEffect(() => {
    // Function to update windowWidth state
    function handleResize() {
      setWindowWidth(window.innerWidth)
    }

    // Add event listener for window resize
    window.addEventListener('resize', handleResize)

    // Cleanup by removing the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, []) // The empty array [] ensures this effect runs only once

  return windowWidth
}
