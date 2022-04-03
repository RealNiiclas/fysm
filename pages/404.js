export default function NotFound() { return <div></div>; }
export const getStaticProps = () => {
    return { redirect: { destination: "/", permanent: false } };
};
