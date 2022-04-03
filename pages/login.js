import LoginForm from "../components/login.js";
import Head from "next/head";

export default function Login() {
  return(
    <div>
      <Head>
        <title>Anmeldung</title>
      </Head>
      <LoginForm/>
    </div>
  );
}

//relocate to main page if user is currently in a session
export const getServerSideProps = (context) => {
  if (context.req.session.name) return { redirect: { destination: "/", permanent: false } };
  return { props: {} };
};
