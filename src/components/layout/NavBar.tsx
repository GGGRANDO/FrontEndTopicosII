import Link from "next/link";
import { Container, Nav, Navbar } from "react-bootstrap";

export default function NavBar() {
  return (
    <header className="h-14 border-b bg-dark flex items-center px-4">
      <div className="text-sm text-gray-600">
        <Navbar bg="dark" data-bs-theme="dark">
          <Container>
            <Navbar.Brand as={Link} href="#">UPFome</Navbar.Brand>
            <Nav className="me-auto">
              <Nav.Link as={Link} href="/">Home</Nav.Link>
              <Nav.Link as={Link} href="/usuarios">Pedidos</Nav.Link>
              <Nav.Link as={Link} href="/produtos">Produtos</Nav.Link>
              <Nav.Link as={Link} href="/usuarios">Usuários</Nav.Link>
            </Nav>
          </Container>
        </Navbar>
      </div>
      {/* logoff button */}
    </header>
  )
}