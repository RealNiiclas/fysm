import style from "../../../styles/friends.module.css";

export default function FriendButton({ friend, onClick }) {
  //TODO wenn accepted == 0 dann Freund hinzufügen
  return(
    <div className={style.friend__container}>
      <input className={style.friend__button} type="button" value={friend.name} onClick={() => onClick(friend)}/>
    </div>
  );
}