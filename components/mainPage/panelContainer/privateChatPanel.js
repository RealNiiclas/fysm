import axios from "axios";
import style from "../../../styles/chatPanel.module.css";
import { useState, useEffect, useCallback } from "react";
import config from "../../../config.json";
import MessageBox from "./messageBox";
import { format } from 'date-fns';
import io from "socket.io-client";

let serverAddress = `${config.serverAddress}${config.serverIncludePort ? ":" + config.serverPort : ""}`;
let socket = null;

export default function PrivateChatPanel({friend, deletePrivateChatPanel, sendPrivateMessageTo, removeFriend}) {
  const [privateMessages, setPrivateMessages] = useState([]);
  const [privateMessage, setPrivateMessage] = useState("");
  const [dropDownMenuVisible, toggleDropDownMenuVisibility] = useState(false);

  const fetchMessages = useCallback(() => {
    axios.post(`${serverAddress}/messages`, { nameFriend: friend.name })
    .then((data) => setPrivateMessages(data.data))
    .catch(() => console.log("Fehler beim Laden der Nachrichten"));
  }, [friend]);

  useEffect(() => {
    fetchMessages();
    socket = io(`${serverAddress}`, { reconnection: false });
    socket.on("message", (data) => {
      if (data.failed) setPrivateMessages((prev) => `${prev}\nSenden fehlgeschlagen!`.trim());
      else if (data.from) setPrivateMessages((prev) => `${prev}\nVon ${data.from}: ${data.message}`.trim())
      else setPrivateMessages((prev) => `${prev}\nAn ${data.to}: ${data.message}`.trim())
    });
  }, [friend, fetchMessages]);

  function sendMessage() {
    sendPrivateMessageTo(friend.name, privateMessage); 
    fetchMessages();
    setPrivateMessage("");
  } 

  function DropDownMenu() {
    return(
      <div className={style.chatPanel__dropDownMenu} >
        <ul>
          <li key="deleteFriend"><input type="button" value="Freund entfernen" onClick={() => { deletePrivateChatPanel(friend); removeFriend(friend); }}/></li>
        </ul>
      </div>
    );
  }

  function enterPressed(e) {
    if(e.keyCode == 13) {
      sendMessage();
    }
  }

  return(
    <div className={style.chatPanel}>
      <div className={style.chatPanel__header} >
        <label className={style.chatPanel__nameLabel}>{friend.name}</label>
        <div className={style.chatPanel__settingsDropDown} onMouseLeave={ () => toggleDropDownMenuVisibility(false) }>
          <input className={style.chatPanel__settingsButton} type="button" value="settings" onClick={ () => toggleDropDownMenuVisibility(!dropDownMenuVisible) }/>
          { dropDownMenuVisible ? <DropDownMenu/> : <></>}
        </div>
        <input className={style.chatPanel__closeButton} type="button" value="X" onClick={(event) => deletePrivateChatPanel(friend)}/>
      </div>
      <div className={style.chatPanel__chat}>
        <ul>
          {privateMessages.map((message) => <li key={message.id} className={style.message__listEntity}><MessageBox time={format(message.time, "dd/MM/yyyy HH:mm")} name={message.name} message={message.content} /></li>)}
        </ul>
      </div>
      <div className={style.chatPanel__bottom}>
        <input className={style.chatPanel__messageInput} type="text" onKeyDown={enterPressed} value={privateMessage} placeholder="Your Message" onChange={(e) => setPrivateMessage(e.target.value)}/>
        <input className={style.chatPanel__sendButton} type="submit" value="send" onClick={(event) => sendMessage()}/> 
      </div>
    </div>
  );
}