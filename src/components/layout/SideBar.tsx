import Link from "next/link";
import { useRouter } from "next/router";
import { Nav } from "react-bootstrap";
import clsx from "clsx";

export default function Sidebar() {
  const { pathname } = useRouter();

  const items = [
    { href: "/", label: "Início" },
    { href: "/pedidos", label: "Pedidos" },
    { href: "/produtos", label: "Produtos" },
    { href: "/usuarios", label: "Usuários" },
    { href: "/sobre", label: "Sobre" },
  ];

  return (
    <aside
      data-bs-theme="dark"
      className="d-flex flex-column bg-dark text-light p-3"
      style={{
        width: "240px",
        minHeight: "100vh",
        borderRight: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <div className="mb-4">
        <h2 className="h5 fw-bold text-center mb-0">3G Eletrônicos</h2>
      </div>

      <Nav variant="pills" className="flex-column gap-2">
        {items.map(({ href, label }) => (
          <Nav.Link
            as={Link}
            key={href}
            href={href}
            className={clsx(
              "text-light rounded-2 py-2 px-3",
              pathname === href
                ? "active bg-light text-dark fw-semibold"
                : "bg-dark-subtle text-light hover-opacity"
            )}
          >
            {label}
          </Nav.Link>
        ))}
      </Nav>
    </aside>
  );
}
