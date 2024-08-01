
import React from 'react';
import { Image } from '@themesberg/react-bootstrap';

// import ReactLogo from "../assets/img/technologies/react-logo-transparent.svg";
import ReactLogo from "../assets/img/technologies/loading-loader-svgrepo-com.svg";


export default (props) => {

  const { show } = props;

  return (
    <div className={`preloader bg-soft flex-column justify-content-center align-items-center ${show ? "" : "show"}`}>
      <Image className="loader-element animate__animated animate__jackInTheBox" src={ReactLogo} height={40} />
    </div>
  );
};
