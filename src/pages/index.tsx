import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getToken, isValidJwt, logout } from "../services/auth";
import { Button, Form, Container, Row, Col, Card, Alert, Spinner } from "react-bootstrap";
import api from "../services/api";

export default function Home() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const t = getToken();
    if (t && isValidJwt(t)) {
      setToken(t);
    }
  }, []);

  async function handleRegister(e: any) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!login || !password) {
      setError("Login e senha são obrigatórios");
      return;
    }
    try {
      setLoading(true);
      const resp = await api.post("/users", { login, password });
      setSuccess(resp.data?.message || "Usuário criado com sucesso");
      setLogin("");
      setPassword("");
      setTimeout(() => router.push("/login"), 1200);
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || "Erro ao criar usuário";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  if (token) {
    return (
      <>
        <h1>Página inicial</h1>
        <p>Bem-vindo!</p>
        <Button variant="danger" onClick={() => { logout(); router.replace("/login"); }}>
          Sair
        </Button>
      </>
    );
  }

  return (
    <Container className="d-flex align-items-center" style={{ minHeight: '100vh' }}>
      <Row className="w-100 justify-content-center">
        <Col xs={12} md={6} lg={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <h4 className="mb-3">Cadastro</h4>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}
              <Form onSubmit={handleRegister}>
                <Form.Group className="mb-2">
                  <Form.Label>Login</Form.Label>
                  <Form.Control value={login} onChange={(e) => setLogin(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Senha</Form.Label>
                  <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </Form.Group>
                <div className="d-flex justify-content-between align-items-center">
                  <Button type="submit" variant="primary" disabled={loading}>
                    {loading ? <Spinner animation="border" size="sm" /> : "Cadastrar"}
                  </Button>
                  <Button variant="link" onClick={() => router.push('/login')}>Já tenho conta</Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}