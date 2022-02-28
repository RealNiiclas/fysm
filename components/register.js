import axios from "axios";
import { useState } from "react";
import config from "../config.json";
import style from "../styles/register.module.css";

//TODO: Roter GRadient bei faslchen eingaben
//TODO: Prüfen ob Nutzer bereits exisitert

let serverAddress = `${config.serverAddress}${config.serverIncludePort ? ":" + config.serverPort : ""}`;

export default function signinForm() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  function register(event) {
    if(password == repeatPassword) {
      runOnClick(event);
      axios.post(`${serverAddress}/register`, { name, password })
        .then(() => {console.log("registration success"); location.replace('/login');})
        .catch(() => console.log("registration failed"));
    } else {
      console.log("passwort nicht gleich!");
    }
  }

  function runOnClick(event) {
    event.preventDefault();
    document.activeElement.blur();
  }



  return (
    <div className={style.registerForm}>
      <form className={style.registerForm__form}>
        <h1 id={style.registerForm__registerLabel}>Registrieren</h1>
        <br/>
        <div className={style.registerForm__username}>
          <div className={style.registerForm__textInput}>
            <input className={style.registerForm__textInputField} type="text" placeholder="Name" value={name} onChange={(event) => setName(event.target.value)} tabIndex="1"/>
            <label className={style.registerForm__label}>Nutzername</label>
          </div>
        </div>
        <br/>
        <div className={style.registerForm__password}>
          <div className={style.registerForm__textInput}>
            <input className={style.registerForm__textInputField} type="password" placeholder="Passwort" value={password} onChange={(event) => setPassword(event.target.value)} tabIndex="1"/>
            <label className={style.registerForm__label}>Passwort</label>
            <div>
              <input className={style.registerForm__toggleVisibility} type="button"/>
            </div>
          </div>  
        </div>
        <br/>
        <div className={style.registerForm__password}>
          <div className={style.registerForm__textInput}>
            <input className={style.registerForm__textInputField} type="password" placeholder="Passwort wiederholen" value={repeatPassword} onChange={(event) => setRepeatPassword(event.target.value)} tabIndex="1"/>
            <label className={style.registerForm__label}>Passwort wiederholen</label>
            <div>
              <input className={style.registerForm__toggleVisibility} type="button"/>
            </div>
          </div>  
        </div>
        <input id={style.registerForm__submitButtonInput} type="submit"value="Anmelden" onClick={(event) => register(event)}/>
      </form>
    </div>  
  );
}
