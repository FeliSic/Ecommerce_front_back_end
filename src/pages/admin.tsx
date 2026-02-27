import { useState } from "react";

export default function Admin() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = () => {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || password === "tupassword123") {
      setAuthenticated(true);
    } else {
      alert("Contraseña incorrecta");
    }
  };

  const handleSync = async () => {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch('/api/sync/sync', {
        method: 'POST',
      });
      const data = await response.json();
      setMessage(`✅ ${data.message} - ${data.count} productos sincronizados`);
    } catch (error) {
      setMessage("❌ Error al sincronizar");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!authenticated) {
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>
        <h1>Admin Login</h1>
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: "10px", fontSize: "16px", marginRight: "10px" }}
        />
        <button onClick={handleLogin} style={{ padding: "10px 20px", fontSize: "16px" }}>
          Entrar
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "50px", textAlign: "center" }}>
      <h1>Panel de Admin</h1>
      <button 
        onClick={handleSync} 
        disabled={loading}
        style={{ 
          padding: "15px 30px", 
          fontSize: "18px",
          backgroundColor: "#E75A7C",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: loading ? "not-allowed" : "pointer"
        }}
      >
        {loading ? "Sincronizando..." : "Sincronizar Airtable → Algolia"}
      </button>
      {message && <p style={{ marginTop: "20px", fontSize: "16px" }}>{message}</p>}
    </div>
  );
}