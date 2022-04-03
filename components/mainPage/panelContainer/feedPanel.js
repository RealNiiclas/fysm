import style from "../../../styles/chatPanel.module.css";
import axios from "axios";
import { useState, useEffect } from "react";
import config from "../../../config.json";
import MessageBox from "./messageBox";
import { format } from 'date-fns';

let serverAddress = `${config.serverAddress}${config.serverIncludePort ? ":" + config.serverPort : ""}`;

export default function FeedPanel({post, deleteFeedPanel}) {

  const [posts, setPosts] = useState([]);
  const [posting, setPosting] = useState("");

  useEffect(() => {
    getPosts();
  }, []);

  function getPosts() {
    axios.post(`${serverAddress}/posts`)
      .then((data) => setPosts(data.data))
      .catch(() => setPosts([]));
  }

  function sendPost() {
    axios.post(`${serverAddress}/post`, { content: posting })
      .then((data) => getPosts())
      .catch(() => setPosts([]));
    setPosting("");
  }

  function enterPressed(e) {
    if(e.keyCode == 13) {
      sendMessage();
    }
  }

  return(
    <div className={style.chatPanel}>
      <div className={style.chatPanel__header}>
        <label className={style.chatPanel__nameLabel}>Allgemein</label>
        <div style={{ width: "100%", background: "none" }} ></div>
        <input className={style.chatPanel__closeButton} type="button" value="X" onClick={(event) => deleteFeedPanel()}/>
      </div>
      <div className={style.chatPanel__chat}>
        <ul>
          {posts.map((post) => <li key={post.id} className={style.message__listEntity}><MessageBox time={format(post.time, "dd/MM/yyyy HH:mm")} name={post.name} message={post.content} /></li>)}
        </ul>
      </div>
      <div className={style.chatPanel__bottom}>
        <input className={style.chatPanel__messageInput} type="text" onKeyDown={enterPressed} value={posting} placeholder="Nachricht" onChange={(e) => setPosting(e.target.value)}/>
        <input className={style.chatPanel__sendButton} type="submit" value="Senden" onClick={() => sendPost()}/> 
      </div>
    </div>
  );
}