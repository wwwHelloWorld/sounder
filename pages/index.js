import Head from "next/head";
import styled from "styled-components";
import Image from "next/image";
import { useFileUpload } from "use-file-upload";

import Player from "../components/Player";
import Vizualization from "../components/Vizualization";
import { useDispatch } from "react-redux";
import { addTrack } from "../store/reducers";

export default function Home() {
  const [files, selectFiles] = useFileUpload();

  const dispatch = useDispatch();

  const uploadHandler = () => {
    selectFiles({ multiple: true, accept: "audio/*" }, (files) => {
      files.map(({ source, name, size, file }) => {
        dispatch(addTrack({ source, name, size }));
      });
    });
  };

  return (
    <>
      <Head>
        <title>Sounder</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Main>
        {files ? (
          <>
            <LeftSpeaker>
              <Image
                src="/leftSpeaker.png"
                alt="Sounder"
                width="500"
                height="318"
              />
            </LeftSpeaker>
            <RightSpeaker>
              <Image
                src="/rightSpeaker.png"
                alt="Sounder"
                width="500"
                height="318"
              />
            </RightSpeaker>
          </>
        ) : (
          ""
        )}
        <Container>
          <Casette>
            <Image src="/casette.png" alt="Sounder" width="100" height="100" />
          </Casette>
          <H1>Sounder</H1>
          <UploadContainer>
            <button onClick={uploadHandler}>Add Tracks</button>
          </UploadContainer>
        </Container>
      </Main>
      {files ? <Player /> : ""}
    </>
  );
}

const H1 = styled.h1`
  font-size: 35px;
  margin-top: 0px;
`;

const Main = styled.main`
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  position: relative;
`;

const Container = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
`;

const UploadContainer = styled.div`
  display: flex;
  gap: 20px;
  flex-direction: column-reverse;
  align-items: baseline;
  justify-content: center;
`;
const LeftSpeaker = styled.div`
  position: absolute;
  top: 45%;
  left: -5%;
  animation: showLeft 3s;

  @keyframes showLeft {
    0% {
      left: -100%;
    }

    50% {
      left: -100%;
    }

    100% {
      left: -5%;
    }
  }
`;
const RightSpeaker = styled.div`
  position: absolute;
  top: 45%;
  right: -5%;
  animation: showRight 3s;

  @keyframes showRight {
    0% {
      right: -100%;
    }

    50% {
      right: -100%;
    }

    100% {
      right: -5%;
    }
  }
`;

const List = styled.div`
  z-index: 999;
  width: 280px;
`;

const Casette = styled.div`
  animation: rotate infinite 3s;

  @keyframes rotate {
    0% {
      transform: rotate(20deg);
    }

    50% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(20deg);
    }
  }
`;
