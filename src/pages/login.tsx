import { login } from "@/services/auth"
import { useState } from "react"
import { useRouter } from "next/router"
import { Button, Card, Col, Container, Form, FormControl, FormGroup, FormLabel, Row } from "react-bootstrap"

export default function Home() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleUser(e: any) {
    setUsername(e.target.value)
  }

  function handlePassword(e: any) {
    setPassword(e.target.value)
  }

  async function submitLogin(e: any) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await login({ username, password });
    setLoading(false);

    if (res.ok) {
      router.push("/");
    } else {
      setError(res.error || "Credenciais inválidas");
    }
  }

  return (
    <>
      <Container className="d-flex align-items-center" style={{ minHeight: '100vh' }}>
        <Row className="w-100 justify-content-center">
          <Col xs={12} md={6} lg={4}>
            <Card className="shadow-sm">
              <Card.Body>
                <Form onSubmit={submitLogin}>
                  <FormGroup>
                    <FormLabel>Usuário</FormLabel>
                    <FormControl
                      type="text"
                      value={username}
                      placeholder="Digite seu usuário"
                      onChange={handleUser}
                    ></FormControl>
                  </FormGroup>
                  <FormGroup>
                    <FormLabel>Password</FormLabel>
                    <FormControl
                      type="password"
                      value={password}
                      placeholder="Digite sua senha"
                      onChange={handlePassword}
                    ></FormControl>
                  </FormGroup>
                  <br></br>
                  <Button type="submit" variant="primary">Enviar</Button>
                  {error && <p style={{ color: "red" }}>{error}</p>}
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  )
}