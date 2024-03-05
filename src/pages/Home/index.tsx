import React from "react";
import { getProfileLocalStorage } from "../../context/AuthProvider/util";

const Home: React.FC = () => {
  const user: any = getProfileLocalStorage();

  return (
    <>
      <h2>
        Seja Bem vindo, {String(user.name).split(" ").slice(0, 1).join(" ")}!
      </h2>
      
      <img
        src="/santa-rosa.png"
        style={{ position: 'fixed', bottom: 10, right: 10, width: '200px', zIndex: 0 }}
        alt="Imagem Santa Rosa"
      />
    </>
  );
};

export default Home;
