import React, { useState, useEffect } from "react";
import {  useNavigate } from "react-router-dom";
import _ from "lodash";
import moment from "moment";


import GameLayout from "../layout/GameLayout";
import Error500 from "../error/Error500";

import Tapingcoin from "../../components/taptap/Tapingcoin";
import LoadingScreen from "../../components/taptap/LoadingScreen";
import Meteor from "../../components/taptap/Meteor";

import PlayIcon from "../../assets/img/play-icon.svg";
import coinBackgroundImg from "../../assets/img/coin-background.png";
import heroBackgroundImg from "../../assets/img/background-hero.png";
import tapaudio from "../../assets/sounds/mixkit-arcade-game-jump-coin-216.wav";

import { initializeAudio, playAudio, stopAudio } from "../../utlis/audioUtils";


const defultVal = {
  clickcount: 1,
  enerylevel: 2000,
  restoretime: "30sec",
  gamelevel: 1
};

function Earn() {
  const [user, setUser] = useState({});
  const [isError, setIsError] = useState(false);
  const [isRestore, setIsRestore] = useState(false);

  const navigate = useNavigate();

  const defultVal = {
    clickcount: 1,
    enerylevel: 2000,
    restoretime: "1hr",
    gamelevel: 1
  };

  function hasTimestampPassed(restore_time) {
    if(restore_time==="") return true;
    var diffTime = moment.utc().diff(moment.utc(restore_time), "seconds");
    return(diffTime >= 0);
  }

  function init(){
    var score = parseInt(localStorage.getItem("score"));
    var miner_level = parseInt(localStorage.getItem("miner_level"));
    var restore_time = localStorage.getItem("restore_time");
    var energy = localStorage.getItem("energy_remaining");

    if(_.isNil(energy) || isNaN(energy)){
      energy = defultVal.enerylevel;
      localStorage.setItem("energy_remaining", energy);
    }

    if(_.isNil(restore_time) || (restore_time !== "" && !moment(restore_time, moment.ISO_8601, true).isValid())){
      restore_time = moment.utc().subtract(1, "hour").format('YYYY-MM-DD HH:mm:ss');
      localStorage.setItem("restore_time", restore_time);
    }

    if(isNaN(miner_level) || isNaN(score)) return setIsError(true);

    if(energy==0 && hasTimestampPassed(restore_time)){
      energy = defultVal.enerylevel;
      localStorage.setItem("energy_remaining", energy);
    }

    const local = {
      score,
      miner_level,
      restore_time,
      energy,
    };
    setUser(local);

    if(!hasTimestampPassed(restore_time)){
      setIsRestore(true);
    }
  }

  const initAudio = async () => {
    try {
      await initializeAudio(tapaudio);
    } catch (error) {
      console.error("Error initializing audio:", error);
    }
  };
  
  useEffect(() => {
    init();
    initAudio();
    return () => {
      stopAudio();
      console.log("page cleanup");
    };
  }, []);

  console.log("<--Earn page render -->");

  return (
    <>
    {isError === true && <Error500 />}
    {isError === false &&
      <GameLayout>
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
                <Tapingcoin user={user} setUser={setUser}  defultVal={defultVal} hasTimestampPassed={hasTimestampPassed} isRestore={isRestore} setIsRestore={setIsRestore} />
              )}
        </div>
      </GameLayout>
    }
    </>
  );
}

export default Earn;
