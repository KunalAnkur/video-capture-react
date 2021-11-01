import React, { useRef, useState } from 'react'

function HomePage() {
    const videoRef = useRef();
    const [myVideoStream, setMyVideoStream] = useState(null);
    const [mediaRecorder , setMediaRecorder] = useState(null);
    const recorderVideoRef = useRef();
    const [videoSrc, setVideoSrc] = useState(null);
    const getVideo = () => {
        navigator.mediaDevices.getUserMedia({video:true, audio:true}).then(stream => {
            setMyVideoStream(stream)
            videoRef.current.srcObject = stream;
            videoRef.current.play();
        }).catch(e => {
            console.log(e);
        })
    }
    const muteUnmute = () => {
      const enabled = myVideoStream.getAudioTracks()[0].enabled;
      if (enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        // setUnmuteButton();
      } else {
        // setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true;
      }
    };
    const playStop = () => {
      const enabled = myVideoStream.getVideoTracks()[0].enabled;
      if (enabled) {
        myVideoStream.getVideoTracks()[0].enabled = false;
        // setPlayVideo();
      } else {
        // setStopVideo();
        myVideoStream.getVideoTracks()[0].enabled = true;
      }
    };
    let recordedChunks = [];
    const onRecordStart = () => {
        const localmediarecorder = new MediaRecorder(myVideoStream, {
          mimeType: "video/webm;codecs=vp8,opus",
        });
        setMediaRecorder(localmediarecorder);
        localmediarecorder.start(500);
        localmediarecorder.ondataavailable = (e) => {
          console.log(e.data);
          recordedChunks.push(e.data);
        };
        // mediaStream.onaddtrack = event => {
        //     console.log(event)
        // }
    }

    const onRecordStop = () => {
        mediaRecorder.stop();
        mediaRecorder.onstop = () => {
            const videoBlob = new Blob(recordedChunks, {
              type: "video/webm;codecs=vp8,opus",
            });
            
            recordedChunks=[];
            // recorderVideoRef.current.src =
            //   window.URL.createObjectURL(videoBlob);
            const dataUrl = URL.createObjectURL(videoBlob);
            setVideoSrc(dataUrl);

            console.log(dataUrl);
        }
    }
    console.log(videoSrc)
    return (
      <div>
        <div className="video">
          <video ref={videoRef} muted></video>
        </div>
        <button onClick={getVideo}>Start camera</button>
        <button onClick={muteUnmute}>mute / Unmute</button>
        <button onClick={playStop}> play / stop</button>
        <button onClick={onRecordStart}>record</button>
        <button onClick={onRecordStop}>stop record</button>

        <video 
        ref={recorderVideoRef}
        src={videoSrc}
        autoPlay
         controls></video>
      </div>
    );
}

export default HomePage
