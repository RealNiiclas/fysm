import style from "../../../styles/groups.module.css";

export default function GroupButton({group, onClick}) {
  return(
    <div className={style.group__container}>
      <input className={style.group__button} type="button" value={group.name} onClick={() => onClick(group)}/>
    </div>
  );
}