import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getToken, isValidJwt, logout } from "../services/auth";
import api from "../services/api";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Form,
  Modal,
  Spinner,
  Alert,
} from "react-bootstrap";

type Product = {
  id: number;
  name: string;
  price: number;
};

type Order = {
  id: number;
  customerName: string;
  customerEmail: string;
  status: string;
  totalAmount: number;
  products: Product[];
};

export default function Pedidos() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    status: "pending",
    productIds: [] as number[],
  });

  useEffect(() => {
    const t = getToken();
    if (!t || !isValidJwt(t)) {
      logout();
      router.replace("/login");
    } else {
      setToken(t);
      fetchOrders(t);
      fetchProducts(t);
    }
  }, [router]);

  async function fetchOrders(token: string) {
    try {
      setLoading(true);
      const { data } = await api.get<Order[]>("/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(data);
    } catch {
      setError("Erro ao carregar pedidos");
    } finally {
      setLoading(false);
    }
  }

  async function fetchProducts(token: string) {
    try {
      const { data } = await api.get<Product[]>("/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(data);
    } catch {
      console.error("Erro ao carregar produtos");
    }
  }

  function openModal(order?: Order) {
    if (order) {
      setEditingOrder(order);
      setFormData({
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        status: order.status,
        productIds: order.products.map((p) => p.id),
      });
    } else {
      setEditingOrder(null);
      setFormData({
        customerName: "",
        customerEmail: "",
        status: "pending",
        productIds: [],
      });
    }
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
  }

  async function handleSubmit() {
    if (!token) return;
    try {
      if (editingOrder) {
        await api.put(`/orders/${editingOrder.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.post("/orders", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetchOrders(token);
      closeModal();
    } catch {
      setError("Erro ao salvar pedido");
    }
  }

  async function handleDelete(id: number) {
    if (!token) return;
    try {
      await api.delete(`/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchOrders(token);
    } catch {
      setError("Erro ao deletar pedido");
    }
  }

  if (!token) return null;

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm border-0">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <h3 className="mb-0">Pedidos</h3>
              <Button variant="primary" onClick={() => openModal()}>
                Novo Pedido
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
                      <th>Cliente</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>Total</th>
                      <th>Produtos</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o.id}>
                        <td>{o.id}</td>
                        <td>{o.customerName}</td>
                        <td>{o.customerEmail}</td>
                        <td>{o.status}</td>
                        <td>R$ {o.totalAmount.toFixed(2)}</td>
                        <td>{o.products.map((p) => p.name).join(", ")}</td>
                        <td>
                          <Button
                            size="sm"
                            variant="warning"
                            className="me-2"
                            onClick={() => openModal(o)}
                          >
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDelete(o.id)}
                          >
                            Deletar
                          </Button>
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

      <Modal show={showModal} onHide={closeModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingOrder ? "Editar Pedido" : "Novo Pedido"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nome do Cliente</Form.Label>
              <Form.Control
                type="text"
                value={formData.customerName}
                onChange={(e) =>
                  setFormData({ ...formData, customerName: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={formData.customerEmail}
                onChange={(e) =>
                  setFormData({ ...formData, customerEmail: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <option value="pending">Pendente</option>
                <option value="paid">Pago</option>
                <option value="shipped">Enviado</option>
                <option value="delivered">Entregue</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Produtos</Form.Label>
              <div className="border p-2" style={{ maxHeight: 200, overflowY: "auto" }}>
                {products.map((prod) => (
                  <Form.Check
                    key={prod.id}
                    type="checkbox"
                    label={`${prod.name} — R$ ${prod.price.toFixed(2)}`}
                    checked={formData.productIds.includes(prod.id)}
                    onChange={(e) => {
                      const selected = formData.productIds.includes(prod.id);
                      setFormData({
                        ...formData,
                        productIds: selected
                          ? formData.productIds.filter((id) => id !== prod.id)
                          : [...formData.productIds, prod.id],
                      });
                    }}
                  />
                ))}
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
