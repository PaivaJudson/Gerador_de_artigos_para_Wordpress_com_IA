import { Link } from 'react-router-dom'
import { Card, Button, ListGroup, Badge } from 'react-bootstrap'
import { useDemo } from '../context/DemoContext'

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default function DashboardDemo() {
  const { articles } = useDemo()

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h4 mb-0">Meus artigos</h1>
        <Button as={Link} to="/demo/gerar" variant="primary">
          Gerar novo artigo
        </Button>
      </div>
      <Card>
        <Card.Body className="p-0">
          <ListGroup variant="flush">
            {articles.map((a) => (
              <ListGroup.Item
                key={a.id}
                as={Link}
                to={`/demo/artigo/${a.id}`}
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
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>
    </>
  )
}
