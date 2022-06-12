import { useState } from "react";
import style from "../styles/group.module.css";

export default function Group({ id, name, content, group, sendMultiple, closeMultiple, leaveMultiple, invite, accept }) {
  const [text, setText] = useState("");
  const [userName, setUserName] = useState("");

  function send() {
    if (text.length < 1) return;
    sendMultiple(id, text);
    setText("");
  }

  return <div className={style.group}>
    <div className={style.group_header}>
      <div className={style.group_name}>{name}</div>
      <div className={style.group_actions}>
        {group && !!group.admin && <input type="text" className={style.group_actionInput} placeholder="Nutzer hinzufügen ..." value={userName} onChange={(e) => setUserName(e.target.value)} />}
        {group && !!group.admin && <input type="button" className={style.group_action} value="Einladen" onClick={() => invite(id, userName)} />}
        {group && !group.accepted && <input type="button" className={style.group_action} value="Annehmen" onClick={accept} />}
        <input type="button" className={style.group_action} value="Verlassen" onClick={leaveMultiple} />
        <input type="button" className={style.group_action} value="X" onClick={closeMultiple} />
      </div>
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