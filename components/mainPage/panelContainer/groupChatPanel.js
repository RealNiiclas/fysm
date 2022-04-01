import axios from "axios";
import style from "../../../styles/chatPanel.module.css";
import { useState, useEffect, useCallback } from "react";
import config from "../../../config.json";
import MessageBox from "./messageBox";
import { format } from 'date-fns';
import io from "socket.io-client";

let serverAddress = `${config.serverAddress}${config.serverIncludePort ? ":" + config.serverPort : ""}`;
let socket = null;

export default function GroupChatPanel({group, deleteGroupChatPanel, sendMessageToGroup, leaveGroup, inviteUser}) {
  const [groupMessages, setGroupMessages] = useState([]);
  const [groupMessage, setGroupMessage] = useState("");
  const [dropDownMenuVisible, toggleDropDownMenuVisibility] = useState(false);
  const [inputPanelVisibility, setInputPanelVisibility] = useState(false);

  const fetchGroupMessages = useCallback(() => {
    axios.post(`${serverAddress}/groupMessages`, { group: group.id })
      .then((data) => setGroupMessages(data.data))
      .catch(() => console.log("Laden der Gruppennachrichten fehlgeschlagen"));
  }, [group]);

  useEffect(() => {
    fetchGroupMessages();
    socket = io(`${serverAddress}`, { reconnection: false });
    socket.on("message", (data) => {
      if (data.failed) setPrivateMessages((prev) => `${prev}\nSenden fehlgeschlagen!`.trim());
      else if (data.from) setPrivateMessages((prev) => `${prev}\nVon ${data.from}: ${data.message}`.trim())
      else setPrivateMessages((prev) => `${prev}\nAn ${data.to}: ${data.message}`.trim())
    });
  }, [group, fetchGroupMessages]);

  function sendMessage() {
    sendMessageToGroup(group.id, groupMessage); 
    fetchGroupMessages();
    setGroupMessage("");
  }

  function enterPressed(e) {
    if(e.keyCode == 13) {
      sendMessage();
    }
  }

  //TODO muss noch getestet werden
  function DropDownMenu() {
    return(
      <div className={style.chatPanel__dropDownMenu} >
        <ul>
          <li key="leaveGroup"><input type="button" value="Gruppe verlassen" onClick={() => { deleteGroupChatPanel(group); leaveGroup(group); }}/></li>
        </ul>
      </div>
    );
  }

  function InviteUserPanel() {
    return(
      <div className={style.chatPanel__inviteButton} onBlur={() => setInputPanelVisibility(false)}>
        <input className={style.chatPanel__inviteButton} type="button" value="+" onClick={ () => setInputPanelVisibility(!inputPanelVisibility)}/>
        {inputPanelVisibility ? <InviteUserPanelInput /> : <></>}
      </div>
    );
  }
  
  function InviteUserPanelInput({group, userName, setUserName, toggleVisibility, inviteUser}) {
    return(
      <div className={style.groups__addGroup} onBlur={() => setInputPanelVisibility(false)}>
        <form>
          <input id={style.groups__addgroupUserName} type="text" value={userName} placeholder="UserName" onChange={(e) => setUserName(e.target.value) } />
          <input id={style.groups__addGroupButton} type="submit" value="senden" onClick={() => { inviteUser(userName, group); setInputPanelVisibility(false); }}/>
        </form>
      </div>
    );
  }

  return(
    <div className={style.chatPanel}>
      <div className={style.chatPanel__header} onMouseLeave={() => toggleDropDownMenuVisibility(false)}>
        <label className={style.chatPanel__nameLabel}>{group.name}</label>
        
        <div className={style.chatPanel__furtherSettings} onMouseLeave={ () => toggleDropDownMenuVisibility(false) }>
          {group.admin == 1 ? <InviteUserPanel className={style.chatPanel__inviteInput} /> : <></>}
          <input className={style.chatPanel__settingsButton} type="button" value="opt" onClick={ () => toggleDropDownMenuVisibility(!dropDownMenuVisible) } />
          { dropDownMenuVisible ? <DropDownMenu/> : <></>}
        </div>
        <input className={style.chatPanel__closeButton} type="button" value="X" onClick={(event) => deleteGroupChatPanel(group)}/>
      </div>
      <div className={style.chatPanel__chat}>
        <ul>
          {groupMessages.map((message) => <li key={message.id} className={style.message__listEntity}><MessageBox time={format(message.time, "dd/MM/yyyy HH:mm")} name={message.name} message={message.content} /></li>)}
        </ul>
      </div>
      <div className={style.chatPanel__bottom}>
        <input className={style.chatPanel__messageInput} type="text" onKeyDown={enterPressed} value={groupMessage} placeholder="Your Message" onChange={(e) => setGroupMessage(e.target.value)}/>
        <input className={style.chatPanel__sendButton} type="submit" value="send" onClick={(event) => sendMessage()}/> 
      </div>
    </div>
  );
}