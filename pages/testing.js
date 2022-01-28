import axios from "axios";
import Head from "next/head";
import { useEffect, useState } from "react";
import config from "../config.json";

export default function Home() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("Warte ...");

  useEffect(() => {
    axios.post(`${config.serverAddress}:${config.serverPort}/user`)
      .then((res) => setStatus(`Angemeldet als ${res.data}!`))
      .catch(() => setStatus("Nicht angemeldet!"));
  }, []);

  function login(event) {
    event.preventDefault();
    document.activeElement.blur();

    axios.post(`${config.serverAddress}:${config.serverPort}/login`, { name, password })
      .then(() => setStatus("Anmeldung erfolgreich!"))
      .catch(() => setStatus("Anmeldung fehlgeschlagen!"));

    setPassword("");
    setName("");
  }

  function register(event) {
    event.preventDefault();
    document.activeElement.blur();

    axios.post(`${config.serverAddress}:${config.serverPort}/register`, { name, password })
      .then(() => setStatus("Registrierung erfolgreich!"))
      .catch(() => setStatus("Registrierung fehlgeschlagen!"));

    setPassword("");
    setName("");
  }

  function logout(event) {
    event.preventDefault();
    document.activeElement.blur();

    axios.post(`${config.serverAddress}:${config.serverPort}/logout`)
      .then(() => setStatus("Abmeldung erfolgreich!"))
      .catch(() => setStatus("Abmeldung fehlgeschlagen!"));

    setPassword("");
    setName("");
  }

  return (
    <div style={{ margin: ".5rem" }}>
      <Head>
        <title>Testing</title>
      </Head>
      <div>Status: {status}</div><br />
      <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} /><br />
      <input type="password" placeholder="Passwort" value={password} onChange={(e) => setPassword(e.target.value)} /><br /><br />
      <input type="button" value="Anmelden" onClick={login} /><br />
      <input type="submit" value="Registrieren" onClick={register} /><br />
      <input type="submit" value="Abmelden" onClick={logout} />
    </div>
  );
}
