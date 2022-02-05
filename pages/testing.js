import axios from "axios";
import Head from "next/head";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import config from "../config.json";

let socket = null;
let serverAddress = `${config.serverAddress}${config.serverIncludePort ? ":" + config.serverPort : ""}`;

export default function Home() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("Warte ...");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState("");
  const [target, setTarget] = useState("");

  useEffect(() => {
    axios.post(`${serverAddress}/user`)
      .then((res) => setStatus(`Angemeldet als ${res.data}!`))
      .catch(() => setStatus("Nicht angemeldet!"));
  }, []);

  function run(event, type) {
    event.preventDefault();
    document.activeElement.blur();

    switch (type) {
      case "login":
        axios.post(`${serverAddress}/login`, { name, password })
          .then(() => setStatus("Anmeldung erfolgreich!"))
          .catch(() => setStatus("Anmeldung fehlgeschlagen!"));
        break;
      case "delete":
        axios.post(`${serverAddress}/delete`, { password })
          .then(() => setStatus("Löschung erfolgreich!"))
          .catch(() => setStatus("Löschung fehlgeschlagen!"));
        break;
      case "logout":
        axios.post(`${serverAddress}/logout`)
          .then(() => setStatus("Abmeldung erfolgreich!"))
          .catch(() => setStatus("Abmeldung fehlgeschlagen!"));
        break;
      default:
        axios.post(`${serverAddress}/register`, { name, password })
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
        socket = io(`${serverAddress}`, { reconnection: false });
        socket.on("connect", () => setMessages((prev) => `${prev}\nVerbindung aufgebaut!`.trim()));
        socket.on("unauthed", () => setMessages((prev) => `${prev}\nNicht authentifiziert!`.trim()));
        socket.on("message", (data) => {
          if (data.direct && data.from) setMessages((prev) => `${prev}\nVon ${data.from}: ${data.message}`.trim())
          else if (data.direct) setMessages((prev) => `${prev}\nAn ${data.to}: ${data.message}`.trim())
          else setMessages((prev) => `${prev}\n${data.from}: ${data.message}`.trim())
        });
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
      case "send":
        if (socket) 
          socket.emit("message", message);
        break;
      case "sendTo":
        if (socket) 
          socket.emit("messageTo", message, target);
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
      <input type="button" value="Löschen" onClick={(e) => run(e, "delete")} /><br />
      <input type="button" value="Abmelden" onClick={(e) => run(e, "logout")} /><br /><br />
      <input type="text" placeholder="Nachricht" value={message} onChange={(e) => setMessage(e.target.value)} /><br />
      <input type="text" placeholder="Empfänger" value={target} onChange={(e) => setTarget(e.target.value)} /><br />
      <textarea rows={8} cols={18} readOnly value={messages} /><br /><br />
      <input type="button" value="Nachricht senden" onClick={(e) => run2(e, "send")} /><br />
      <input type="button" value="Direkte Nachricht senden" onClick={(e) => run2(e, "sendTo")} /><br />
      <input type="button" value="Verbinden" onClick={(e) => run2(e, "connect")} /><br />
      <input type="button" value="Trennen" onClick={(e) => run2(e, "disconnect")} />
    </div>
  );
}
