import React, { useState, useEffect } from "react";
import {  useNavigate } from "react-router-dom";


import GameLayout from "../layout/GameLayout";

import Tapingcoin from "../../components/taptap/Tapingcoin";
import LoadingScreen from "../../components/taptap/LoadingScreen";
import Meteor from "../../components/taptap/Meteor";

import PlayIcon from "../../assets/img/play-icon.svg";
import coinBackgroundImg from "../../assets/img/coin-background.png";
import heroBackgroundImg from "../../assets/img/background-hero.png";
import tapaudio from "../../assets/sounds/mixkit-arcade-game-jump-coin-216.wav";

import { initializeAudio, playAudio, stopAudio } from "../../utlis/audioUtils";
import { getBigInt } from "../../utlis/helperfun";

function Earn() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState({});

  const navigate = useNavigate();

  const defultVal = {
    clickcount: 1,
    enerylevel: 2000,
    restoretime: "30sec",
    gamelevel: 1
  };
  
  useEffect(() => {

        // inti the audio
    const initAudio = async () => {
      try {
        await initializeAudio(tapaudio);
      } catch (error) {
        console.error("Error initializing audio:", error);
      }
    };
  
    const fetchUserDetails = async () => {
      try {

        const local = {
          score: getBigInt(localStorage.getItem("score")),
          miner_level: localStorage.getItem("miner_level"),
          energy_restore_time: localStorage.getItem("restore_time"),
          energy: parseInt( localStorage.getItem("energy_remaning")),
        };

        // TODO:check is this need 
        // if( local.score == '' || local.energy > defultVal.enerylevel || local.energy_restore_time=='')
        // {

        //   console.log("somethismng not good")
        //   navigate("/game");
        //   return

        // }

        setUser(local);
        setIsLoading(false);
        
      } catch (error) {
        console.error("Error in endpoint:", error);
        throw new Error("Error in endpoint", error);
      }
    };

    fetchUserDetails();
    initAudio();
    return () => {
      stopAudio();
      console.log("page cleanup");
    };
  }, []);

  console.log("<--Earn page render -->");

  return (
    <GameLayout>
      <LoadingScreen isloaded={isLoading} reURL={""} />
      {!isLoading && (
        <>
          <div
            className="hero w-full h-24 min-h-24 rounded-3xl bg-no-repeat bg-cover flex flex-col items-center justify-center"
            style={{ backgroundImage: `url(${heroBackgroundImg})` }}
          >
            <span className="flex flex-row items-center justify-center gap-2 text-xl font-black bg-[#181A1B] rounded-full text-[#0FF378] py-2 px-2 pr-4">
              <img
                src={PlayIcon}
                className="w-8 h-8 object-contain rounded-full"
                alt=""
              />
              PLAY
            </span>
          </div>
          <div
            className="coinsection w-full bg-black flex flex-col items-center justify-center p-4 relative select-none bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${coinBackgroundImg})`,
              backgroundBlendMode: "hard-light",
              margin: "0px",
            }}
          >
            <Meteor />
            {user.score != null && (
              <Tapingcoin data={user} defultVal={defultVal}/>
            )}
          </div>
        </>
      )}
    </GameLayout>
  );
}

export default Earn;
