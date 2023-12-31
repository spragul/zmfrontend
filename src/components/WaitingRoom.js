import React, { useEffect, useRef, useState } from "react";
import { useSocket } from "../utils/SocketProvider";
import { Redirect } from "react-router";
import axios from "axios";
import { Box, Paper, IconButton, Button, Grid, Tooltip, makeStyles, Typography } from "@material-ui/core";
import MicOffIcon from "@material-ui/icons/MicOff";
import MicIcon from "@material-ui/icons/Mic";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import VideocamIcon from "@material-ui/icons/Videocam";
import { mainurl } from "../App";


const useStyles = makeStyles({
  paperStyle: {
    backgroundColor: "#DDDDDD",
  },
});

export default function WaitingRoom() {
  const classes = useStyles();
  const socket = useSocket();
  const [myVideo, setMyVideo] = useState(null);
  const toggleAudio = useRef();
  const toggleVideo = useRef();
  const [audio, setAudio] = useState(true);
  const [video, setVideo] = useState(true);
  const [hasAskedToJoin, setHasAskedToJoin] = useState(false);
  const [status, setStatus] = useState(null);
  let valueId = sessionStorage.getItem('value');

  useEffect(() => {
    showUserVideo();
    const roomId = window.location.pathname.split("/")[2];
    console.log({ roomId });
    socket.emit("check-valid-room", roomId, ({ status }) => {
      if (status === "invalid room") {
        alert("Link is invalid");
        setStatus("invalid room");
      } else if (status === "host absent") {
        alert("Host is not present and you are not allowed to join before him");
        setStatus("host absent");
      }
    });
    socket.on("you-are-admitted", () => {
      setStatus("allowed");
    });
    socket.on("you-are-denied", () => {
      setStatus("denied");
      alert("host denied entry to the meeting");
    });
    return () => {
      socket.off("you-are-admitted");
      socket.off("you-are-denied");
    };
  }, []);
  function askToJoin() {
    axios.get(`${mainurl}/authenticated/${valueId}`).then((response) => {
      if (response.data.messages === "true") {
        setHasAskedToJoin(true);
        const roomId = window.location.pathname.split("/")[2];
        console.log("this is uniqueId", response.data.data);
        socket.emit("req-join-room", roomId, response.data.data.name, response.data.data.uniqueId);
      } else {
        alert("you are not logged in");
        setStatus("denied");
      }
    });
  }
  async function showUserVideo() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    toggleVideo.current = () => {
      stream.getVideoTracks()[0].enabled = !stream.getVideoTracks()[0].enabled;
      setVideo((prev) => !prev);
    };
    toggleAudio.current = () => {
      stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0].enabled;
      setAudio((prev) => !prev);
    };
    setMyVideo({ stream });
  }

  if (status === "invalid room") {
    return <Redirect to="/" />;
  }
  if (status === "host absent") {
    return <Redirect to="/mymeetings" />;
  }
  if (status === "allowed") {
    const link = `/join/${window.location.pathname.split("/")[2]}`;
    return (
      <Redirect
        to={{
          pathname: link,
          state: { from: "/", audio, video },
        }}
      />
    );
  }
  if (status === "denied") {
    return <Redirect to="/" />;
  }
  return (
    <>
      <Box textAlign="center" style={{ paddingLeft: "8vw", paddingRight: "8vw" }}>
        <Typography variant={window.innerWidth >= 700 ? "h3" : "h4"}>WaitingRoom</Typography>
        <Paper className={classes.paperStyle} style={{ width: "70vw", margin: "auto" }}>
          <Box style={{ padding: "6vh 6vw" }}>
            <video
              muted
              playsInline
              autoPlay
              style={{ width: "32vw", height: "42vh", WebkitTransform: "scaleX(-1)", transform: "scaleX(-1)" }}
              ref={(videoRef) => {
                if (videoRef && myVideo) {
                  videoRef.srcObject = myVideo.stream;
                }
              }}
            ></video>
            <Grid container style={{ marginTop: "5vh" }}>
              <Grid item xs={12}>
                <Box component="span" px={1}>
                  <Tooltip placement="top" title={audio ? "Turn off Microphone" : "Turn on Microphone"}>
                    <IconButton onClick={toggleAudio.current} color={audio ? "default" : "secondary"}>
                      {audio ? <MicIcon className={classes.iconStyles} /> : <MicOffIcon className={classes.iconStyles} />}
                    </IconButton>
                  </Tooltip>
                </Box>
                <Box component="span" px={1}>
                  <Tooltip placement="top" title={video ? "Turn off Camera" : "Turn on Camera"}>
                    <IconButton onClick={toggleVideo.current} color={video ? "default" : "secondary"}>
                      {video ? <VideocamIcon className={classes.iconStyles} /> : <VideocamOffIcon className={classes.iconStyles} />}
                    </IconButton>
                  </Tooltip>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Button color="primary" variant="contained" onClick={askToJoin} disabled={hasAskedToJoin}>
                  {!hasAskedToJoin ? "Ask To Join" : "Waiting for host"}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </>
  );
}
