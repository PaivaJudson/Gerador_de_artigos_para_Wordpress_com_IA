import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Card, Spinner, Button, Badge } from 'react-bootstrap'
import { api } from '../services/api'

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function ArticleDetail() {
  const { id } = useParams()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.getArticle(id)
      .then(setArticle)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    )
  }

  if (error || !article) {
    return (
      <Card>
        <Card.Body className="text-center py-5">
          <p className="text-danger">{error || 'Artigo não encontrado.'}</p>
          <Button as={Link} to="/" variant="outline-primary">Voltar</Button>
        </Card.Body>
      </Card>
    )
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-start mb-3 flex-wrap gap-2">
        <Button as={Link} to="/" variant="outline-secondary" size="sm">
          ← Meus artigos
        </Button>
        <Badge bg="light" text="dark">{formatDate(article.created_at)}</Badge>
      </div>
      <Card>
        <Card.Body>
          <h1 className="h3 mb-3">{article.title}</h1>
          {article.excerpt && (
            <p className="text-muted mb-3">{article.excerpt}</p>
          )}
          {article.model_used && (
            <p className="small text-muted mb-3">Gerado com {article.model_used}</p>
          )}
          <div
            className="content-html"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </Card.Body>
      </Card>
    </>
  )
}
