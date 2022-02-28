import FriendList from "../components/mainPage/friendList.js";
import axios from "axios";
import { useState } from "react";
import config from "../config.json";

let serverAddress = `${config.serverAddress}${config.serverIncludePort ? ":" + config.serverPort : ""}`;

export default function Home() {
  const [friendName, setFriendName] = useState("");
  const [friends, setFriends] = useState([]);

  function runOnClick(event) {
    event.preventDefault();
    document.activeElement.blur();
  }

  function addFriend(event) {
    runOnClick(event);
    axios.post(`${serverAddress}/addFriend`, { friendName })
      .then(() => {
        console.log("add erfolgreich");
        axios.post(`${serverAddress}/friends`)
          .then((data) => setFriends(data.data))
          .catch((err) => { console.log(err); });
      })
      .catch(() => console.log("add unerfolgreich"));
    setFriendName("");
  }

  function removeFriend(event) {
    runOnClick(event);
    axios.post(`${serverAddress}/removeFriend`, { friendName })
      .then(() => console.log("remove erfolgreich"))
      .catch(() => console.log("remove unerfolgreich"));
    setFriendName("");
    axios.post(`${serverAddress}/friends`)
      .then((data) => setFriends(data.data))
      .catch((err) => { console.log(err); });
  }

  function acceptFriend(event) {
    runOnClick(event);
    axios.post(`${serverAddress}/acceptFriend`, { friendName })
      .then(() => console.log("accept erfolgreich"))
      .catch(() => console.log("accept unerfolgreich"));
    setFriendName("");
  }

  return (
    <div>
      <nav>
        <input type="text" placeholder="Name" value={friendName} onChange={(e) => setFriendName(e.target.value)} /><br /><br />
        <input type="button" value="Freund hinzufügen" onClick={(event) => addFriend(event)} /><br />
        <input type="button" value="Freund entfernen" onClick={(event) => removeFriend(event)} /><br />
        <input type="button" value="Freund akzeptieren" onClick={(event) => acceptFriend(event)} /><br />
      </nav>
      <FriendList friends={friends} />
    </div>
  );
}
