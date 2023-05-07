import { Howl, Howler } from "howler";
import styled from "styled-components";
import Image from "next/image";
import { memo, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Vizulization from "./Vizualization";
import EQ from "./EQ";

const PlayerControls = () => {
  const [playing, setPlaying] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);
  const [intervalId, setIntervalId] = useState<any>(0);
  const [timerProgres, setTimerProgres] = useState<number>(0);
  const [progresIntervalId, setProgresIntervalId] = useState<any>(0);
  const [isEnd, setIsEnd] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(50);
  const [stereo, setStereo] = useState<number>(50);
  const [source, setSource] = useState<any>("");
  const [duration, setDuration] = useState<number>(0);

  const activeTrackData = useSelector(
    (store: any) => store.playlist.activeTrack
  );
  const playlist = useSelector((store: any) => store.playlist.playlistTracks);

  useEffect(() => {
    if (activeTrackData) {
      setSource(playlist.find((el: any) => el.id === activeTrackData));
      updateTrack();
    }
  }, [activeTrackData]);

  const sound = useMemo(
    () =>
      new Howl({
        src: [source.source],
        autoplay: false,
        preload: true,
        volume: 1,
        format: ["mp3"],
        onend: function () {
          console.log("Finished!");
          setIsEnd(true);
        },
        onload: () => {
          URL.revokeObjectURL(source.source);
        },
      }),
    [source]
  );

  const step = sound.duration() / 100;
  const progresStep = step * 1000;

  useEffect(() => {
    if (progresStep && playing) {
      const newProgresIntervalId = setInterval(() => {
        setTimerProgres((prevCount) => prevCount + 1);
      }, progresStep);

      setProgresIntervalId(newProgresIntervalId);
    }
  }, [progresStep, playing]);

  const initialPlayerState = () => {
    setPlaying(false);
    setTimer(0);
    setTimerProgres(0);
  };

  const updateTrack = () => {
    sound.stop();
    setDuration(Math.round(sound.duration()));
  };

  const stopTimers = () => {
    clearInterval(intervalId);
    clearInterval(progresIntervalId);
  };

  useEffect(() => {
    if (sound.duration() && timer >= sound.duration()) {
      stopTimers();
      initialPlayerState();
    }
  }, [timer]);

  useEffect(() => {
    stopTimers();
    initialPlayerState();
    sound.stop();
  }, [source]);

  useEffect(() => {
    sound.volume(volume / 100);
  }, [volume]);

  useEffect(() => {
    let stereoData = 0;
    if (stereo < 50) {
      stereoData = -(1 - stereo / 50);
    } else if (stereo > 50) {
      stereoData = stereo / 50;
    } else {
      stereoData = 0;
    }
    sound.stereo(stereoData);
  }, [stereo]);

  const timerHandler = (data: string) => {
    if (data === "pause") {
      stopTimers();
      setIntervalId(0);
      setProgresIntervalId(0);
      return;
    }

    const newIntervalId = setInterval(() => {
      setTimer((prevCount) => prevCount + 1);
    }, 1000);

    setIntervalId(newIntervalId);
  };
  console.log(timerProgres);

  const handlePlayer = () => {
    if (!playing && activeTrackData) {
      sound.play();
      setPlaying(true);
      timerHandler("start");
      return;
    }
    if (!playing && !activeTrackData) {
      alert("CHOOSE A TRACK PLEASE!!!");
    }
    sound.pause();
    setPlaying(false);
    timerHandler("pause");
  };

  const progressHandler = (_e, i: number) => {
    const steps = step * i;
    const progresSteps = Math.round((progresStep * i) / 1000);
    setTimer(Math.round(steps));
    setTimerProgres(Math.round(i));
    sound.seek(Math.round(progresSteps));
    console.log(progresSteps);
  };

  const volumeHandler = (e) => {
    setVolume(e.target.value);
  };
  const stereoHandler = (e) => {
    setStereo(e.target.value);
  };
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <>
      <Vizulization howler={Howler} isPlaying={playing} />
      <EQ sound={sound} />
      <PlayerControlsWrapper>
        <PlayerName>{source.name}</PlayerName>
        <ControlPanel>
          <Volume>
            <label htmlFor="volume">Volume</label>
            <input
              id="valume"
              type="range"
              value={volume}
              step={1}
              onChange={(e) => volumeHandler(e)}
            />
          </Volume>
          <Stereo>
            <label htmlFor="stereo">Stereo</label>
            <input
              id="stereo"
              type="range"
              value={stereo}
              step={1}
              onChange={(e) => stereoHandler(e)}
            />
          </Stereo>
        </ControlPanel>
        <>
          <PlayerControlsElements>
            <button
              style={{ background: '#f5deb3', flexBasis: "10%", opacity: activeTrackData ? 1 : 0.3 }}
              onClick={handlePlayer}
            >
              <div>
                <Image
                  src="/play-pause.svg"
                  alt="play/pause"
                  width="85"
                  height="45"
                />
              </div>
              <span style={{ fontWeight: playing ? "bold" : "lighter" }}>
                Play
              </span>
              /
              <span style={{ fontWeight: playing ? "lighter" : "bold" }}>
                Pause
              </span>
            </button>
            <ProgresLineContainer>
              {new Array(100).fill(1).map((el, i) => (
                <ProgresLine
                  key={i}
                  onClick={(e) => progressHandler(e, i)}
                  style={{
                    background: `${
                      i <= Math.round(timerProgres) && !(i % 2)
                        ? "blue"
                        : i <= Math.round(timerProgres) && i % 2
                        ? "darkblue"
                        : "lightgrey"
                    }`,
                  }}
                ></ProgresLine>
              ))}
            </ProgresLineContainer>
            <TimerData>
              <div>{formatTime(timer)}</div>
              {/* <div>{`- ${Math.round(sound.duration() - timer)}`}</div> */}
            </TimerData>
          </PlayerControlsElements>
        </>
      </PlayerControlsWrapper>
    </>
  );
};

const PlayerControlsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  /* height: 25vh; */
  background-color: #121212;
  border: 2px solid #000;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.8);
  position: fixed;
  bottom: 0;
  opacity: 0.9;
  min-height: 200px;
  animation: moveUp 2s;

  @keyframes moveUp {
    from {
      transform: translate(0, 100%);
    }
    to {
      transform: translate(0, 0);
    }
  }
`;

const PlayerControlsElements = styled.div`
  width: 100%;
  margin-left: 5%;
  display: flex;
  flex-direction: row;
  gap: 30px;
  padding-bottom: 5vh;
`;

const PlayerName = styled.h3`
  font-size: clamp(17px, 1.5vw, 25px);
  text-align: center;
  margin: 15px 0px;
  color: wheat;
`;

const ProgresLineContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.2%;
`;

const ProgresLine = styled.div`
  width: 10px;
  height: 50px;
`;

const TimerData = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  color: wheat;
`;

const ControlPanel = styled.div`
  display: flex;
  gap: 20px;
  justify-content: space-between;
`;

const Control = styled.div`
  width: 20%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding-bottom: 20px;
`;
const Volume = styled(Control)`
  color: wheat;
  text-decoration: inherit;
`;
const Stereo = styled(Control)`
  color: wheat;
  text-decoration: inherit;
`;

const Speed = styled(Control)`
  color: wheat;
  text-decoration: inherit;
`;

export default memo(PlayerControls);
