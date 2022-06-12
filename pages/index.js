import axios from "axios";
import Head from "next/head";
import io from "socket.io-client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import style from "../styles/main.module.css";
import Direct from "../components/direct";
import Group from "../components/group";
import Feed from "../components/feed";
import config from "../config.json";

let serverAddress = `${config.serverAddress}${config.serverIncludePort ? ":" + config.serverPort : ""}`;
let socket = null;

export default function Home() {
  const router = useRouter();

  const [addFriendToggle, setAddFriendToggle] = useState(false);
  const [addGroupToggle, setAddGroupToggle] = useState(false);
  const [friendName, setFriendName] = useState("");
  const [groupName, setGroupName] = useState("");

  const [name, setName] = useState("");
  const [friends, setFriends] = useState([]);
  const [groups, setGroups] = useState([]);

  const [feeds, setFeeds] = useState({});
  const [directs, setDirects] = useState({});
  const [multiples, setMultiples] = useState({});

  useEffect(() => {
    axios.post(`${serverAddress}/user`)
      .then((res) => setName(res.data))
      .catch(() => router.push("/"));

    axios.post(`${serverAddress}/friends`)
      .then((data) => setFriends(data.data))
      .catch(() => { });

    axios.post(`${serverAddress}/groups`)
      .then((data) => setGroups(data.data))
      .catch(() => { });

    socket = io(`${serverAddress}`, { reconnection: false });
    socket.on("connect", () => { });
    socket.on("unauthed", () => { });
    socket.on("disconnect", () => { socket = null; });
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on("message", (data) => {
      if (data.failed) return;
      else if (data.from) {
        if (!directs[data.from]) return;
        loadDirect(data.from);
      }
      else {
        if (!directs[data.to]) return;
        loadDirect(data.to);
      }
    });

    return () => {
      if (!socket) return;
      socket.off("message");
    };
  }, [loadDirect]);

  useEffect(() => {
    if (!socket) return;
    socket.on("groupMessage", (data) => {
      if (data.failed) return;
      else {
        if (!multiples[data.id]) return;
        loadMultiple(data.id, multiples[data.id].name);
      }
    });

    return () => {
      if (!socket) return;
      socket.off("groupMessage");
    };
  }, [loadMultiple]);

  function addFriend() {
    axios.post(`${serverAddress}/addFriend`, { friend: friendName })
      .then(() => {
        axios.post(`${serverAddress}/friends`)
          .then((data) => {
            setFriends(data.data);
            setAddFriendToggle(false);
            setFriendName("");
          })
          .catch(() => { });
      })
      .catch(() => { });
  }

  function acceptFriend(name) {
    axios.post(`${serverAddress}/acceptFriend`, { friend: name })
      .then(() => {
        axios.post(`${serverAddress}/friends`)
          .then((data) => setFriends(data.data))
          .catch(() => { });
      })
      .catch(() => { });
  }

  function removeFriend(name) {
    axios.post(`${serverAddress}/removeFriend`, { friend: name })
      .then(() => {
        axios.post(`${serverAddress}/friends`)
          .then((data) => {
            setFriends(data.data);
            closeDirect(name);
          })
          .catch(() => { });
      })
      .catch(() => { });
  }

  function createGroup() {
    axios.post(`${serverAddress}/createGroup`, { group: groupName })
      .then(() => {
        axios.post(`${serverAddress}/groups`)
          .then((data) => {
            setGroups(data.data);
            setAddGroupToggle(false);
            setGroupName("");
          })
          .catch(() => { });
      })
      .catch(() => { });
  }

  function inviteGroup(id, name) {
    axios.post(`${serverAddress}/inviteGroup`, { user: name, group: id })
      .then(() => { })
      .catch(() => { });
  }

  function acceptGroup(id) {
    axios.post(`${serverAddress}/acceptInvite`, { group: id })
      .then(() => {
        axios.post(`${serverAddress}/groups`)
          .then((data) => setGroups(data.data))
          .catch((err) => { });
      })
      .catch(() => { });
  }

  function leaveGroup(id) {
    axios.post(`${serverAddress}/leaveGroup`, { group: id })
      .then(() => {
        axios.post(`${serverAddress}/groups`)
          .then((data) => {
            setGroups(data.data);
            closeMultiple(id);
          })
          .catch(() => { });
      })
      .catch(() => { });
  }

  function logout() {
    axios.post(`${serverAddress}/logout`)
      .then(() => router.push("/login"))
      .catch(() => { });
  }

  function loadMultiple(id, name) {
    axios.post(`${serverAddress}/groupMessages`, { group: id })
      .then((data) => setMultiples((prev) => {
        const next = { ...prev };
        next[id] = { name, data: data.data };
        return next;
      }))
      .catch(() => { });
  }

  function openMultiple(id, name) {
    if (multiples[id]) return;
    loadMultiple(id, name);
  }

  function sendMultiple(id, message) {
    if (!socket) return;
    socket.emit("messageToGroup", message, id);
  }

  function closeMultiple(id) {
    setMultiples((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  function loadDirect(name) {
    axios.post(`${serverAddress}/messages`, { nameFriend: name })
      .then((data) => setDirects((prev) => {
        const next = { ...prev };
        next[name] = data.data;
        return next;
      }))
      .catch(() => { });
  }

  function openDirect(name) {
    if (directs[name]) return;
    loadDirect(name);
  }

  function sendDirect(name, message) {
    if (!socket) return;
    socket.emit("messageTo", message, name);
  }

  function closeDirect(name) {
    setDirects((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }

  function loadFeed(title) {
    axios.post(`${serverAddress}/posts`)
      .then((data) => setFeeds((prev) => {
        const next = { ...prev };
        next[title] = data.data;
        return next;
      }))
      .catch(() => { });
  }

  function openFeed(title) {
    if (feeds[title]) return;
    loadFeed(title);
  }

  function sendPost(title, message) {
    axios.post(`${serverAddress}/post`, { content: message })
      .then(() => loadFeed(title))
      .catch(() => setPosts([]));
  }

  function closeFeed(title) {
    setFeeds((prev) => {
      const next = { ...prev };
      delete next[title];
      return next;
    });
  }

  return (
    <div>
      <Head>
        <title>FYSM - Hauptseite</title>
      </Head>
      <div className={style.container}>
        <div className={style.navigation}>
          <div className={style.navigation_name}>{name}</div>
          <input type="button" value="Abmelden" className={style.navigation_logout} onClick={logout} />
        </div>
        <div className={style.body}>
          <div className={style.sidebar}>
            <div className={style.sidebar_header}>
              <div className={style.sidebar_title}>Freunde</div>
              <input type="button" className={style.sidebar_action} value="+" onClick={() => setAddFriendToggle((prev) => !prev)} />
            </div>
            {addFriendToggle && <div className={style.sidebar_input}>
              <input className={style.sidebar_inputText} type="text" spellCheck={false} placeholder="Freund hinzufügen ..." value={friendName} onChange={(e) => setFriendName(e.target.value)} />
              <input className={style.sidebar_inputConfirm} type="button" spellCheck={false} value="+" onClick={addFriend} />
            </div>}
            {friends.length > 0 && <div className={style.list}>
              {friends.map(({ name }) => <div key={name} className={style.list_item} onClick={() => openDirect(name)}>{name}</div>)}
            </div>}
            <div className={style.sidebar_header}>
              <div className={style.sidebar_title}>Gruppen</div>
              <input type="button" className={style.sidebar_action} value="+" onClick={() => setAddGroupToggle((prev) => !prev)} />
            </div>
            {addGroupToggle && <div className={style.sidebar_input}>
              <input className={style.sidebar_inputText} type="text" spellCheck={false} placeholder="Gruppe hinzufügen ..." value={groupName} onChange={(e) => setGroupName(e.target.value)} />
              <input className={style.sidebar_inputConfirm} type="button" spellCheck={false} value="+" onClick={createGroup} />
            </div>}
            {groups.length > 0 && <div className={style.list}>
              {groups.map(({ name, id }) => <div key={name} className={style.list_item} onClick={() => openMultiple(id, name)}>{name}</div>)}
            </div>}
            <div className={style.sidebar_header}>
              <div className={style.sidebar_title}>Feeds</div>
            </div>
            <div className={style.list}>
              <div className={style.list_item} onClick={() => openFeed("Allgemein")}>Allgemein</div>
            </div>
          </div>
          <div className={style.content}>
            {Object.keys(directs).map((key) => <Direct key={key} name={key} content={directs[key]} friend={friends.find(({ name }) => name == key)} 
              closeDirect={() => closeDirect(key)} sendDirect={sendDirect} acceptDirect={() => acceptFriend(key)} removeDirect={() => removeFriend(key)} />)}
            {Object.keys(multiples).map((key) => <Group key={key} id={key} name={multiples[key].name} content={multiples[key].data} accept={() => acceptGroup(key)}
              closeMultiple={() => closeMultiple(key)} sendMultiple={sendMultiple} leaveMultiple={() => leaveGroup(key)} invite={inviteGroup} group={groups.find(({ id }) => id == key)} />)}
            {Object.keys(feeds).map((key) => <Feed key={key} title={key} content={feeds[key]} closeFeed={() => closeFeed(key)} sendPost={sendPost} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps = (context) => {
  if (!context.req.session.name) return { redirect: { destination: "/login", permanent: false } };
  return { props: {} };
};