import { useState } from 'react'

export default function FileBrowserCard({ fn }) {
  const [files, setFiles] = useState([])
  const [selectedFile, setSelectedFile] = useState('')
  const [fileContent, setFileContent] = useState(null)
  const [loadingList, setLoadingList] = useState(false)
  const [loadingContent, setLoadingContent] = useState(false)
  const [error, setError] = useState(null)

  async function loadFiles() {
    setLoadingList(true)
    setError(null)
    setFiles([])
    setSelectedFile('')
    setFileContent(null)
    try {
      const res = await fetch(fn.listEndpoint)
      if (!res.ok) throw new Error(`List request failed (${res.status})`)
      const data = await res.json()
      setFiles(data.files || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoadingList(false)
    }
  }

  async function handleSelect(filename) {
    setSelectedFile(filename)
    setFileContent(null)
    if (!filename) return
    setLoadingContent(true)
    setError(null)
    try {
      const url = `${fn.getEndpoint}&filename=${encodeURIComponent(filename)}`
      const res = await fetch(url)
      if (!res.ok) throw new Error(`Get request failed (${res.status})`)
      const data = await res.json()
      setFileContent(data.text)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoadingContent(false)
    }
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2>{fn.name}</h2>
        <span className="method method-get">GET</span>
      </div>

      {fn.description && <p className="description">{fn.description}</p>}

      <div className="endpoint">{new URL(fn.listEndpoint).pathname.replace('/api/', '')}</div>

      <button className="call-btn" onClick={loadFiles} disabled={loadingList}>
        {loadingList ? 'Loading...' : 'Load Files'}
      </button>

      {files.length > 0 && (
        <div className="fields">
          <div className="field">
            <label htmlFor={`${fn.id}-select`}>Select a file</label>
            <select
              id={`${fn.id}-select`}
              value={selectedFile}
              onChange={(e) => handleSelect(e.target.value)}
              className="file-select"
            >
              <option value="">-- Choose a file --</option>
              {files.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {files.length === 0 && !loadingList && !error && (
        <p style={{ fontSize: '0.85rem', color: '#9ca3af' }}>No files found. Save some text first.</p>
      )}

      {loadingContent && <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>Loading file content...</p>}

      {error && (
        <div className="response response-error">
          <div className="response-label">Error</div>
          <pre>{error}</pre>
        </div>
      )}

      {fileContent !== null && !loadingContent && (
        <div className="response response-ok">
          <div className="response-label">{selectedFile}</div>
          <pre>{fileContent}</pre>
        </div>
      )}
    </div>
  )
}
