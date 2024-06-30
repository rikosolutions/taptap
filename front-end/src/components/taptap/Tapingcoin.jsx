import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Restoretimer from './Restoretimer';
import AnimatedCounter from "./AnimatedCounter";
import moment from 'moment';
import axios from "../../utlis/axiosInstance";

import robot_1 from "../../assets/img/robot-1.png";
import robot_2 from "../../assets/img/robot-2.png";
import robot_3 from "../../assets/img/robot-3.png";
import robot_4 from "../../assets/img/robot-4.png";
import LogoImg from "../../assets/img/logo.png";
import CoinImg from "../../assets/img/coin.png";
import BoltIcon from "../../assets/img/bolt-icon.svg";

const Tapingcoin = ({ user, setUser ,defultVal, hasTimestampPassed, isRestore, setIsRestore}) => {
  const navigate = useNavigate();

  const coinRef = useRef(null);
  const clicksContainerRef = useRef(null);
  const syncTimeoutRef = useRef(null);
  const isMounted = useRef(true); 

  const robot = {
    0: robot_1,
    1: robot_1,
    2: robot_2,
    3: robot_3,
    4: robot_4,
    5: robot_4,
  };

  useEffect(() => {
    return () => {
      isMounted.current = false;
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, []);

  const resetSyncTimeout = () => {
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }
    syncTimeoutRef.current = setTimeout(syncData, 1000);
  };

  const syncData = async () => {
      await axios.post("/api/earn/upscore")
      .then((res)=>{})
      .catch((err) => {
        const { status } = err.response;
        if (status === 400) {
          var data = err.response.data;
          alert(data.message);
          return navigate("/game");
        }
      });

  };

  const handleClick = (count) => {
    if(hasTimestampPassed(user.restore_time)){
      const newScore = user.score + count * defultVal.clickcount;
      const newEnergy = user.energy - count * defultVal.clickcount;
  
      localStorage.setItem("score", newScore.toString());
      localStorage.setItem("energy_remaining", newEnergy > 0 ? newEnergy : 0);

      var restore_time = user.restore_time;
      if(newEnergy==0){
        restore_time = moment.utc().add(1, "hour").format('YYYY-MM-DD HH:mm:ss');
        localStorage.setItem("restore_time", restore_time);
      }

      setUser({
        ...user,
        score: newScore,
        energy: newEnergy < 0 ?  0 : newEnergy,
        restore_time:restore_time
      });
      if(newEnergy==0) setIsRestore(true);
      resetSyncTimeout();

    }else{
      setIsRestore(true);
    }  
  };

  const handleCoinAnimation = () => {
    if (coinRef.current) {
      coinRef.current.style.transform = 'scale(0.9)';
      setTimeout(() => {
        coinRef.current.style.transform = 'scale(1)';
      }, 50);
    }
  };

  const handleTouchStart = (e) => {
    const touchCount = e.touches.length;
      handleClick(touchCount);
      if(hasTimestampPassed(user.restore_time)){
        for (let i = 0; i < touchCount; i++) {
        handleCoinAnimation();
        const tg = window.Telegram.WebApp;
        tg.HapticFeedback.impactOccurred("medium");
        const touch = e.touches[i];
        const x = touch.clientX;
        const y = touch.clientY;
        const newClick = document.createElement('div');
        newClick.className = "absolute text-2xl font-sfSemi text-white z-20 flex";
        newClick.style.top = `${y - 300}px`;
        newClick.style.left = `${x - 100}px`;
        newClick.style.opacity = 1;
        newClick.style.transition = "opacity 1s, transform 1s";
        newClick.innerText = `+${defultVal.clickcount}`;
        clicksContainerRef.current.appendChild(newClick);
        setTimeout(() => {
          newClick.style.opacity = 0;
          newClick.style.transform = "translateY(-100px)";
        }, 0);
        setTimeout(() => {
          if (clicksContainerRef.current) {
            clicksContainerRef.current.removeChild(newClick);
          }
        }, 500);
        }
      }
  };

  const handleTimerExpire = () => {
    localStorage.setItem("energy_remaining",defultVal.enerylevel)
    setUser((prevUser) => {
      return {
        ...prevUser,
        energy: defultVal.enerylevel
      };
    });
    setIsRestore(false);
  };

  return (
    <>
      {user && (
        <div className="w-full">
          <div className="topbar bg-black/35 backdrop-blur-sm border-[#3131316c] border-[1px] w-full py-2 top-0 z-20 rounded-3xl ">
            <Link
              to="/game/reward"
              className="miner flex flex-col items-center justify-center absolute my-2 ml-4"
            >
              <img src={robot[0] ? robot[0] : robot[0]} alt="" className="w-8 h-8" />
              <h1 className="font-sfSemi text-sm text-white"></h1>
            </Link>
            <div className="flex flex-col items-center justify-center gap-2">
              <h1 className="font-sfSemi text-sm text-white">YOU'VE EARNED</h1>
              <h1 className="font-sfSemi text-2xl text-white flex flex-row gap-2 items-center justify-center">
                <AnimatedCounter from={parseInt(user.score) - 5} to={parseInt(user.score)} />
                <img src={LogoImg} className="w-8 h-8" />
              </h1>
            </div>
          </div>
          <div className="flex justify-center items-center mt-5">
            <div className="relative flex justify-center items-center" ref={clicksContainerRef}>
              <motion.img
                ref={coinRef}
                src={CoinImg}
                alt="Coin"
                className="img-fluid animate__animated animate__bounce small:w-52 small:h-52 h-64 w-64 z-10 rounded-full select-none"
                onTouchStart={handleTouchStart}
              />
              <div className="h-52 w-52 bg-[#0ff37969] rounded-full absolute top-1/2 -translate-y-1/2 z-0 blur-2xl left-1/2 -translate-x-1/2"></div>
            </div>
          </div>
          <div className="rank flex flex-row gap-2 items-center justify-center mt-10 small:mt-4">
            <div className="progressbar w-60 rounded-full relative h-3 bg-[#050F08]">
              <div
                className="h-full bg-gradient-to-r from-[#0FF378] to-[#6ABE6A] bottom-0 rounded-full"
                style={{
                  width: `${!isRestore ? (Math.min(Math.max(((user.energy ? user.energy : defultVal.enerylevel) / 2000) * 100, 0), 100)) : 0}%`,
                }}
              ></div>
            </div>
            <h1 className="text-sm text-[#0FF378] flex flex-row items-center gap-1">
              {!isRestore ? (
                <>
                  {user.energy} <img src={BoltIcon} className="w-3 h-4" alt="Bolt Icon" />
                </>
              ) : (
                <Restoretimer enery={defultVal.enerylevel} targetTime={user.restore_time} onTimerExpire={handleTimerExpire} />
              )}
            </h1>
          </div>
        </div>
      )}
    </>
  );
};

export default Tapingcoin;
