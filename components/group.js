import { useState } from "react";
import style from "../styles/group.module.css";

export default function Group({ id, name, content, sendMultiple, closeMultiple }) {
  const [text, setText] = useState("");

  function send() {
    if (text.length < 1) return;
    sendMultiple(id, text);
    setText("");
  }

  return <div className={style.group}>
    <div className={style.group_header}>
      <div className={style.group_name}>{name}</div>
      <input type="button" className={style.group_close} value="x" onClick={closeMultiple} />
    </div>
    <div className={style.group_list}>
      {content.map(({ id, name, content }) => <div key={id} className={style.group_message}>{name}: {content}</div>)}
    </div>
    <div className={style.group_input}>
      <input type="text" className={style.group_inputText} spellCheck={false} placeholder="Nachricht" value={text} onChange={(e) => setText(e.target.value)} />
      <input type="button" className={style.group_send} value="Senden" onClick={send} />
    </div>
  </div>;
}