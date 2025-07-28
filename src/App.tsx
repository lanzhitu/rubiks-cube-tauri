import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [cubeState, setCubeState] = useState(null)

  useEffect(() => {
    fetch('http://127.0.0.1:8000/cube/state')
      .then(response => response.json())
      .then(data => setCubeState(data.state))
      .catch(error => console.error('Error fetching cube state:', error))
  }, [])

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      {cubeState && <pre>{JSON.stringify(cubeState, null, 2)}</pre>}
    </>
  )
}

export default App
