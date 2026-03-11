import { useState } from 'react'
import PaginaNotasFicais from './pages/PaginaNotas'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <PaginaNotasFicais />
    </>
  )
}

export default App
