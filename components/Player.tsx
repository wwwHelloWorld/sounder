import styled from "styled-components";

import "./PlayerControls";
import PlayerControls from "./PlayerControls";
import { useSelector, useDispatch } from "react-redux";
import { setActiveTrack, deleteTrack } from "../store/reducers";

const Player = () => {
  const sources = useSelector((store: any) => store.playlist.playlistTracks);
  const active = useSelector((store: any) => store.playlist.activeTrack);
  const dispatch = useDispatch();

  const trackClickHandler = (id) => {
    dispatch(setActiveTrack({ id }));
    console.log("ACTIVE TRACK", active);
  };

  const trackDeleteHandler = (id) => {
    dispatch(deleteTrack({ id }));
    console.log("ACTIVE TRACK", active);
  };

  console.log(sources);
  return (
    <>
      <PlayerContainer>
        <TrackWrapper>
          {sources.length
            ? sources.map((data) => (
                <TrackRow key={data.id}>
                  <Name
                    onKeyDown={() => trackClickHandler(data.id)}
                    onClick={() => trackClickHandler(data.id)}
                  >
                    {data.name}
                  </Name>
                  <Delete onClick={() => trackDeleteHandler(data.id)}>X</Delete>
                </TrackRow>
              ))
            : "no song"}
        </TrackWrapper>
      </PlayerContainer>
      <PlayerControls />
    </>
  );
};

export default Player;

const PlayerContainer = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-style: inherit;
`;

const TrackWrapper = styled.div`
  overflow: auto;
  max-height: 150px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: start;
  text-decoration: inherit;
  font-size: 11px;
`;

const TrackRow = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const Name = styled.div`
  font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
    "Lucida Sans", Arial, sans-serif;
`;
const Delete = styled.div`
  color: blue;
  padding-left: 10px;
`;
