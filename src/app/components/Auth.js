import React from "react";

export async function getServerSideProps() {
  const res = await fetch(`http://localhost:5000/api/hello`);
  const data = await res.json();

  return {
    props: { message: data.message },
  };
}
const Auth = ({ message }) => {
  return (
    <div>
      <h1>Welcome to My Next.js App!</h1>
      <p>{message}</p>
    </div>
  );
};

export default Auth;
