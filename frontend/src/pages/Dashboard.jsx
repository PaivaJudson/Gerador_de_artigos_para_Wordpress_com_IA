import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, Button, Spinner, ListGroup, Badge } from 'react-bootstrap'
import { api } from '../services/api'

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default function Dashboard() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.listArticles()
      .then(setArticles)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id, e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!window.confirm('Excluir este artigo?')) return
    try {
      await api.deleteArticle(id)
      setArticles((prev) => prev.filter((a) => a.id !== id))
    } catch (e) {
      setError(e.message)
    }
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    )
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h4 mb-0">Meus artigos</h1>
        <Button as={Link} to="/gerar" variant="primary">
          Gerar novo artigo
        </Button>
      </div>
      {error && (
        <div className="alert alert-danger alert-dismissible">
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')} aria-label="Fechar" />
        </div>
      )}
      <Card>
        <Card.Body className="p-0">
          {articles.length === 0 ? (
            <div className="text-center text-muted py-5">
              <p className="mb-2">Nenhum artigo ainda.</p>
              <Button as={Link} to="/gerar" variant="outline-primary">
                Gerar primeiro artigo
              </Button>
            </div>
          ) : (
            <ListGroup variant="flush">
              {articles.map((a) => (
                <ListGroup.Item
                  key={a.id}
                  as={Link}
                  to={`/artigo/${a.id}`}
                  action
                  className="d-flex justify-content-between align-items-start"
                >
                  <div className="flex-grow-1 min-w-0">
                    <div className="fw-medium">{a.title}</div>
                    {a.excerpt && (
                      <div className="article-preview text-muted small mt-1">{a.excerpt}</div>
                    )}
                    <Badge bg="light" text="dark" className="mt-2">
                      {formatDate(a.created_at)}
                    </Badge>
                  </div>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="ms-2"
                    onClick={(e) => handleDelete(a.id, e)}
                  >
                    Excluir
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>
    </>
  )
}
