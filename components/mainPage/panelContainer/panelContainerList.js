import PrivateChatPanel from "./privateChatPanel.js";
import GroupChatPanel from "./groupChatPanel.js";
import style from "../../../styles/panelContainerList.module.css";
import FeedPanel from "./feedPanel.js";

export default function PanelContainerList({ privateChatPanelList, groupChatPanelList, deletePrivateChatPanel, sendPrivateMessageTo, removeFriend, deleteGroupChatPanel, sendMessageToGroup, leaveGroup, post, feedPanelVisible, deleteFeedPanel }) {
  //IDEE: TabIndex auf Eingabefelder mit Index der Listen
  return(
    <div className={style.panelContainerList}>
      <ul className={style.panelContainerList__list}>
        {privateChatPanelList.map((friend) => <li key={friend.name}><PrivateChatPanel friend={friend} deletePrivateChatPanel={deletePrivateChatPanel} sendPrivateMessageTo={sendPrivateMessageTo} removeFriend={removeFriend}/></li>)}
        {groupChatPanelList.map((group) => <li key={group.id}><GroupChatPanel group={group} deleteGroupChatPanel={deleteGroupChatPanel} sendMessageToGroup={sendMessageToGroup} leaveGroup={leaveGroup}/></li>)}
        {feedPanelVisible ? <li key="feedPanel"><FeedPanel post={post} deleteFeedPanel={deleteFeedPanel} /></li> : <></>}
      </ul>
    </div>
  );
}