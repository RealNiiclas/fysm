//Nutzername & Passwort
//Button Passwort zurücksetzen (Zukunft)
//Captcha (Zukunft)
//Button Log In
//Button Sign In - Link
//Button Toogle Password Visibility
//Button Privacy Policy

//TODO: Roter GRadient bei faslchen eingaben

import axios from "axios";
import config from "../config.json";
import { useState } from "react";
import style from "../styles/login.module.css";

let serverAddress = `${config.serverAddress}${config.serverIncludePort ? ":" + config.serverPort : ""}`;

export default function loginForm() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  function login(event) {
    runOnClick(event);
    axios.post(`${serverAddress}/login`, { name, password })
      .then(() => { console.log("login success"); location.replace('/'); })
      .catch(() => console.log("login failed") );
  }

  function runOnClick(event) {
    event.preventDefault();
    document.activeElement.blur();
  }

  return (
    <div className={style.loginForm}>
      <form className={style.loginForm__form}>
        <h1 id={style.loginForm__loginLabel}>Anmeldung</h1>
        <div className={style.loginForm__username}>
          <div className={style.loginForm__textInput}>
            <input className={style.loginForm__textInputField} type="text" placeholder="Name" value={name} onChange={(event) => setName(event.target.value)}/>
            <label className={style.loginForm__label}>Nutzername</label>
          </div>
        </div>
        <br/>
        <div className={style.loginForm__password}>
          <div className={style.loginForm__textInput}>
            <input className={style.loginForm__textInputField} type="password" placeholder="Passwort" value={password} onChange={(event) => setPassword(event.target.value)}/>
            <label className={style.loginForm__label}>Passwort</label>
            <div>
              <input className={style.loginForm__toggleVisibility} type="button"/>
            </div>
          </div>  
        </div>
        <br />
        <input id={style.loginForm__submitButtonInput} type="submit" value="Anmelden" onClick={(event) => login(event)}/><br /><br />
        <input id={style.loginForm__submitButtonInput} type="button" value="Zur Registrierung" onClick={(event) => location.replace('/register')}/>
      </form>
    </div>  
  );
}

