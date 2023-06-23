import React from "react";
import SocketProvider from "./utils/SocketProvider";
import Home from "./components/Home/Home";
import VideoCallArea from "./components/VideoCallArea";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import WaitingRoom from "./components/WaitingRoom";
import LoginProvider from "./utils/LoginProvider";
import SignInFirst from "./components/Home/SignInFirst";
import ProtectedRoute from "./utils/ProtectedRoute";
import MyMeetings from "./components/My Meetings/MyMeetings";
import MeetingDetails from "./components/My Meetings/MeetingDetails";
import { Login } from "./pages/login";
import './App.css';
import { Signup } from "./pages/signup";
import { Forgot } from "./pages/forgotpassword";
import { Reset } from "./pages/resetpassword";

export const mainurl = "https://zoom-metting-backend.onrender.com"

export default function App() {
  return (
    <SocketProvider>
      <LoginProvider>
        <Router>
          <Switch>
          <Route exact path="/" component={Home} />
            <ProtectedRoute path="/join" component={VideoCallArea} />
            <Route path="/invite" component={MeetingDetails} />
            <Route path="/waitingroom">
              <WaitingRoom />
            </Route>
            <Route path="/signinfirst" component={SignInFirst} />
            <Route path="/mymeetings" component={MyMeetings} />
            <Route path="/login">
              <Login/>
            </Route>
            <Route path="/signup">
              <Signup/>
            </Route>
            <Route path="/forgotpassword">
              <Forgot/>
            </Route>
            <Route path="/resetpassword/:id/:token">
              <Reset/>
            </Route>
          </Switch>
        </Router>
      </LoginProvider>
    </SocketProvider>
  );
}
