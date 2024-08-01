import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, NavLink } from "react-router-dom";
import axios from 'axios';

// core styles
import "./scss/volt.scss";

// vendor styles
import "react-datetime/css/react-datetime.css";

import HomePage from "./pages/HomePage";
import ScrollToTop from "./components/ScrollToTop";

const App = () => {
  useEffect(() => {
    const getToken1 = async () => {
      try {
        const res = await axios.post(
          `https://pets.dev.savaapi.com/api/system-api/dev1/token`,
          data
        );
        if (res.data.data) {
          await localStorage.setItem("token1", res.data.data.token);
          getToken2(res.data.data.token);
        }

        const accessToken = res.data.data.accessToken;
        return accessToken;
      } catch (error) {
        console.error("Error while fetching token1:", error);
        return null;
      }
    };


    const getToken2 = async (token) => {
      try {
        const res = await axios.post(
          `https://pets.dev.savaapi.com/api/custom-api/dev1/auth/root-admin-login`,
          datas,
          {
            headers: {
              "x-am-authorization": token,

            },
          }
        );
       await localStorage.setItem("accessToken", res.data.data.accessToken);
        const accessToken = res.data.data.accessToken;
        return accessToken;
      } catch (error) {
        console.error("Error while fetching token1:", error);
        return null;
      }
    };

    //     const getaccessToken = async () => {
    //       try {
    //         const accessToken = await getToken1();
    //         if (!accessToken) {
    //           console.error("Access token is null or undefined.");
    //           return;
    //         }

    //         const secondRes = await axios.get(
    //           `https://pets.dev.savaapi.com/api/custom-api/admin/auth/root-admin-login`,
    //           {
    //             headers: {
    //               Authorization: `Bearer ${accessToken}`
    //             }
    //           }
    //         );
    // console.log(secondRes,"6666666666666666");
    //         const secondAccessToken = secondRes.data.accessToken;
    //         console.log("accesstoken",secondRes);
    //         console.log("Second AccessToken", secondAccessToken);
    //         localStorage.setItem("accessToken", secondAccessToken);
    //       } catch (error) {
    //         console.error("Error while fetching second data:", error);
    //       }
    //     };

    getToken1();


  }, []);

  return (
    <HashRouter>
      <ScrollToTop />
      <HomePage />
    </HashRouter>
  );
};

const data = {
  "authTokenType": "AM",
  "authTokenAM": {
    "u": "webdevusers",
    "p": "webdevusers"
  }
};

const datas =
{
  "uMobile": "root@root.com",
  "uPassword": "root@123"
}

ReactDOM.render(<App />, document.getElementById("root"));
