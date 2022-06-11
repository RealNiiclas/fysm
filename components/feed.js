import { useState } from "react";
import style from "../styles/feed.module.css";

export default function Feed({ title, content, closeFeed, sendPost }) {
  const [text, setText] = useState("");

  function post() {
    if (text.length < 1) return;
    sendPost(title, text);
    setText("");
  }

  return <div className={style.feed}>
    <div className={style.feed_header}>
      <div className={style.feed_name}>{title}</div>
      <input type="button" className={style.feed_close} value="x" onClick={closeFeed} />
    </div>
    <div className={style.feed_list}>
      {content.map(({ id, name, content }) => <div key={id} className={style.feed_message}>{name}: {content}</div>)}
    </div>
    <div className={style.feed_input}>
      <input type="text" className={style.feed_inputText} spellCheck={false} placeholder="Nachricht" value={text} onChange={(e) => setText(e.target.value)} />
      <input type="button" className={style.feed_send} value="Senden" onClick={post} />
    </div>
  </div>;
}