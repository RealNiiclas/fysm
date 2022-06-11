import Head from "next/head";
import style from "../styles/error.module.css";

export default function NotFound() {
  return (
    <div>
      <Head>
        <title>FYSM - Fehler</title>
      </Head>
      <div className={style.container}>
        <div className={style.title}> Die angegebene Seite konnte nicht gefunden werden!</div>
      </div>
    </div>
  );
}