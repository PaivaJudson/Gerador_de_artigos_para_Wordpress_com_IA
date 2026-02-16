import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card, Form, Button, Alert } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Falha ao entrar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 py-4">
      <Card className="w-100" style={{ maxWidth: '400px' }}>
        <Card.Body className="p-4">
          <h2 className="h4 mb-4 text-center">Entrar</h2>
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError('')}>
              {error}
              {error.includes('conectar ao servidor') && (
                <div className="mt-2 small">
                  No terminal: <code className="bg-light px-1">cd backend && uvicorn app.main:app --reload --port 8000</code>
                </div>
              )}
            </Alert>
          )}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>E-mail</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                autoComplete="email"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Senha</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </Form.Group>
            <Button type="submit" variant="primary" className="w-100 mb-2" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
            <p className="text-center text-muted small mb-0">
              Não tem conta? <Link to="/register">Cadastre-se</Link>
            </p>
          </Form>
        </Card.Body>
      </Card>
    </div>
  )
}
