import { useState } from 'react'

const API_BASE = 'http://127.0.0.1:8000'

function App() {
  const [userId, setUserId] = useState('1')
  const [limit, setLimit] = useState('10')
  const [recommendations, setRecommendations] = useState([])
  const [similarity, setSimilarity] = useState(null)
  const [status, setStatus] = useState('')

  const handleFetchRecommendations = async () => {
    setStatus('Cargando recomendaciones...')
    setRecommendations([])
    setSimilarity(null)

    try {
      const response = await fetch(`${API_BASE}/recommendations/${userId}?limit=${limit}`)
      if (!response.ok) {
        throw new Error(`Error ${response.status}`)
      }
      const data = await response.json()
      setRecommendations(data.recommendations)
      setStatus('Recomendaciones recibidas')
    } catch (error) {
      setStatus(`Error: ${error.message}`)
    }
  }

  const handleFetchSimilarity = async () => {
    setStatus('Cargando similitud...')
    setRecommendations([])
    setSimilarity(null)

    try {
      const response = await fetch(`${API_BASE}/similarity/${userId}/2`)
      if (!response.ok) {
        throw new Error(`Error ${response.status}`)
      }
      const data = await response.json()
      setSimilarity(data)
      setStatus('Similitud recibida')
    } catch (error) {
      setStatus(`Error: ${error.message}`)
    }
  }

  return (
    <div className="app-container">
      <header>
        <h1>Recommender MovieLens</h1>
        <p>Interfaz básica para probar recomendaciones y similitud de usuarios.</p>
      </header>

      <section className="control-panel">
        <label>
          Usuario ID:
          <input
            type="number"
            min="1"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </label>

        <label>
          Límite de recomendaciones:
          <input
            type="number"
            min="1"
            max="50"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
          />
        </label>

        <div className="buttons">
          <button onClick={handleFetchRecommendations}>Obtener recomendaciones</button>
          <button onClick={handleFetchSimilarity}>Obtener similitud con usuario 2</button>
        </div>
      </section>

      <section className="status-panel">
        <p>{status}</p>
      </section>

      <section className="results">
        {recommendations.length > 0 && (
          <div>
            <h2>Recomendaciones</h2>
            <ol>
              {recommendations.map((item) => (
                <li key={item.movie_id}>
                  <strong>{item.title}</strong> (score: {item.score.toFixed(3)})
                </li>
              ))}
            </ol>
          </div>
        )}

        {similarity && (
          <div>
            <h2>Similitud de Pearson</h2>
            <p>Usuario {similarity.user_id_1} vs Usuario {similarity.user_id_2}</p>
            <p>Valor: {similarity.pearson.toFixed(3)}</p>
            <p>Películas compartidas: {similarity.shared_movie_count}</p>
          </div>
        )}
      </section>
    </div>
  )
}

export default App
