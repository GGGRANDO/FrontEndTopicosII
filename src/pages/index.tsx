import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getToken, isValidJwt, logout } from "../services/auth";
import { Button } from "react-bootstrap";

export default function Home() {
  const router = useRouter();
  const [contador, setContador] = useState(0)
  const [professorFezChamada, setProfessorFezChamada] = useState(false)
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = getToken();
    if (!t || !isValidJwt(t)) {
      logout();
      router.replace("/login");
    } else {
      setToken(t);
    }
  }, [router]);

  if (!token) return null;

  return (
    <>
      <h1>Página inicial</h1>
      <p>Contador de clicks: {contador}</p>
      {
        professorFezChamada ? <h1>Terminou a aula</h1> : <h1>Ainda em aula</h1>
      }
      <br/><br/>
      <Button variant="warning" onClick={() => setContador(contador + 1)}>Incrementar</Button>
      <Button variant="danger" onClick={() => setContador(contador - 1)}>Decrementar</Button>

      <Button variant="primary" onClick={() => setProfessorFezChamada(!professorFezChamada)}>Chamada</Button>
    </>
  )
}