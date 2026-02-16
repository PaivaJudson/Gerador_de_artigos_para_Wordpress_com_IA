import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Form, Button, Alert, Spinner } from 'react-bootstrap'
import { api } from '../services/api'

const MODELS = [
  { value: 'gpt-4o-mini', label: 'GPT-4o Mini (rápido e econômico)' },
  { value: 'gpt-4o', label: 'GPT-4o (mais capaz)' },
  { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
]

export default function Generate() {
  const [topic, setTopic] = useState('')
  const [model, setModel] = useState('gpt-4o-mini')
  const [save, setSave] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const article = await api.generateArticle({
        topic: topic.trim(),
        model_used: model,
        save,
      })
      navigate(`/artigo/${article.id}`)
    } catch (err) {
      setError(err.message || 'Erro ao gerar artigo')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <h1 className="h4 mb-4">Gerar artigo com IA</h1>
      <Card>
        <Card.Body>
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError('')}>
              {error}
            </Alert>
          )}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Tema ou prompt do artigo</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ex: Benefícios da meditação para produtividade no trabalho"
                required
                minLength={3}
              />
              <Form.Text className="text-muted">
                Descreva o assunto e, se quiser, o tom ou público-alvo.
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Modelo OpenAI</Form.Label>
              <Form.Select value={model} onChange={(e) => setModel(e.target.value)}>
                {MODELS.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Check
                type="switch"
                id="save"
                label="Salvar artigo no banco após gerar"
                checked={save}
                onChange={(e) => setSave(e.target.checked)}
              />
            </Form.Group>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Gerando...
                </>
              ) : (
                'Gerar artigo'
              )}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </>
  )
}
