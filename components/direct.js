import { useState } from "react";
import style from "../styles/direct.module.css";

export default function Direct({ name, content, closeDirect, sendDirect }) {
  const [text, setText] = useState("");

  function send() {
    if (text.length < 1) return;
    sendDirect(name, text);
    setText("");
  }

  return <div className={style.direct}>
    <div className={style.direct_header}>
      <div className={style.direct_name}>{name}</div>
      <input type="button" className={style.direct_close} value="x" onClick={closeDirect} />
    </div>
    <div className={style.direct_list}>
      {content.map(({ id, content, name }) => <div key={id} className={style.direct_message}>{name}: {content}</div>)}
    </div>
    <div className={style.direct_input}>
      <input type="text" className={style.direct_inputText} spellCheck={false} placeholder="Nachricht" value={text} onChange={(e) => setText(e.target.value)} />
      <input type="button" className={style.direct_send} value="Senden" onClick={send} />
    </div>
  </div>;
}