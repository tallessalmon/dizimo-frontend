import React from "react";
import { getProfileLocalStorage } from "../../context/AuthProvider/util";
import { useAuth } from "../../context/AuthProvider/useAuth";

const Home: React.FC = () => {
  const user: any = getProfileLocalStorage();
  
  const auth = useAuth()
  if (user && user.exp && user.exp < Math.floor(Date.now() / 1000)) {
    auth.logout()
  }

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
