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
        if( local.score == '' || local.energy > defultVal.enerylevel || local.energy_restore_time=='')
        {

          console.log("somethismng not good")
          navigate("/game");
          return

        }

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

<<<<<<< HEAD
  useEffect(() => {
    const fetchUser = async () => {
      const token = getAuth();
      const tgUser = getTGUser();

      const response = await axios.get(`/api/earn/getscore`,{
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("response==>",response)

      const res = response.data;
      const resdata = res.data;

      if (!resdata) {
        // navigate("/game");
        return;
      }else{

        

        setIsLoading(false)
      }

      const userData = resdata;
      setUser(userData);

      setGamelevel(userData.game_level);

      // console.log("ds",userData)
      // if(userData.points == 0){

      //   localStorage.setItem("energy",2000);
      //   localStorage.setItem("score",0);
      //   localStorage.setItem("lastSyncTime",null);
      //   localStorage.setItem("restoreTime",null);

      // }

      


      const storedEnergy = localStorage.getItem("energy");
      var storedPoints = localStorage.getItem("score");
      const lastSyncTime = localStorage.getItem("lastSyncTime");

      console.log("storedPoints==>",storedPoints)

     
      if(storedPoints==0){
        // localStorage.setItem("score",userData.points)
        storedPoints = userData.points
         
      }




      if (storedEnergy && storedPoints) {
        const now = Date.now();
        if (!lastSyncTime || (lastSyncTime && now - lastSyncTime > 2000)) {
          let tempLocalEn = localStorage.getItem("energy");
          let tempLocalPO = localStorage.getItem("score");
          await syncWithServer(tempLocalEn, tempLocalPO, userData.restore_time)
          .then(() => {
                      setLocalEnergy(tempLocalEn);
                      setLocalPoints(tempLocalPO);
                    });
        } else {
          const energy = storedEnergy;
          const points = storedPoints;
          if (energy !== null && points !== null) {
            setLocalEnergy(energy <= 0 ? defaultEnergyLevel : energy);
            setLocalPoints(points);
          } else {
            setLocalEnergy(defaultEnergyLevel);
            setLocalPoints(0);
          }
        }
      } else {
        const energy = userData.energy;
        const points = userData.points;
        if (energy !== null && points !== null) {
          setLocalEnergy(energy <= 0 ? defaultEnergyLevel : energy);
          setLocalPoints(points);
        } else {
          setLocalEnergy(defaultEnergyLevel);
          setLocalPoints(0);
        }
      }

      const storedRestoreTime = localStorage.getItem("restoreTime");
      

      if (storedRestoreTime && storedRestoreTime !== null) {
        const result = checkTime(storedRestoreTime);
        console.log("1")
        if (result !== null && result !== '') {
          console.log("2")
          setRestoreTime(result);
          const currentTime = moment.utc().format("YYYY-MM-DD HH:mm:ss");
          const duration = moment.duration(moment( localStorage.getItem("restoreTime")).diff(currentTime));
          setElapsedSeconds(duration.asSeconds());
          if(storedEnergy>0 ){
            setLocalEnergy(storedEnergy);
          }else{
            setLocalEnergy(0);
          }
          
        //  localStorage.getItem("restoreTime");
        console.log("result", localStorage.getItem("restoreTime"))
         setRestoreTime( localStorage.getItem("restoreTime"));
        } else {
          console.log("3")
          setRestoreTime('');
          setLocalEnergy(storedEnergy !== null ? storedEnergy : defaultEnergyLevel);
        }
      } else if (userData.restore_time && userData.restore_time !== null) {
        console.log("4")
        const result = checkTime(userData.restore_time);
        if (result !== null && result !== '') {
          setRestoreTime(result);
          console.log("5")
          if(userData.energy==0){
            console.log("from db 5")
            const currentTime = moment.utc().format("YYYY-MM-DD HH:mm:ss");
            
            console.log("userData.restore_time",userData.restore_time)

            const temp = moment(userData.restore_time).format("YYYY-MM-DD HH:mm:ss");
            console.log("temp",temp)

            const duration = moment.duration(moment(currentTime).diff(moment(temp))).asSeconds();
            setElapsedSeconds(duration);
            setLocalEnergy(userData.energy);
            setRestoreTime(userData.restore_time);

          }else{

            console.log("from db 5 relse")
            setLocalEnergy(userData.energy);
            setElapsedSeconds('')
            setRestoreTime(userData.restore_time);

          }
         
        } else {
          console.log("6")
          setRestoreTime('');
          setLocalEnergy(storedEnergy !== null ? storedEnergy : userData.energy || defaultEnergyLevel);
        }
      } else {
        console.log("7")
        setRestoreTime('');
        setElapsedSeconds(null);
        setLocalEnergy(storedEnergy !== null ? storedEnergy : defaultEnergyLevel);
      }
    };
    fetchUser();
  }, [!user, navigate]);

  const syncWithServer = async (energy, points, restore_time) => {
    const token = getAuth();
    if (user ) {

      if( points>0){
        await axios.post(
          `/api/game/upscore`,
          {
            score: 10000,
            energy_remaning: 100,
            restore_time:moment.utc().format("YYYY-MM-DD HH:mm:ss"),
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        
        localStorage.setItem("lastSyncTime", Date.now());
        
        console.log("reset")

      }else{
        if(user.points>0){
          // localStorage.setItem("score",user.points);
        }else{
          // localStorage.setItem("score",localPoints);
        }
        
      }
      

    }
  };
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds((prevSeconds) => {
        if (prevSeconds > 0) {
          return prevSeconds - 1;
        } else {
          setLocalEnergy(defaultEnergyLevel)
          clearInterval(interval);
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, []);

  const handleTap = (tapcount = 1) => {
    console.log("tab test", isActive, localEnergy, localPoints, user, restoreTime)

    if (localEnergy > 0) {
      const newEnergy = parseInt(localEnergy) - parseInt(tapcount);
      const newPoints = parseInt(localPoints) + parseInt(tapcount);

      setLocalEnergy(newEnergy);
      setLocalPoints((prevLocalPoints) => {
        setprePoint(prevLocalPoints);
        return newPoints;
      });
      setNewsCount(newPoints);
      localStorage.setItem("energy", newEnergy);
      // localStorage.setItem("score", newPoints);

      console.log("tap 1")

     
        console.log("tap 2")
        const currentUtcTime = moment.utc();
        const futureUtcTime = currentUtcTime.add(1, 'hours');
        const restoreTimess = futureUtcTime.format("YYYY-MM-DD HH:mm:ss");
        
        localStorage.setItem("restoreTime", restoreTimess);
        if(newPoints == 0){

        
          setRestoreTime(restoreTimess);
          setElapsedSeconds(3600);
        }
  
      

      setIsActive(true);
      playAudio();
    } else {
      console.log("tap 3")
      stopAudio();
    }
    console.log("effect test done", isActive, localEnergy, localPoints, user, restoreTime)
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')} hr`;
    } else if (mins > 0) {
      return `${mins}:${secs.toString().padStart(2, '0')} mins`;
    } else {
      return `${secs} secs`;
    }
  };

  useEffect(() => {
    if (localEnergy === 0 && restoreTime && elapsedSeconds == null) {
      const interval = setInterval(() => {
        const now = moment.utc().format("YYYY-MM-DD HH:mm:ss");
        console.log("restoreTime",restoreTime)
        console.log("now",now)
        // const lcaorestime = moment(restoreTime).utc().format("YYYY-MM-DD HH:mm:ss");
        // console.log("lcaorestime",lcaorestime)
        const remainingTime = moment.duration(moment(restoreTime).diff(moment(now))).asSeconds();
        console.log("remainingTime",remainingTime)
        if (remainingTime <= 0) {
          setLocalEnergy(defaultEnergyLevel);
          setRestoreTime(null);
          // localStorage.removeItem("restoreTime");
          clearInterval(interval); // Clear interval once the restore time has been processed
        } else {
          setElapsedSeconds(remainingTime);
        }
      }, 1000);

      // Clean up interval on component unmount or when conditions change
      return () => clearInterval(interval);
    }
  }, [localEnergy, restoreTime,elapsedSeconds]);

  useEffect(() => {
    let syncInterval;
    let inactivityTimer;

    const startSync = () => {
      clearInterval(syncInterval);
      syncInterval = setInterval(() => {
        syncWithServer(localEnergy, localPoints, restoreTime);
      }, 1500); // Sync every 4 seconds
    };

    const stopSync = () => {
      clearInterval(syncInterval);
    };

    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        setIsActive(false);
      }, 1000); // 5 seconds of inactivity
    };

    if (isActive) {
      startSync();
      resetInactivityTimer();
    } else {
      stopSync();
    }

    return () => {
      clearInterval(syncInterval);
      clearTimeout(inactivityTimer);
    };
  }, [isActive, localEnergy, localPoints, user, restoreTime]);

  useEffect(() => {
    const handleBeforeUnload = async () => {
      await syncWithServer(localEnergy, localPoints, restoreTime);
    };
    handleBeforeUnload()
    // window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [localEnergy, localPoints, user, restoreTime]);

  const handleTouchStart = (e) => {
    const touchCount = e.touches.length;
    for (let i = 0; i < touchCount; i++) {
      handleTap(touchCount);
      handleCoinAnimaton();

      const tg = window.Telegram.WebApp;
      tg.HapticFeedback.impactOccurred("medium");
      const touch = e.touches[i];
      const x = touch.clientX;
      const y = touch.clientY;

      const newClick = {
        id: Math.random(),
        x,
        y,
      };

      setClicks((prevClicks) => [...prevClicks, newClick]);

      setTimeout(() => {
        setClicks((prevClicks) =>
          prevClicks.filter((click) => click.id !== newClick.id)
        );
      }, 1000);
    }
  };

  const handleCoinAnimaton = () => {
    setScale(0.9);
    setTimeout(() => setScale(1), 50); // Reset to original scale after 100ms
  };

  const number = 20;
  useEffect(() => {
    const styles = [...new Array(number)].map(() => ({
      top: 0,
      left: Math.floor(Math.random() * window.innerWidth) + "px",
      animationDelay: Math.random() * 1 + 0.2 + "s",
      animationDuration: Math.floor(Math.random() * 8 + 2) + "s",
    }));
    setMeteorStyles(styles);
  }, [number]);
=======
  console.log("<--Earn page render -->");
>>>>>>> 59e75b5 (Updated page)

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
