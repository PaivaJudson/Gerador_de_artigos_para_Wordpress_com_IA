import { Outlet, Link, useNavigate } from 'react-router-dom'
import { Container, Navbar, Nav } from 'react-bootstrap'
import { useDemo } from '../context/DemoContext'

const BASE = '/demo'

export default function DemoLayout() {
  const { user } = useDemo()
  const navigate = useNavigate()

  return (
    <>
      <Navbar bg="white" className="app-navbar" expand="md">
        <Container>
          <Navbar.Brand as={Link} to={BASE} className="fw-semibold">
            Gerador de Artigos WP <span className="badge bg-secondary ms-1">Demo</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="nav-demo" />
          <Navbar.Collapse id="nav-demo">
            <Nav className="me-auto">
              <Nav.Link as={Link} to={BASE}>Meus artigos</Nav.Link>
              <Nav.Link as={Link} to={`${BASE}/gerar`}>Gerar artigo</Nav.Link>
            </Nav>
            <Nav>
              <Navbar.Text className="me-3 text-muted small">
                {user?.full_name || user?.email}
              </Navbar.Text>
              <Nav.Link onClick={() => navigate('/login')}>Sair da demo</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <main className="py-4">
        <Container>
          <Outlet />
        </Container>
      </main>
    </>
  )
}
