import style from "../../../styles/chatPanel.module.css";

export default function MessageBox({time, name, message}) {
  return(
    <div className={style.messageBox}>
      <div className={style.messageBox__time}>{time}</div>
      <div className={style.messageBox__name}>{name}</div> 
      <div className={style.messageBox__message}>{message}</div>
    </div>
  );
}