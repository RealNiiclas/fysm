import axios from "axios";
import Head from "next/head";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import config from "../config.json";

let socket = null;

export default function Home() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("Warte ...");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState("");

  useEffect(() => {
    axios.post(`${config.serverAddress}:${config.serverPort}/user`)
      .then((res) => setStatus(`Angemeldet als ${res.data}!`))
      .catch(() => setStatus("Nicht angemeldet!"));
  }, []);

  function run(event, type) {
    event.preventDefault();
    document.activeElement.blur();

    switch (type) {
      case "login":
        axios.post(`${config.serverAddress}:${config.serverPort}/login`, { name, password })
          .then(() => setStatus("Anmeldung erfolgreich!"))
          .catch(() => setStatus("Anmeldung fehlgeschlagen!"));
        break;
      case "logout":
        axios.post(`${config.serverAddress}:${config.serverPort}/logout`)
          .then(() => setStatus("Abmeldung erfolgreich!"))
          .catch(() => setStatus("Abmeldung fehlgeschlagen!"));
        break;
      default:
        axios.post(`${config.serverAddress}:${config.serverPort}/register`, { name, password })
          .then(() => setStatus("Registrierung erfolgreich!"))
          .catch(() => setStatus("Registrierung fehlgeschlagen!"));
        break;
    }

    setPassword("");
    setName("");
  }

  function run2(event, type) {
    event.preventDefault();
    document.activeElement.blur();

    switch (type) {
      case "connect":
        if (socket) return;
        socket = io(`${config.serverAddress}:${config.serverPort}`, { reconnection: false });
        socket.on("connect", () => setMessages((prev) => `${prev}\nVerbindung aufgebaut!`.trim()));
        socket.on("message", ({ message, from }) => setMessages((prev) => `${prev}\n${from}: ${message}`.trim()));
        socket.on("unauthed", () => setMessages((prev) => `${prev}\nNicht authentifiziert!`.trim()));
        socket.on("disconnect", () => {
          setMessages((prev) => `${prev}\nVerbindung getrennt!`.trim())
          socket = null;
        });
        break;
      case "disconnect": 
        if (!socket) return;
        socket.disconnect();
        socket = null;
        break;
      default:
        if (socket) 
          socket.emit("message", message);
        break;
    }

    setMessage("");
  }

  return (
    <div style={{ margin: ".5rem" }}>
      <Head>
        <title>Testing</title>
      </Head>
      <div>Status: {status}</div><br />
      <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} /><br />
      <input type="password" placeholder="Passwort" value={password} onChange={(e) => setPassword(e.target.value)} /><br /><br />
      <input type="button" value="Anmelden" onClick={(e) => run(e, "login")} /><br />
      <input type="button" value="Registrieren" onClick={(e) => run(e, "register")} /><br />
      <input type="button" value="Abmelden" onClick={(e) => run(e, "logout")} /><br /><br />
      <input type="text" placeholder="Nachricht" value={message} onChange={(e) => setMessage(e.target.value)} /><br />
      <textarea rows={8} cols={18} readOnly value={messages} /><br /><br />
      <input type="button" value="Senden" onClick={(e) => run2(e, "send")} /><br />
      <input type="button" value="Verbinden" onClick={(e) => run2(e, "connect")} /><br />
      <input type="button" value="Trennen" onClick={(e) => run2(e, "disconnect")} />
    </div>
  );
}
