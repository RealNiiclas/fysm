import FriendList from "../components/mainPage/friendContainer/friendList.js";
import GroupList from "../components/mainPage/groupContainer/groupList.js";
import NavigationBar from "../components/mainPage/navigationBar.js";
import PanelContainerList from "../components/mainPage/panelContainer/panelContainerList.js";
import axios from "axios";
import { useEffect, useState } from "react";
import config from "../config.json";
import io from "socket.io-client";
import style from "../styles/mainPage.module.css";
import Head from "next/head";

let serverAddress = `${config.serverAddress}${config.serverIncludePort ? ":" + config.serverPort : ""}`;
let socket = null;

export default function Home() {
  const [privateChatPanelList, setPrivateChatPanelList] = useState([]);
  const [groupChatPanelList, setGroupChatPanelList] = useState([]);
  const [feedPanelVisible, setFeedPanelVisibility] = useState(false);
  const [friends, setFriends] = useState([]); 
  const [groups, setGroups] = useState([]);


  useEffect(() => {
    //fetch friends
    axios.post(`${serverAddress}/friends`)
    .then((data) => setFriends(data.data)).catch((err) => { console.log(err); });

    
    //fetch groups
    axios.post(`${serverAddress}/groups`)
      .then((data) => setGroups(data.data)).catch((err) => { console.log(err); });

    //set up connection
    socket = io(`${serverAddress}`, { reconnection: false });
    //connectChat();
  }, []);

  //CONNECT
  /*function connectChat () {
    if (socket) return;
    socket = io(`${serverAddress}`, { reconnection: false });
    socket.on("connect", () => setMessages((prev) => `${prev}\nVerbindung aufgebaut!`.trim()));
    socket.on("unauthed", () => setMessages((prev) => `${prev}\nNicht authentifiziert!`.trim()));
    socket.on("message", (data) => {
      if (data.failed) setMessages((prev) => `${prev}\nSenden fehlgeschlagen!`.trim());
      else if (data.from) setMessages((prev) => `${prev}\nVon ${data.from}: ${data.message}`.trim())
      else setMessages((prev) => `${prev}\nAn ${data.to}: ${data.message}`.trim())
    })
    socket.on("groupMessage", (data) => {
      if (data.failed) setMessages((prev) => `${prev}\nSenden fehlgeschlagen!`.trim());
      else setMessages((prev) => `${prev}\n${data.from}: ${data.message}`.trim());
    });
    socket.on("disconnect", () => {
      setMessages((prev) => `${prev}\nVerbindung getrennt!`.trim())
      socket = null;
    });
  }*/
  //FRIENDS
  function sendPrivateMessageTo(friendName, message) {
    if (!socket) return;
    socket.emit("messageTo", message, friendName);
  }

  function addFriend(userName) {
    axios.post(`${serverAddress}/addFriend`, { friend: userName })
      .then(() => {
        console.log("add erfolgreich");
        axios.post(`${serverAddress}/friends`)
          .then((data) => setFriends(data.data))
          .catch((err) => { console.log(err); });
      })
      .catch(() => console.log("add unerfolgreich"));
  }

  function acceptFriend(friend) {
    axios.post(`${serverAddress}/acceptFriend`, { friend: friend.name })
      .then(() => {
        console.log("accept erfolgreich");
        axios.post(`${serverAddress}/friends`)
          .then((data) => setFriends(data.data))
          .catch((err) => { console.log(err); });
      })
      .catch(() => console.log("accept unerfolgreich"));
    setFriends(friends);
  }

  function removeFriend(friend) {
    //remove friend
    axios.post(`${serverAddress}/removeFriend`, { friend: friend.name })
      .then(() => console.log("remove erfolgreich"))
      .catch(() => console.log("remove unerfolgreich"));

    //fetch friends and set state
    axios.post(`${serverAddress}/friends`)
      .then((data) => setFriends(data.data))
      .catch((err) => { console.log(err); });
    setFriends(friends);
  }

  //GROUPS
  function sendMessageToGroup(groupID, message) {
    if (!socket) return;
    socket.emit("messageToGroup", message, groupID);
  }

  function createGroup(groupName) {
    axios.post(`${serverAddress}/createGroup`, { group: groupName })
      .then(() => {console.log("group creation success");
        axios.post(`${serverAddress}/groups`)
        .then((data) => setGroups(data.data)).catch((err) => { console.log(err); });
      })
      .catch(() => console.log("group creation failed"));
  }

  function inviteUser(userName, group) {
    axios.post(`${serverAddress}/inviteGroup`, { user: userName, group: group.id })
      .then(() => console.log("invitation success"))
      .catch(() => console.log("group invitation failed"));
  }

  function acceptGroup(group) {
    axios.post(`${serverAddress}/acceptInvite`, { group: group.id })
      .then(() => {
        console.log("Akzeptieren erfolgreich!");
        axios.post(`${serverAddress}/groups`)
          .then((data) => setGroups(data.data)).catch((err) => { console.log(err); });
      })
      .catch(() => console.log("Akzeptieren fehlgeschlagen!"));
  }

  function leaveGroup(group) {
    axios.post(`${serverAddress}/leaveGroup`, { group: group.id })
      .then(() => { 
        console.log("group leaving success");
        axios.post(`${serverAddress}/groups`)
          .then((data) => setGroups(data.data)).catch((err) => { console.log(err); });
      })
      .catch(() => console.log("group leaving failed"));
  }

  //Panel Control
  function addPrivateChatPanel(friend) {
    if(!privateChatPanelList.includes(friend)) {
      setPrivateChatPanelList((prevPanelList) => [...prevPanelList, friend]/*.filter((entry, idx) => prevPanelList.indexOf(entry) == idx)*/);
    } else console.log("Panel existiert bereits");
  }

  function deletePrivateChatPanel(friend) {
    console.log("deleted panel: " + friend.name);
    setPrivateChatPanelList(privateChatPanelList.filter((panel) => panel.id != friend.id));
  }

  function addGroupChatPanel(group) {
    if(!groupChatPanelList.includes(group)) {
      setGroupChatPanelList((prevPanelList) => [...prevPanelList, group]);
      console.log("erstelles panel für: " + group.name); 
    } else console.log("Panel existiert bereits"); 
  }

  function deleteGroupChatPanel(group) {
    console.log("deleted panel: " + group.name);
    setGroupChatPanelList(groupChatPanelList.filter((panel) => panel.id != group.id));
  }

  function addFeedPanel() {
    setFeedPanelVisibility(true);
  }

  function deleteFeedPanel() {
    setFeedPanelVisibility(false);
  }

  //Postings
  function post(message) {
    axios.post(`${serverAddress}/post`, { message })
      .then(() => setStatus("Posten erfolgreich!"))
      .catch(() => setStatus("Posten fehlgeschlagen!"));
  }

  return (
    <div>
      <Head>
        <title>FYSM</title>
      </Head>
      <div className={style.mainPage}>
        <div className={style.mainPage__navigationBar}>
          <NavigationBar />
        </div>
        <div className={style.mainPage__chatList}>
          <div className={style.mainPage__friendList}>
            <FriendList friends={friends} addPanel={addPrivateChatPanel} addFriend={addFriend} acceptFriend={acceptFriend} />
          </div>
          <dialog open={true} />
          <div className={style.mainPage__groupList}>
            {<GroupList groups={groups} addPanel={addGroupChatPanel} createGroup={createGroup} acceptGroup={acceptGroup} />}
          </div>
          {/*<div className={style.mainPage__addFeed}>
            <input type="button" value="Feed" onClick={addFeedPanel}/>
          </div>*/}
        </div>
        <div className={style.mainPage__panelContainerList}>
          <PanelContainerList 
            privateChatPanelList={privateChatPanelList} groupChatPanelList={groupChatPanelList} 
            deletePrivateChatPanel={deletePrivateChatPanel} sendPrivateMessageTo={sendPrivateMessageTo} 
            removeFriend={removeFriend}
            deleteGroupChatPanel={deleteGroupChatPanel} sendMessageToGroup={sendMessageToGroup}
            leaveGroup={leaveGroup} inviteUser={inviteUser}
            post={post} feedPanelVisible={feedPanelVisible} deleteFeedPanel={deleteFeedPanel}
          />
        </div>
      </div>
    </div>
  );
}


//Redirect to Login when session is not logged in
export const getServerSideProps = (context) => {
  if (!context.req.session.name) return { redirect: { destination: "/login", permanent: false } };
  return { props: {} };
};

