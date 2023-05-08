import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { Howl, Howler, HowlOptions } from "howler";
import styled from "styled-components";

const EQ = ({ sound }) => {
  const eq = useRef<BiquadFilterNode>();

  const [freqSettings, setFreqSettings] = useState<
    Array<{ type: string; value: number }>
  >([]);

  const EQInitial = freqSettings.reduce(
    (init, item) => ({
      ...init,
      [item.type]: item.value / 2,
    }),
    {
      lowest: 0,
      low: 0,
      mid: 0,
      high: 0,
      highest: 0,
    }
  );

  const [eqSetting, setEqSetting] = useState<{}>(EQInitial);
  const [isEQVisible, setIsEQVisible] = useState(false);

  const handleEQChange = useCallback((type: string, value: number) => {
    if (eq.current) {
      const newFreqSettings = [...freqSettings];
      const index = newFreqSettings.findIndex((item) => item.type === type);
      if (index >= 0) {
        newFreqSettings[index].value = value;
      } else {
        newFreqSettings.push({ type, value });
      }
      setFreqSettings(newFreqSettings);

      const newEQSetting = { ...eqSetting, [type]: value };
      setEqSetting(newEQSetting);

      eq.current.disconnect();

      eqSliders.forEach(({ type, data }) => {
        const freqValue =
          newFreqSettings.find((item) => item.type === type)?.value ?? 0;
        const gainValue = freqValue * 2;
        const eqFilter = Howler.ctx.createBiquadFilter();
        eqFilter.frequency.setValueAtTime(data, Howler.ctx.currentTime);
        eqFilter.gain.setValueAtTime(gainValue, Howler.ctx.currentTime);
        eqFilter.type = "peaking";
        eq.current.connect(eqFilter).connect(Howler.ctx.destination);
      });
    }
  }, [eq, eqSetting, freqSettings]);

  const eqSliders = useMemo(() => [
    { type: "lowest", data: 100 },
    { type: "low", data: 300 },
    { type: "mid", data: 1000 },
    { type: "high", data: 3000 },
    { type: "highest", data: 10000 },
  ], []);

  useEffect(() => {
    // Create EQ instance
    const eqInstance = Howler.ctx.createBiquadFilter();
    eqInstance.type = "peaking";
    eqInstance.frequency.value = 1000;
    eqInstance.gain.value = 0;
    eqInstance.Q.value = 1;
    eq.current = eqInstance;

    // Connect sound to EQ instance
    sound.on("load", () => {
      sound._sounds[0]._node.connect(eqInstance);
      eqInstance.connect(Howler.ctx.destination);
    });
  }, [sound, eq]);


  return (
    <>
      <StyledButton onClick={() => setIsEQVisible(!isEQVisible)}>
        {isEQVisible ? "Hide EQ" : "Show EQ"}
      </StyledButton>

      {isEQVisible && (
        <EQContainer>
          {eqSliders.map((slider) => (
            <EQSliderContainer>
              <EQSliderLabel>{slider.data}</EQSliderLabel>
              <EQSlider
                key={slider.type}
                type="range"
                min="-12"
                max="12"
                step="0.1"
                value={eqSetting[slider.type]}
                onChange={(e) =>
                  handleEQChange(slider.type, parseFloat(e.target.value))
                }
              />
            </EQSliderContainer>
          ))}
        </EQContainer>
      )}
    </>
  );
};
export default EQ;

const StyledButton = styled.button`
  position: fixed;
  top: 1%;
  right: 50px;
  padding: 10px;
  background-color: #3a3b3d;
  border: 2px solid #3a3b3d;
  outline: none;
  border-radius: 10px;
  cursor: pointer;
  z-index: 1;
  color: white;
  font-size: 14px;
  opacity: 0.8;
  width: 10vw;
`;

const EQContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #121212;
  border: 2px solid #000;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  width: 90%;
  max-width: 55vw;
  height: 30vh;
  opacity: 0.95;
`;

const EQSlider = styled.input`
  -webkit-appearance: none;
  width: 100%;
  height: 0.7vw;
  border-radius: 5px;
  background-color: #616161;
  outline: none;
  opacity: 0.7;
  -webkit-transition: 0.2s;
  transition: opacity 0.2s;
  transform: rotate(-90deg);

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 1.2vw;
    height: 1.2vw;
    border-radius: 50%;
    background-color: #fff;
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 1.2vw;
    height: 1.2vw;
    border-radius: 50%;
    background-color: #fff;
    cursor: pointer;
  }
`;

const EQSliderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const EQSliderLabel = styled.div`
  color: #fff;
  font-size: 12px;
  width: 50px;
  font-size: 12px;
  text-align: center;
  transform: translateY(-5vw);

`;
