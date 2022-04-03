import axios from "axios";
import { useState, useEffect } from "react";
import style from "../../styles/navigationBar.module.css";
import config from "../../config.json";

const serverAddress = `${config.serverAddress}${config.serverIncludePort ? ":" + config.serverPort : ""}`;

export default function NavigationBar() {
  const [name, setName] = useState("");

  useEffect(() => {
    axios.post(`${serverAddress}/user`)
      .then((res) => setName(res.data))
      .catch(() => console.log("Nicht angemeldet!"));
  }, []);

  function logoutUser() {
    axios.post(`${serverAddress}/logout`)
      .then(() => {
        console.log("Abmeldung erfolgreich!")
        location.replace("/login");
      })
      .catch(() => console.log("Abmeldung fehlgeschlagen!"));
  }

  return (
    <div className={style.navigationBar}>
      <label className={style.navigationBar__nameDisplay}>{name}</label>
      <input className={style.navigationBar__logoutButton} type="button" value="Abmelden" onClick={logoutUser} />
    </div>
  );
}