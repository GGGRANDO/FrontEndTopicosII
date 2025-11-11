import { useState, FormEvent } from "react";
import { useRouter } from "next/router";

export default function CadastroPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Falha no cadastro");
      setMsg("Usuário cadastrado! Você já pode fazer login.");
      setTimeout(() => router.replace("/login"), 1200);
    } catch (err: any) {
      setMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 bg-white p-6 rounded-2xl shadow">
        <h1 className="text-2xl font-bold text-center">Cadastro</h1>
        <input className="w-full border rounded-lg px-3 py-2" placeholder="Nome"
               value={name} onChange={(e) => setName(e.target.value)} />
        <input className="w-full border rounded-lg px-3 py-2" placeholder="E-mail" type="email"
               value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full border rounded-lg px-3 py-2" placeholder="Senha" type="password"
               value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="w-full rounded-lg px-3 py-2 bg-black text-white" disabled={loading}>
          {loading ? "Enviando..." : "Cadastrar"}
        </button>
        {msg && <p className="text-center text-sm text-red-600">{msg}</p>}
      </form>
    </div>
  );
}
