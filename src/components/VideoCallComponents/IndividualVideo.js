import React, { useEffect, useState, useRef } from "react";
import { useSocket } from "../../utils/SocketProvider";


const useAbleMaxWidths = ["65vw", "50vw", "32vw"];

export default function IndividualVideo({ myId, speakerToggle, videoStream, video, size, setIsStickerSet }) {
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
  const firstTime = useRef(true);
  useEffect(() => {
    startVideo();
    img.current = new Image();
  }, []);
  useEffect(() => {
    if (typeof stopInterval.current === "function") {
      stopInterval.current();
      setIsStickerSet(false);
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

 

  const currMaxWidth = size === 1 ? useAbleMaxWidths[0] : size === 2 ? useAbleMaxWidths[1] : useAbleMaxWidths[2];
  if (!modelsLoaded) {
    return <div style={{ color: "white" }}>Loading</div>;
  }
  if (videoStream === undefined) return null;
  return (
    <>
      <video
        muted={videoStream.userId === myId || speakerToggle}
        key={videoStream.userId}
        playsInline
        autoPlay

        style={
          (videoStream.video && videoStream.userId !== myId) || (videoStream.userId === myId && video)
            ? { width: currMaxWidth, position: "absolute", WebkitTransform: "scaleX(-1)", transform: "scaleX(-1)" }
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
            ? { width: currMaxWidth, position: "absolute", WebkitTransform: "scaleX(-1)", transform: "scaleX(-1)" }
            : { display: "none" }
        }
      ></canvas>
      {!((videoStream.video && videoStream.userId !== myId) || (videoStream.userId === myId && video)) && (
        <img src={videoStream.picurL} style={{ borderRadius: "100%", height: "auto", width: "25%", minWidth: "60px", maxWidth: "120px", display: "block" }} alt={videoStream.userName} />
      )}
    </>
  );
}
