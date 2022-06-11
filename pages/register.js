import axios from "axios";
import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";
import style from "../styles/register.module.css";
import config from "../config.json";

let serverAddress = `${config.serverAddress}${config.serverIncludePort ? ":" + config.serverPort : ""}`;

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [message, setMessage] = useState("> Registrierung wird benötigt! <");

  function register(event) {
    if (password != repeatPassword) return setMessage("> Passwörter stimmen nicht überein! <");
    runOnClick(event);
    axios.post(`${serverAddress}/register`, { name, password })
      .then(() => router.push('/login'))
      .catch(() => setMessage("> Registrierung fehlgeschlagen! <"));
  }

  function runOnClick(event) {
    event.preventDefault();
    document.activeElement.blur();
  }

  return (
    <div>
      <Head>
        <title>FYSM - Registrierung</title>
      </Head>
      <div className={style.container}>
        <div className={style.form}>
          <div className={style.form_title}>Registrierung</div>
          <div className={style.form_message}>{message}</div>
          <div className={style.form_input}><input className={style.form_username} type="text" placeholder="Nutzername" spellCheck={false} value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div className={style.form_input}><input className={style.form_password} type="password" placeholder="Passwort" spellCheck={false} value={password} onChange={(e) => setPassword(e.target.value)} /></div>
          <div className={style.form_input}><input className={style.form_password} type="password" placeholder="Passwort" spellCheck={false} value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} /></div>
          <input className={style.form_login} type="button" value="Registrieren" onClick={(e) => register(e)} />
          <input className={style.form_register} type="button" value="Anmelden" onClick={() => location.replace('/login')} />
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps = (context) => {
  if (context.req.session.name) return { redirect: { destination: "/", permanent: false } };
  return { props: {} };
};