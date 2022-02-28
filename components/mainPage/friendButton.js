export default function FriendButton(props) {

  function openChat(event) {
    console.log("Friend");
  }

  return(
    <div>
      <input type="button" value={props.name} onClick={(event) => openChat(event)}/>
    </div>
  );
}