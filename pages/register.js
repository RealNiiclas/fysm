//Nutzername & Passwort & Passwort wiederholen
//Button Passwort zurücksetzen (Zukunft)
//Captcha (Zukunft)
//Button Log In - Link
//Button Sign In
//CheckBox Accept Privacy Policy
//Button Toogle Password Visibility
//Button Privacy Policy
//Password Regulations (Zukunft)

import Head from "next/head";
import RegisterForm from "../components/register.js";

export default function Register() {
  return(
    <div>
      <Head>
        <title>Login</title>
      </Head>
      <RegisterForm/>
    </div>
  );
}

//relocate to main page if user is currently in a session
export const getServerSideProps = (context) => {
  if (context.req.session.name) return { redirect: { destination: "/", permanent: false } };
  return { props: {} };
};
