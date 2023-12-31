import React, { useEffect, useState, useRef } from "react";

import { useSocket } from "../../utils/SocketProvider";
import MicOffIcon from "@material-ui/icons/MicOff";
import MicIcon from "@material-ui/icons/Mic";
const useAbleMaxWidths = ["70vw", "60vw", "50vw"];
const useAbleMaxWidthsDiv = ["70vw", "60vw", "43vw"];
const usableHeightsDiv = ["80vh", "40vh", "32vh"];

export default function MobileIndividualVideo({ key, myId, speakerToggle, videoStream, video, audio, size }) {
  const [modelsLoaded, setModelsLoaded] = useState(false);
  //we are using this single variable to store both the refs to canvas as well as video in a map
  //linked to them by their userid
  const videoRefs = useRef({});
  const clearMe = useRef();
  const startInterval = useRef();
  const stopInterval = useRef();
  const img = useRef();
  const errCnt = useRef(0);
  const socket = useSocket();
  useEffect(() => {
    startVideo();
    img.current = new Image();
  }, []);
  useEffect(() => {
    if (typeof stopInterval.current === "function") {
      stopInterval.current();
    }

    return () => {
      if (typeof stopInterval.current === "function") stopInterval.current();
      const turnOff = ["start-sticker", "stop-sticker"];
      turnOff.forEach((turn) => {
        socket.off(turn);
      });
    };
  }, [size]);

  function startVideo() {
    setModelsLoaded(true);
  }

 

  const currMaxWidth = size === 1 ? useAbleMaxWidths[0] : size === 2 || size === 4 ? useAbleMaxWidths[1] : useAbleMaxWidths[2];
  if (!modelsLoaded) {
    return <div style={{ color: "white" }}>Loading</div>;
  }
  return (
    <div
      style={{
        backgroundColor: "black",
        width: size <= 3 ? useAbleMaxWidthsDiv[size - 1] : useAbleMaxWidthsDiv[2],
        margin: "auto",
        position: "relative",
        height: size <= 3 ? usableHeightsDiv[size - 1] : usableHeightsDiv[2],
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <video
        muted={videoStream.userId === myId || speakerToggle}
        key={videoStream.userId}
        playsInline
        autoPlay

        style={
          (videoStream.video && videoStream.userId !== myId) || (videoStream.userId === myId && video)
            ? { width: useAbleMaxWidths[size <= 3 ? size - 1 : 2], position: "absolute", WebkitTransform: "scaleX(-1)", transform: "scaleX(-1)" }
            : { display: "none" }
        }
        ref={(videoRef) => {
          if (videoRef) {
            if (videoRefs.current[videoStream.userId] === undefined) videoRefs.current[videoStream.userId] = { videoRef };
            else {
              videoRefs.current[videoStream.userId].videoRef = videoRef;
            }
          }
          if (videoRef) videoRef.srcObject = videoStream.stream;
          return videoRef;
        }}
      />
      <canvas
        ref={(canvasRef) => {
          if (canvasRef) {
            if (videoRefs.current[videoStream.userId] === undefined) videoRefs.current[videoStream.userId] = { canvasRef };
            else {
              videoRefs.current[videoStream.userId].canvasRef = canvasRef;
            }
          }
        }}
        style={
          (videoStream.video && videoStream.userId !== myId) || (videoStream.userId === myId && video)
            ? { width: currMaxWidth, height: "100%", position: "absolute", WebkitTransform: "scaleX(-1)", transform: "scaleX(-1)" }
            : { display: "none" }
        }
      ></canvas>
      {!((videoStream.video && videoStream.userId !== myId) || (videoStream.userId === myId && video)) && (
        <img src={videoStream.picurL} style={{ borderRadius: "100%", height: "25%", width: "auto", minWidth: "60px", maxWidth: "120px" }} alt={videoStream.userName} />
      )}
      <div
        style={{
          fontSize: "1.3rem",
          fontFamily: "sans-serif",
          color: "white",
          textAlign: "right",
          paddingRight: "3%",
          width: "fit-content",
          marginLeft: "auto",
          padding: "1.3%",
          zIndex: "100",
          position: "absolute",
          bottom: "0",
          right: "0",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
        <span style={{ verticalAlign: "bottom" }}>{videoStream.userId === myId ? "You" : videoStream.userName}</span>
        {videoStream.userId !== myId &&
          (videoStream.audio ? <MicIcon style={{ marginLeft: "10px", verticalAlign: "bottom" }} /> : <MicOffIcon style={{ marginLeft: "10px", verticalAlign: "bottom" }} />)}
      </div>
    </div>
  );
}
