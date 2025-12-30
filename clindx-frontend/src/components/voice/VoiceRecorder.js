import React, { useState, useRef } from "react";

const VoiceRecorder = ({ onRecordingComplete }) => {
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const [recording, setRecording] = useState(false);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    mediaRecorderRef.current = new MediaRecorder(stream);
    chunksRef.current = [];

    mediaRecorderRef.current.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(chunksRef.current, { type: "audio/wav" });
      onRecordingComplete(audioBlob);
    };

    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  return (
    <div className="card">
      <h3>Record Symptoms</h3>

      {!recording ? (
        <button onClick={startRecording}>🎙 Start Recording</button>
      ) : (
        <button onClick={stopRecording}>⏹ Stop Recording</button>
      )}
    </div>
  );
};

export default VoiceRecorder;
