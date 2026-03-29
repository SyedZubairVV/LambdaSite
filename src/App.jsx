import Header from './components/Header'
import FunctionCard from './components/FunctionCard'
import FileBrowserCard from './components/FileBrowserCard'
import functions from './config'

export default function App() {
  return (
    <div className="app">
      <Header />
      <main className="main">
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
