import { useLogin } from "./LoginProvider";
import { useLocation, Redirect, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import { useSocket } from "./SocketProvider";
import { mainurl } from "../App";


export default function ProtectedRoute({ component: Component, ...rest }) {
  const [isLoggedIn, setIsLoggedIn] = useLogin();
  const { state } = useLocation();
  const [verifiedFromServer, setVerifiedFromServer] = useState(false);
  const socket = useSocket();
 let valueId = sessionStorage.getItem('value');


  useEffect(() => {
    axios.get(`${mainurl}/authenticated/${valueId}`).then((response) => {
      if (response.data.messages === "true") {
        setIsLoggedIn(true);
        socket.emit("join-all-rooms", response.data.data.uniqueId);
      } else {
        setIsLoggedIn(false);
      }
      setVerifiedFromServer(true);
    });
  }, []);

  if (!verifiedFromServer)
    return (
      <div
        style={{
          position: "absolute",
          top: "53%",
          left: "48%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        }}
      >
        <Loader
          type="Puff"
          color="#00BFFF"
          height={100}
          width={100}
          timeout={3000} //3 secs
        />
      </div>
    );

  //since the url has an extra parameter when it comes from the server,after verification we take care
  //of that here
  let url = window.location.pathname;
  const allow = url.split("/").length === 4;
  url = url = url.slice(0, url.lastIndexOf("/"));
  if (allow) {
    window.history.replaceState({}, "", url);
  }
  if (isLoggedIn === false) {
    return <Redirect to={{ pathname: "/signinfirst", state: { from: rest.location.pathname, prevFrom: state && state.from === "/" ? "home" : null } }} />;
  } else if (allow || (state && state.from === "/")) return <Route {...rest} render={(props) => <Component {...props} />}></Route>;
  else return <Redirect to={`/waitingroom/${window.location.pathname.split("/")[2]}`} />;
}
