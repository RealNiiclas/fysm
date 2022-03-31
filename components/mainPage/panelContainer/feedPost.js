import style from "../../../styles/chatPanel.module.css";

export default function FeedPost({time, name, posting}) {
  return(
    <div className={style.feedPost}>
      <div className={style.feedPost__time}>{time}</div>
      <div className={style.feedPost__name}>{name}</div> 
      <div className={style.feedPost__posting}>{posting}</div>
    </div>
  );
}