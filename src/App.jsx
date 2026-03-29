import { useEffect, useState } from 'react'
import Header from './components/Header'
import FunctionCard from './components/FunctionCard'
import FileBrowserCard from './components/FileBrowserCard'

export default function App() {
  const [functions, setFunctions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + 'lambda-config.json')
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load config (${res.status})`)
        return res.json()
      })
      .then((data) => setFunctions(data.functions))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="app">
      <Header />
      <main className="main">
        {loading && <p className="status">Loading functions...</p>}
        {error && <p className="status error">Error: {error}</p>}
        {!loading && !error && functions.length === 0 && (
          <p className="status">No functions configured yet. Add some to <code>public/lambda-config.json</code>.</p>
        )}
        <div className="grid">
          {functions.map((fn) =>
            fn.type === 'file-browser' ? (
              <FileBrowserCard key={fn.id} fn={fn} />
            ) : (
              <FunctionCard key={fn.id} fn={fn} />
            )
          )}
        </div>
      </main>
    </div>
  )
}
