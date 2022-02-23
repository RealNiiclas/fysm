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
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [friendName, setFriendName] = useState("");
  const [friends, setFriends] = useState([]);
  const [username, setUsername] = useState("");
  const [groupname, setGroupname] = useState("");
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    axios.post(`${serverAddress}/user`)
      .then((res) => setStatus(`Angemeldet als ${res.data}!`))
      .catch(() => setStatus("Nicht angemeldet!"));
  }, []);

  function runOnClick(event) {
    event.preventDefault();
    document.activeElement.blur();
  }

  function login(event) {
    runOnClick(event);
    axios.post(`${serverAddress}/login`, { name, password })
      .then(() => setStatus("Anmeldung erfolgreich!"))
      .catch(() => setStatus("Anmeldung fehlgeschlagen!"));
    setPassword("");
    setName("");
  }

  function logout(event) {
    runOnClick(event);
    axios.post(`${serverAddress}/logout`)
      .then(() => setStatus("Abmeldung erfolgreich!"))
      .catch(() => setStatus("Abmeldung fehlgeschlagen!"));
  }

  function remove(event) {
    runOnClick(event);
    axios.post(`${serverAddress}/delete`, { password })
      .then(() => setStatus("Löschung erfolgreich!"))
      .catch(() => setStatus("Löschung fehlgeschlagen!"));
    setPassword("");
  }

  function register(event) {
    runOnClick(event);
    axios.post(`${serverAddress}/register`, { name, password })
      .then(() => setStatus("Registrierung erfolgreich!"))
      .catch(() => setStatus("Registrierung fehlgeschlagen!"));
    setPassword("");
    setName("");
  }

  function connectChat(event) {
    runOnClick(event);
    if (socket) return;
    socket = io(`${serverAddress}`, { reconnection: false });
    socket.on("connect", () => setMessages((prev) => `${prev}\nVerbindung aufgebaut!`.trim()));
    socket.on("unauthed", () => setMessages((prev) => `${prev}\nNicht authentifiziert!`.trim()));
    socket.on("message", (data) => {
      if (data.failed) setMessages((prev) => `${prev}\nSenden fehlgeschlagen!`.trim());
      else if (data.from) setMessages((prev) => `${prev}\nVon ${data.from}: ${data.message}`.trim())
      else setMessages((prev) => `${prev}\nAn ${data.to}: ${data.message}`.trim())
    });
    socket.on("disconnect", () => {
      setMessages((prev) => `${prev}\nVerbindung getrennt!`.trim())
      socket = null;
    });
  }

  function disconnectChat(event) {
    runOnClick(event);
    if (!socket) return;
    socket.disconnect();
    socket = null;
  }

  function sendMessageTo(event) {
    runOnClick(event);
    if (!socket) return;
    socket.emit("messageTo", message, target);
    setMessage("");
  }

  function post(event) {
    runOnClick(event);
    axios.post(`${serverAddress}/post`, { content })
      .then(() => setStatus("Posten erfolgreich!"))
      .catch(() => setStatus("Posten fehlgeschlagen!"));
    setContent("");
  }

  function getPosts(event) {
    runOnClick(event);
    axios.post(`${serverAddress}/posts`)
      .then((data) => setPosts(data.data)).catch(() => { });
  }

  function addFriend(event) {
    runOnClick(event);
    axios.post(`${serverAddress}/addFriend`, { friendName })
      .then(() => setStatus("Freundschaftsanfrage erfolgreich!"))
      .catch(() => setStatus("Freundschaftsanfrage fehlgeschlagen!"));
    setFriendName("");
  }

  function removeFriend(event) {
    runOnClick(event);
    axios.post(`${serverAddress}/removeFriend`, { friendName })
      .then(() => setStatus("Entfernung erfolgreich!"))
      .catch(() => setStatus("Entfernung fehlgeschlagen!"));
    setFriendName("");
  }

  function acceptFriend(event) {
    runOnClick(event);
    axios.post(`${serverAddress}/acceptFriend`, { friendName })
      .then(() => setStatus("Akzeptierung erfolgreich!"))
      .catch(() => setStatus("Akzeptierung fehlgeschlagen!"));
    setFriendName("");
  }

  function fetchFriends(event) {
    runOnClick(event);
    axios.post(`${serverAddress}/friends`)
      .then((data) => setFriends(data.data)).catch((err) => { console.log(err); });
  }

  function createGroup(event) {
    runOnClick(event);
    axios.post(`${serverAddress}/createGroup`, { groupname })
      .then(() => setStatus("Erstellung erfolgreich!"))
      .catch(() => setStatus("Erstellung fehlgeschlagen!"));
    setGroupname("");
  }
  
  function fetchGroups(event) {
    runOnClick(event);
    axios.post(`${serverAddress}/groups`)
      .then((data) => setGroups(data.data)).catch((err) => { console.log(err); });
  }

  function inviteUser(event) {
    runOnClick(event);
    axios.post(`${serverAddress}/inviteGroup`, { username, groupname })
      .then(() => setStatus("Einladung erfolgreich!"))
      .catch(() => setStatus("Einladung fehlgeschlagen!"));
    setGroupname("");
    setUsername("");
  }

  function leaveGroup(event) {
    runOnClick(event);
    axios.post(`${serverAddress}/leaveGroup`, { groupname })
      .then(() => setStatus("Verlassen erfolgreich!"))
      .catch(() => setStatus("Verlassen fehlgeschlagen!"));
    setGroupname("");
  }

  function acceptGroup(event) {
    runOnClick(event);
    axios.post(`${serverAddress}/acceptInvite`, { groupname })
      .then(() => setStatus("Akzeptieren erfolgreich!"))
      .catch(() => setStatus("Akzeptieren fehlgeschlagen!"));
    setGroupname("");
  }

  return (
    <div style={{ margin: ".5rem" }}>
      <Head>
        <title>Testing</title>
      </Head>
      <div>Status: {status}</div><br />
      <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} /><br />
      <input type="password" placeholder="Passwort" value={password} onChange={(e) => setPassword(e.target.value)} /><br /><br />

      <input type="button" value="Anmelden" onClick={(event) => login(event)} />
      <input type="button" value="Abmelden" onClick={(event) => logout(event)} /><br />
      <input type="button" value="Registrieren" onClick={(event) => register(event)} />
      <input type="button" value="Löschen" onClick={(event) => remove(event)} /><br /><br />

      <input type="text" placeholder="Nachricht" value={message} onChange={(e) => setMessage(e.target.value)} /><br />
      <input type="text" placeholder="Empfänger" value={target} onChange={(e) => setTarget(e.target.value)} /><br />
      <textarea rows={8} cols={18} readOnly value={messages} /><br /><br />

      <input type="button" value="Verbinden" onClick={(event) => connectChat(event)} />
      <input type="button" value="Trennen" onClick={(event) => disconnectChat(event)} /><br />
      <input type="button" value="Nachricht senden" onClick={(event) => sendMessageTo(event)} /><br /><br />

      <textarea placeholder="Inhalt" rows={8} cols={18} value={content} onChange={(e) => setContent(e.target.value)} /><br /><br />
      <input type="button" value="Posten" onClick={(event) => post(event)} />
      <input type="button" value="Laden" onClick={(event) => getPosts(event)} /><br /><br />

      <ul>
        {posts.map((post) => <li key={post.id}>{post.author}: {post.content}</li>)}
      </ul>{posts.length > 0 && <br />}

      <input type="text" placeholder="Name" value={friendName} onChange={(e) => setFriendName(e.target.value)} /><br /><br />
      <input type="button" value="Freund hinzufügen" onClick={(event) => addFriend(event)} /><br />
      <input type="button" value="Freund entfernen" onClick={(event) => removeFriend(event)} /><br />
      <input type="button" value="Freund akzeptieren" onClick={(event) => acceptFriend(event)} /><br />
      <input type="button" value="Freunde laden" onClick={(event) => fetchFriends(event)} /><br /><br />

      <ul>
        {friends.map((friend) => <li key={friend.id}>{friend.name} ({friend.accepted})</li>)}
      </ul>

      <input type="text" placeholder="Gruppenname" value={groupname} onChange={(e) => setGroupname(e.target.value)} /><br />
      <input type="text" placeholder="Nutzername" value={username} onChange={(e) => setUsername(e.target.value)} /><br /><br />
      <input type="button" value="Einladung akzeptieren" onClick={(event) => acceptGroup(event)} /><br />
      <input type="button" value="Einladung senden" onClick={(event) => inviteUser(event)} /><br />
      <input type="button" value="Gruppe erstellen" onClick={(event) => createGroup(event)} /><br />
      <input type="button" value="Gruppe verlassen" onClick={(event) => leaveGroup(event)} /><br />
      <input type="button" value="Gruppen laden" onClick={(event) => fetchGroups(event)} /><br /><br />

      <ul>
        {groups.map((group) => <li key={group.groupname}>{group.groupname} ({group.accepted}/{group.admin})</li>)}
      </ul>
    </div>
  );
}

export const getServerSideProps = () => {
  if (!config.debug) return { notFound: true };
  return { props: {} };
};
