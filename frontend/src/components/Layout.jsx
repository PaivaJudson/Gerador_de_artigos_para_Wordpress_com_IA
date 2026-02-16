import { Outlet } from 'react-router-dom'
import { Container, Navbar, Nav } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      <Navbar bg="white" className="app-navbar" expand="md">
        <Container>
          <Navbar.Brand as={Link} to="/" className="fw-semibold">
            Gerador de Artigos WP
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="nav" />
          <Navbar.Collapse id="nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">Meus artigos</Nav.Link>
              <Nav.Link as={Link} to="/gerar">Gerar artigo</Nav.Link>
            </Nav>
            <Nav>
              <Navbar.Text className="me-3 text-muted small">
                {user?.full_name || user?.email}
              </Navbar.Text>
              <Nav.Link onClick={handleLogout}>Sair</Nav.Link>
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
