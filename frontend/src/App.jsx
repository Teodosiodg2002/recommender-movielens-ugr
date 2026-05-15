import { useState } from 'react'
import { motion } from 'framer-motion'

const API_BASE = 'http://127.0.0.1:8000'
const spanishNames = [
  'Lucía', 'Mateo', 'Sofía', 'Hugo', 'Martina', 'Lucas', 'Valeria', 'Daniel',
  'Aitana', 'Pablo', 'María', 'Adrián', 'Noa', 'Alejandro', 'Sara', 'Álvaro',
  'Julia', 'Diego', 'Clara', 'Javier', 'Irene', 'Miguel', 'Nora', 'Carlos', 'Eva'
]

function getUserLabel(id) {
  const numeric = Number(id) || 0
  const index = Math.abs(numeric) % spanishNames.length
  return `${spanishNames[index]} (${numeric})`
}

function App() {
  const [userId, setUserId] = useState('1')
  const [comparisonUserId, setComparisonUserId] = useState('2')
  const [limit, setLimit] = useState('10')
  const [minSimilarity, setMinSimilarity] = useState('0.0')
  const [recommendations, setRecommendations] = useState([])
  const [similarity, setSimilarity] = useState(null)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  const validateInputs = () => {
    const user = Number(userId)
    const other = Number(comparisonUserId)
    const limitNum = Number(limit)
    const minSim = Number(minSimilarity)

    if (!Number.isInteger(user) || user < 1) {
      return 'Introduce un ID válido para el Usuario 1 (entero mayor o igual que 1).'
    }
    if (!Number.isInteger(other) || other < 1) {
      return 'Introduce un ID válido para el Usuario 2 (entero mayor o igual que 1).'
    }
    if (!Number.isInteger(limitNum) || limitNum < 1 || limitNum > 50) {
      return 'El límite debe ser un número entre 1 y 50.'
    }
    if (Number.isNaN(minSim) || minSim < 0 || minSim > 1) {
      return 'La similitud mínima debe estar entre 0.0 y 1.0.'
    }
    return ''
  }

  const handleFetchRecommendations = async () => {
    const validationError = validateInputs()
    if (validationError) {
      setError(validationError)
      setStatus('')
      return
    }

    setStatus('Cargando recomendaciones...')
    setError('')
    setRecommendations([])
    setSimilarity(null)

    try {
      const response = await fetch(
        `${API_BASE}/recommendations/${userId}?limit=${limit}&min_similarity=${minSimilarity}`
      )
      if (!response.ok) {
        const message = await response.text()
        throw new Error(message || `Error ${response.status}`)
      }
      const data = await response.json()
      setRecommendations(data.recommendations)
      setStatus(`Recomendaciones recibidas para ${getUserLabel(userId)}`)
    } catch (error) {
      setError(`Error: ${error.message}`)
      setStatus('')
    }
  }

  const handleFetchSimilarity = async () => {
    const validationError = validateInputs()
    if (validationError) {
      setError(validationError)
      setStatus('')
      return
    }

    setStatus('Cargando similitud...')
    setError('')
    setRecommendations([])
    setSimilarity(null)

    try {
      const response = await fetch(
        `${API_BASE}/similarity/${userId}/${comparisonUserId}`
      )
      if (!response.ok) {
        const message = await response.text()
        throw new Error(message || `Error ${response.status}`)
      }
      const data = await response.json()
      setSimilarity(data)
      setStatus(`Similitud entre ${getUserLabel(userId)} y ${getUserLabel(comparisonUserId)} recibida`)
    } catch (error) {
      setError(`Error: ${error.message}`)
      setStatus('')
    }
  }

  return (
    <motion.div
      className="app-container"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      <header>
        <h1>Recommender MovieLens</h1>
      </header>

      <main className="page-grid">
        <aside className="description-card">
          <h2>¿Qué hace esta aplicación?</h2>
          <p>Explora cómo se generan recomendaciones basadas en usuarios parecidos dentro del dataset MovieLens 100k.</p>
          <p>Elige un usuario principal para ver sugerencias y utiliza un segundo usuario para comparar qué tan similares son sus preferencias.</p>
          <p>Así puedes entender rápidamente qué perfiles comparten gustos y cómo varían las recomendaciones con diferentes filtros.</p>
          <ul>
            <li><strong>Usuario 1:</strong> perfil principal para recomendaciones.</li>
            <li><strong>Usuario 2:</strong> perfil de comparación para medir similitud.</li>
            <li><strong>Similaridad mínima:</strong> ajusta cuán cercanos deben ser los usuarios.</li>
          </ul>
        </aside>

        <section className="right-panel">
          <div className="interactive-grid">
            <motion.div className="control-card" whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
              <div className="card-title">Controles</div>

              <div className="user-selectors">
                <div className="user-card compact-card">
                  <div className="card-label">Usuario 1</div>
                  <div className="input-row">
                    <input
                      type="number"
                      min="1"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      className="compact-input"
                    />
                    <span className="user-label">{getUserLabel(userId)}</span>
                  </div>
                  <p className="field-note">Perfil principal para generar recomendaciones.</p>
                </div>

                <div className="user-card compact-card">
                  <div className="card-label">Usuario 2</div>
                  <div className="input-row">
                    <input
                      type="number"
                      min="1"
                      value={comparisonUserId}
                      onChange={(e) => setComparisonUserId(e.target.value)}
                      className="compact-input"
                    />
                    <span className="user-label">{getUserLabel(comparisonUserId)}</span>
                  </div>
                  <p className="field-note">Solo se utiliza para comparar similitud.</p>
                </div>
              </div>

              <label>
                Límite de recomendaciones
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                />
              </label>
              <span className="field-note">Máximo 50 resultados.</span>

              <label>
                Similaridad mínima
                <input
                  type="range"
                  step="0.05"
                  min="0"
                  max="1"
                  value={minSimilarity}
                  onChange={(e) => setMinSimilarity(e.target.value)}
                />
                <div className="range-row">
                  <span>0.0</span>
                  <strong>{Number(minSimilarity).toFixed(2)}</strong>
                  <span>1.0</span>
                </div>
              </label>
              <span className="field-note">Filtra solo usuarios con ese nivel de correlación.</span>

              <div className="buttons">
                <motion.button
                  onClick={handleFetchRecommendations}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Recomendaciones
                </motion.button>
                <motion.button
                  onClick={handleFetchSimilarity}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Comparar usuarios
                </motion.button>
              </div>
            </motion.div>

            <motion.div
              className="results-card"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              <div className="card-title">Resultados</div>
              <div className="results-status">
                {error ? <p className="error-message">{error}</p> : <p>{status || 'Pulsa un botón para ver resultados.'}</p>}
              </div>

              <div className="results-content">
                {recommendations.length > 0 ? (
                  <div>
                    <h2>Recomendaciones para {getUserLabel(userId)}</h2>
                    <ol>
                      {recommendations.map((item) => (
                        <li key={item.movie_id}>
                          <strong>{item.title}</strong>
                          <span className="score">{item.score.toFixed(3)}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                ) : (
                  status.startsWith('Recomendaciones recibidas') && (
                    <div>
                      <h2>Recomendaciones</h2>
                      <p>No se han encontrado recomendaciones con estos parámetros.</p>
                    </div>
                  )
                )}

                {similarity && (
                  <div className="similarity-result">
                    <h2>Similitud de Pearson</h2>
                    <p>{getUserLabel(similarity.user_id_1)} vs {getUserLabel(similarity.user_id_2)}</p>
                    <p>Valor: {similarity.pearson.toFixed(3)}</p>
                    <p>Películas compartidas: {similarity.shared_movie_count}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </motion.div>
  )
}

export default App
