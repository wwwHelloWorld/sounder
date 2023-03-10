import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { setActiveTrack, deleteTrack } from "../store/reducers";
import { Howl, Howler } from 'howler';

const Vizulization = ({ howler, isPlaying }) => {
  const [source, setSource] = useState<string>("");
  const activeTrackData = useSelector(
    (store: any) => store.playlist.activeTrack
  );
  const playlist = useSelector((store: any) => store.playlist.playlistTracks);
  const canvasRef = useRef(null);
  const analyserRef = useRef(null);

  useEffect(() => {
    if (activeTrackData) {
      setSource(playlist.find((el) => el.id === activeTrackData));
    }
  }, [activeTrackData]);

  useEffect(() => {
    if (Howler.ctx && !analyserRef.current) {
      const analyser = Howler.ctx.createAnalyser();
      Howler.masterGain.connect(analyser);
      analyser.fftSize = 2048;
      analyserRef.current = analyser;
    }
  }, [Howler.ctx]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const canvasCtx = canvas.getContext("2d");
      const HEIGHT = 100;
      const WIDTH = 700;
      canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

      const draw = () => {
        const drawVisual = requestAnimationFrame(draw);
        const analyser = analyserRef.current;
        if (analyser) {
          const bufferLength = analyser.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);
          analyser.getByteFrequencyData(dataArray);

          const average = dataArray.reduce((acc, curr) => acc + curr, 0) / bufferLength;
          const hue = average / 255 * 360;
          const backgroundColor = `hsl(${hue}, 50%, 50%)`;
          document.body.style.backgroundColor = backgroundColor;

          canvasCtx.fillStyle = backgroundColor;
          canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

          canvasCtx.fillStyle = 'blue';
          const barWidth = (WIDTH / bufferLength) * 1.5;
          let barHeight: number;
          let x = 0;

          for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i] / 3;

            canvasCtx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

            x += barWidth + 1;
          }
        }
      }

      if (isPlaying) {
        draw();
      }
    }
  }, [isPlaying]);

  return (
    <>{isPlaying ? <CanvasContainer ref={canvasRef} /> : ""}</>
  );
};
export default Vizulization;



const CanvasContainer = styled.canvas`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  top: 15%;
  /* left: 20%; */
  width: 100vw;
  z-index: -999;
`;
