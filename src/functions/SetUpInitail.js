import { mainurl } from "../App";
export default function SetUpInitail({
  socket,
  setMyPic,
  axios,
  myPicRef,
  myNameRef,
  setAskForPermission,
  setNameOfPersoToJoin,
  setOpenDialogBox,
  allowUser,
  someOneSharingScreenRef,
  setSomeOneSharingScreen,
  titleCase,
  setVideos,
  props,
  setLoadingScreen,
  uniqueIdRef,
}) {
  const events = ["user-connected", "user-disconnected", "changed-video-status-reply", "changed-audio-status-reply", "update-audio-video-state", "req-to-join-room"];
  let valueId = sessionStorage.getItem('value');
  events.forEach((event) => {
    socket.off(event);
  });
  axios.get(`${mainurl}/authenticated/${valueId}`).then((response) => {
    setMyPic(response.data.data.picurL);
    myPicRef.current = response.data.data.picurL;
    myNameRef.current = response.data.data.name;
    uniqueIdRef.current = response.data.data.uniqueId;
    socket.on("req-to-join-room", ({ socketId, name }, attemtingTo) => {
      if (attemtingTo === "join") {
        setAskForPermission((prev) => [...prev, { socketId, name }]);
        setNameOfPersoToJoin({ name: name, id: socketId });
        setOpenDialogBox(true);
        allowUser.current = () => {
          socket.emit("this-user-is-allowed", socketId);
        };
      } else {
        setAskForPermission((prev) => [...prev.filter((permission) => permission.socketId !== socketId)]);
        setOpenDialogBox(false);
        setLoadingScreen({ value: true, mssg: "User Seems To have Left" });
        setTimeout(() => {
          setLoadingScreen({ value: true, mssg: "Check the waiting room!" });
        }, 1000);
        setTimeout(() => {
          setLoadingScreen({ value: false });
        }, 1900);
      }
    });
    socket.on("update-audio-video-state", ({ video: userVideo, audio: userAudio, userId, picurL: userPicUrl, name: userName, screenShareStatus }) => {
      if (someOneSharingScreenRef.current !== undefined && someOneSharingScreenRef.current.value === false) {
        setSomeOneSharingScreen(screenShareStatus);
        someOneSharingScreenRef.current = screenShareStatus;
      }
      setVideos((prev) => {
        prev.map((vid, key) => {
          if (vid.userId === userId) {
            vid.audio = userAudio;
            vid.video = userVideo;
            vid.picurL = userPicUrl;
            vid.userName = titleCase(userName);
          }
          return null;
        });
        return [...prev];
      });
    });
    socket.on("changed-audio-status-reply", ({ status, userId }) => {
      setVideos((prev) => {
        prev.forEach((video) => {
          if (video.userId === userId) {
            video.audio = status;
          }
        });
        return [...prev];
      });
    });
    socket.on("changed-video-status-reply", ({ status, userId }) => {
      setVideos((prev) => {
        prev.forEach((video) => {
          if (video.userId === userId) {
            video.video = status;
          }
        });
        return [...prev];
      });
    });
    socket.on("starting-screen-share", (userId) => {
      setSomeOneSharingScreen({ value: true, userId });
      someOneSharingScreenRef.current = { value: true, userId };
    });
    socket.on("stopping-screen-share", () => {
      setSomeOneSharingScreen({ value: false, userId: null });
      someOneSharingScreenRef.current = { value: false, userId: null };
    });
    if (props.location.state === undefined) props.location.state = {};
    if (props.location.state.audio === undefined) {
      props.location.state.audio = true;
    }
    if (props.location.state.video === undefined) {
      props.location.state.video = false;
    }
  });
  return new Promise((resolve, reject) => {
    return resolve();
  });
}
