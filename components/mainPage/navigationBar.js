import style from "../../styles/navigationBar.module.css";
import axios from "axios";
import { useState } from "react";
import config from "../../config.json";

let serverAddress = `${config.serverAddress}${config.serverIncludePort ? ":" + config.serverPort : ""}`;

export default function NavigationBar() {

  const [name, setName] = useState("");

  //wieder in Index packen
  function logOutUser(event) {
    axios.post(`${serverAddress}/logout`)
      .then(() => { console.log("Abmeldung erfolgreich!") 
        location.replace("./login");
      })
      .catch(() => console.log("Abmeldung fehlgeschlagen!"));
    //Abmeldung mit Location Replace führt zu Fehlschlag
  }


  //TODO Auslagern in Use Effect!!!
  axios.post(`${serverAddress}/user`)
    .then((res) => setName(res.data))
    .catch(() => console.log("Nicht angemeldet!"));

  return(
    <div className={style.navigationBar}>
      <div className={style.navigationBar__nameDisplay}>
        <label id={style.navigationBar__nameDisplayLabel}>{name}</label>
      </div>
      <div className={style.navigationBar__logOut}>
        <input id={style.navigationBar__logOutButton} type="button" value="Log out" onClick={(event) => logOutUser(event)}/>
      </div>
    </div>
  );
}