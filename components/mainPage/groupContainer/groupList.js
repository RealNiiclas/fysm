import GroupButton from "./groupButton.js";
import style from "../../../styles/groups.module.css";
import { useState } from "react";

function CreateGroupPanel({ groupName, setGroupName, setInputVisibility, createGroup }) {
  return(
    <div className={style.groups__addGroup}>
      <input key="createGroupPanelText" id={style.groups__addGroupUserName} type="text" value={groupName} placeholder="Name" onChange={(e) => setGroupName(e.target.value)} />
      <input key="createGroupPanelButton" id={style.groups__addGroupButton} type="button" value="Senden" onClick={() => { createGroup(groupName); setGroupName(""); setInputVisibility(false); }}/>
    </div>
  );
}

export default function GroupList({ groups, addPanel, createGroup, acceptGroup }) {
  const [inputVisibility, setInputVisibility] = useState(false);
  const [groupName, setGroupName] = useState("");
  
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

  return(
    <div className={style.groups__list}>
      <div className={style.groups__label}>
        <label>Gruppen</label>
        <input id={style.groups__addGroup} type="button" value="+" onClick={() => setInputVisibility(!inputVisibility)}/>
      </div>
      { inputVisibility ? <CreateGroupPanel groupName={groupName} setGroupName={setGroupName} setInputVisibility={setInputVisibility} createGroup={createGroup}/> : <></> }
      <ul>
        { groups.map((group) => group.accepted == 1 ? <li key={group.id} className={style.group__accepted}><GroupButton group={group} onClick={addPanel} /></li> : <></>) }
      </ul>
      { /*zur Optimierung diese Liste übergeben*/groups.filter((entry) => entry.accepted == 0).length > 0 ? <PendingGroupList groups={groups} acceptGroup={acceptGroup}/> : <></> }
    </div>
  );
}