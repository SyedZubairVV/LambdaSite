import { useState } from 'react'

export default function FunctionCard({ fn }) {
  const [values, setValues] = useState({})
  const [response, setResponse] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  function handleChange(name, value) {
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  async function handleCall() {
    setLoading(true)
    setResponse(null)
    setIsError(false)

    const isGet = fn.method.toUpperCase() === 'GET'

    try {
      const res = await fetch(fn.endpoint, {
        method: fn.method.toUpperCase(),
        headers: isGet ? undefined : { 'Content-Type': 'application/json' },
        body: isGet ? undefined : JSON.stringify(values),
      })

      const text = await res.text()
      let parsed
      try {
        parsed = JSON.parse(text)
        setResponse(JSON.stringify(parsed, null, 2))
      } catch {
        setResponse(text)
      }

      if (!res.ok) setIsError(true)
    } catch (err) {
      setResponse(err.message)
      setIsError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2>{fn.name}</h2>
        <span className={`method method-${fn.method.toLowerCase()}`}>{fn.method}</span>
      </div>

      {fn.description && <p className="description">{fn.description}</p>}

      <div className="endpoint">{new URL(fn.endpoint).pathname.replace('/api/', '')}</div>

      {fn.inputFields.length > 0 && (
        <div className="fields">
          {fn.inputFields.map((field) => (
            <div key={field.name} className="field">
              <label htmlFor={`${fn.id}-${field.name}`}>{field.label}</label>
              {field.type === 'textarea' ? (
                <textarea
                  id={`${fn.id}-${field.name}`}
                  placeholder={field.placeholder || ''}
                  value={values[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  rows={5}
                />
              ) : (
                <input
                  id={`${fn.id}-${field.name}`}
                  type={field.type || 'text'}
                  placeholder={field.placeholder || ''}
                  value={values[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
      )}

      <button className="call-btn" onClick={handleCall} disabled={loading}>
        {loading ? 'Calling...' : 'Call Function'}
      </button>

      {response !== null && (
        <div className={`response ${isError ? 'response-error' : 'response-ok'}`}>
          <div className="response-label">{isError ? 'Error' : 'Response'}</div>
          <pre>{response}</pre>
        </div>
      )}
    </div>
  )
}
