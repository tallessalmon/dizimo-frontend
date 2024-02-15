import React from "react";
import { getProfileLocalStorage } from "../../context/AuthProvider/util";

const Home: React.FC = () => {
  const user: any = getProfileLocalStorage();
  return (
    <>
      <h2>
        Seja Bem vindo, {String(user.name).split(" ").slice(0, 1).join(" ")}!
      </h2>
        <img src="/santa-rosa.png" style={{position: 'absolute', bottom: 80, right: 10}}/>
    </>
  );
};
export default Home;
