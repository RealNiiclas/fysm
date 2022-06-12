import { useState } from "react";
import style from "../styles/direct.module.css";

export default function Direct({ name, content, friend, closeDirect, sendDirect, acceptDirect, removeDirect }) {
  const [text, setText] = useState("");

  function send() {
    if (text.length < 1) return;
    sendDirect(name, text);
    setText("");
  }

  return <div className={style.direct}>
    <div className={style.direct_header}>
      <div className={style.direct_name}>{name}</div>
      <div className={style.direct_actions}>
        <input type="button" className={style.direct_action} value="Entfernen" onClick={removeDirect} />
        {friend && !friend.accepted && !!friend.receiver && <input type="button" className={style.direct_action} value="Annehmen" onClick={acceptDirect} />}
        <input type="button" className={style.direct_action} value="X" onClick={closeDirect} />
      </div>
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