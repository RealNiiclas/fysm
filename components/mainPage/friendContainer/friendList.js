import FriendButton from "./friendButton.js";
import style from "../../../styles/friends.module.css";
import { useState } from "react";

function AddFriendPanel({ friendName, setFriendName, setInputVisibility, addFriend }) {
  return(
    <div className={style.friends__addFriend}>
      <input id={style.friends__addFriendUserName} type="text" value={friendName} placeholder="Name" onChange={(e) => setFriendName(e.target.value)} />
      <input id={style.friends__addFriendButton} type="submit" value="Senden" onClick={() => { addFriend(friendName); setFriendName(""); setInputVisibility(false); }}/>
    </div>
  );
}

export default function FriendList({ friends, addPanel, addFriend, acceptFriend }) {
  const [inputVisibility, setInputVisibility] = useState(false);
  const [friendName, setFriendName] = useState("");

  function PendingFriendsList() {
    return(
      <div className={style.friends__pendingFriends}>
        <div className={style.friends__label}>
          <label>Ausstehende Anfragen</label>
        </div>
        <ul>
          {friends.map((friend) => friend.accepted == 0 && friend.receiver == 1 ? <li key={friend.name} className={style.friends__unaccepted}><FriendButton friend={friend} onClick={acceptFriend(friend)}  /></li> : <></>)}
        </ul>
      </div>
    );
  }

  return(
    <div className={style.friends__list}>
      <div className={style.friends__label}>
        <label>Freunde</label>
        <input id={style.friends__addFriend} type="button" value="+" onClick={() => setInputVisibility(!inputVisibility)}/>
      </div>
      { inputVisibility ? <AddFriendPanel friendName={friendName} setFriendName={setFriendName} setInputVisibility={setInputVisibility} addFriend={addFriend} /> : <></> }
      <ul>
        {friends.map((friend) => friend.accepted == 1 ? <li key={friend.name} className={style.friends__accepted}><FriendButton friend={friend} onClick={addPanel} /></li> : <></>)}
      </ul>
      { /*zur Optimierung diese Liste übergeben*/friends.filter((entry) => entry.accepted == 0 && entry.receiver == 1).length > 0 ? <PendingFriendsList friends={friends} acceptFriend={acceptFriend}/> : <></> }
    </div>
  );
}