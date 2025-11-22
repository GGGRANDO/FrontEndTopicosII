import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getToken, isValidJwt, logout } from "../services/auth";
import { Container, Row, Col, Card, Button, Table, Spinner, Alert, Modal, Form } from "react-bootstrap";
import api from "../services/api";

type User = {
  id: number;
  login: string;
  name: string;
  email: string;
};

export default function Home() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ login: "", name: "", email: "" });
  const [saving, setSaving] = useState(false);

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

  function openEdit(user: User) {
    setEditingUser(user);
    setFormData({ login: user.login, name: user.name, email: user.email });
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingUser(null);
    setFormData({ login: "", name: "", email: "" });
    setSaving(false);
  }

  async function handleSave() {
    if (!editingUser) return;
    setSaving(true);
    setError(null);
    try {
      const { data } = await api.put(`/users/${editingUser.id}`, formData);
      setUsers((prev) => prev.map((u) => (u.id === data.id ? { ...u, login: data.login, name: data.name, email: data.email } : u)));
      closeModal();
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || "Erro ao salvar usuário";
      setError(message);
      setSaving(false);
    }
  }

  async function fetchUsers(token: string) {
    try {
      setLoading(true);
      const { data } = await api.get<User[]>("/users");
      setUsers(data);
      setLoading(false);
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || "Erro ao buscar usuários.";
      setError(message);
      if (err?.response?.status === 401) {
        logout();
        router.replace("/login");
      }
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
                      <th>Login</th>
                      <th>ID</th>
                      <th>Nome</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.login}</td>
                        <td>{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <Button size="sm" variant="warning" className="me-2" onClick={() => openEdit(user)}>Editar</Button>
                          <Button size="sm" variant="danger" onClick={async () => {
                            if (!confirm(`Confirma exclusão do usuário ${user.login}?`)) return;
                            try {
                              await api.delete(`/users/${user.id}`);
                              setUsers((prev) => prev.filter((u) => u.id !== user.id));
                            } catch (err: any) {
                              const message = err?.response?.data?.message || err?.message || 'Erro ao deletar usuário';
                              setError(message);
                            }
                          }}>Deletar</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Usuário</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Login</Form.Label>
              <Form.Control value={formData.login} onChange={(e) => setFormData({ ...formData, login: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Nome</Form.Label>
              <Form.Control value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>Cancelar</Button>
          <Button variant="primary" onClick={handleSave} disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
