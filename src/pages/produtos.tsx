import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getToken, isValidJwt, logout } from "../services/auth";
import api from "../services/api";
import { Container, Row, Col, Card, Table, Button, Form, Modal, Spinner, Alert } from "react-bootstrap";

type Product = {
  id: number;
  name: string;
  description?: string;
  price: number;
  available: boolean;
};

export default function Produtos() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "", price: 0, available: true });

  useEffect(() => {
    const t = getToken();
    if (!t || !isValidJwt(t)) {
      logout();
      router.replace("/login");
    } else {
      setToken(t);
      fetchProducts(t);
    }
  }, [router]);

  async function fetchProducts(token: string) {
    try {
      setLoading(true);
      const { data } = await api.get<Product[]>("/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(data);
      setLoading(false);
    } catch (err) {
      setError("Erro ao carregar produtos");
      setLoading(false);
    }
  }

  function openModal(product?: Product) {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description || "",
        price: product.price,
        available: product.available,
      });
    } else {
      setEditingProduct(null);
      setFormData({ name: "", description: "", price: 0, available: true });
    }
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
  }

  async function handleSubmit() {
    if (!token) return;

    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.post("/products", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetchProducts(token);
      closeModal();
    } catch (err) {
      setError("Erro ao salvar produto");
    }
  }

  async function handleDelete(id: number) {
    if (!token) return;
    try {
      await api.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts(token);
    } catch (err) {
      setError("Erro ao deletar produto");
    }
  }

  if (!token) return null;

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm border-0">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <h3 className="mb-0">Produtos</h3>
              <Button variant="primary" onClick={() => openModal()}>Novo Produto</Button>
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
                      <th>Descrição</th>
                      <th>Preço</th>
                      <th>Disponível</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id}>
                        <td>{p.id}</td>
                        <td>{p.name}</td>
                        <td>{p.description}</td>
                        <td>R$ {p.price.toFixed(2)}</td>
                        <td>{p.available ? "Sim" : "Não"}</td>
                        <td>
                          <Button size="sm" variant="warning" className="me-2" onClick={() => openModal(p)}>Editar</Button>
                          <Button size="sm" variant="danger" onClick={() => handleDelete(p.id)}>Deletar</Button>
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
          <Modal.Title>{editingProduct ? "Editar Produto" : "Novo Produto"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Preço</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Disponível"
                checked={formData.available}
                onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>Cancelar</Button>
          <Button variant="primary" onClick={handleSubmit}>Salvar</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
