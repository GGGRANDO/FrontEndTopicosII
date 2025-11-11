import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getToken, isValidJwt, logout } from "../services/auth";
import { Container, Row, Col, Card, Button, Table, Spinner, Alert } from "react-bootstrap";
import api from "../services/api";

type User = {
  id: number;
  name: string;
  email: string;
};

export default function Home() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const t = getToken();
    if (!t || !isValidJwt(t)) {
      logout();
      router.replace("/login");
    } else {
      setToken(t);
      fetchUsers(t);
    }
  }, [router]);

  async function fetchUsers(token: string) {
    try {
      setLoading(true);
      const { data } = await api.get<User[]>("/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(data);
      setLoading(false);
    } catch (err: any) {
      setError("Erro ao buscar usuários.");
      setLoading(false);
    }
  }

  if (!token) return null;

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm border-0">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <h3 className="mb-0">Painel de Usuários</h3>
              <Button variant="danger" onClick={() => { logout(); router.replace("/login"); }}>
                Sair
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        <Col>
          <Card className="shadow-sm border-0">
            <Card.Body>
              {loading ? (
                <div className="d-flex justify-content-center py-5">
                  <Spinner animation="border" variant="primary" />
                </div>
              ) : (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nome</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
