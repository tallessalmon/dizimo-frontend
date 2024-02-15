import React from "react";
import "./style.css";
import { Button } from "antd";

export const NotFound: React.FC = () => {
  return (
    <>
      <main className="main_404">
        <div className="error-container">
          <img
            src="image-asset.jpeg"
            alt="Character crying"
            className="error-image"
          />
          <div className="error-text">
            <h1>Aww... Não encontrei essa página.</h1>
            <p>Isso foi o erro 404<i>!!</i></p>
            <p>
            O que você procura pode ter se perdido na memória de longo prazo.
            </p>
            <br/>
            <Button href="/">Tente voltar</Button>
          </div>
        </div>
      </main>
    </>
  );
}