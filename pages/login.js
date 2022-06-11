import axios from "axios";
import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";
import style from "../styles/login.module.css";
import config from "../config.json";

let serverAddress = `${config.serverAddress}${config.serverIncludePort ? ":" + config.serverPort : ""}`;

export default function Login() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("> Anmeldung wird benötigt <");

  function login(event) {
    runOnClick(event);
    axios.post(`${serverAddress}/login`, { name, password })
      .then(() => router.push("/"))
      .catch(() => setMessage("> Anmeldung fehlgeschlagen! <"));
  }

  function runOnClick(event) {
    event.preventDefault();
    document.activeElement.blur();
  }

  return (
    <div>
      <Head>
        <title>FYSM - Anmeldung</title>
      </Head>
      <div className={style.container}>
        <div className={style.form}>
          <div className={style.form_title}>Anmeldung</div>
          <div className={style.form_message}>{message}</div>
          <div className={style.form_input}><input className={style.form_username} type="text" placeholder="Nutzername" spellCheck={false} value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div className={style.form_input}><input className={style.form_password} type="password" placeholder="Passwort" spellCheck={false} value={password} onChange={(e) => setPassword(e.target.value)} /></div>
          <input className={style.form_login} type="button" value="Anmelden" onClick={(e) => login(e)} />
          <input className={style.form_register} type="button" value="Registrieren" onClick={() => location.replace('/register')} />
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps = (context) => {
  if (context.req.session.name) return { redirect: { destination: "/", permanent: false } };
  return { props: {} };
};