import FriendButton from "../mainPage/friendButton.js";
import axios from "axios";
import { useEffect, useState } from "react";
import config from "../../config.json";

let serverAddress = `${config.serverAddress}${config.serverIncludePort ? ":" + config.serverPort : ""}`;

export default function FriendList({ friends }) {
  return(
    <div>
      <ul>
        {friends.map((friend) => <li key={friend.id}><FriendButton name={friend.name}/></li>)}
      </ul>
    </div>
  );
}