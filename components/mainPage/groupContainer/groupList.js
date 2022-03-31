import GroupButton from "./groupButton.js";
import style from "../../../styles/groups.module.css";
import { useState } from "react";


export default function GroupList({ groups, addPanel, createGroup, acceptGroup }) {
  const [inputVisibility, setInputVisibility] = useState(false);
  const [groupName, setGroupName] = useState("");

  function CreateGroupPanel() {
    return(
      <div className={style.groups__addGroup} onBlur={() => setInputVisibility(false)}>
        <input key="createGroupPanelText" id={style.groups__addGroupUserName} type="text" value={groupName} placeholder="Groupname" onChange={(e) => setGroupName(e.target.value) } />
        <input key="createGroupPanelButton" id={style.groups__addGroupButton} type="button" onKeyDown={enterPressed} value="senden" onClick={() => { createGroup(groupName); setInputVisibility(false) }}/>
      </div>
    );
  }
  
  function PendingGroupList() {
    return(
      <div className={style.acceptGroup}>
        <div className={style.groups__label}c>
          <label>Ausstehende Anfragen</label>
        </div>
        <ul>
          {groups.map((group) => group.accepted == 0 ? <li key={"pending"+group.id} className={style.groups__unaccepted}><GroupButton group={group} onClick={acceptGroup}/></li> : <></>)}
        </ul>
      </div>
    );
  }

  function enterPressed(e) {
    if(e.keyCode == 13) {
      createGroup(groupName);
    }
  }

  return(
    <div className={style.groups__list}>
      <div className={style.groups__label}>
        <label>Gruppen</label>
        <input id={style.groups__addGroup} type="button" value="+" onClick={() => setInputVisibility(!inputVisibility)}/>
      </div>
      { inputVisibility ? <CreateGroupPanel groupname={groupName} setGroupName={setGroupName} toggleVisibility={setInputVisibility} createGroup={createGroup}/> : <></> }
      <ul>
        { groups.map((group) => group.accepted == 1 ? <li key={group.id} className={style.group__accepted}><GroupButton group={group} onClick={addPanel} /></li> : <></>) }
      </ul>
      { /*zur Optimierung diese Liste übergeben*/groups.filter((entry) => entry.accepted == 0).length > 0 ? <PendingGroupList groups={groups} acceptGroup={acceptGroup}/> : <></> }
    </div>
  );
}