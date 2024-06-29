import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "../../utlis/axiosInstance";
import moment from "moment";
import numeral from "numeral";
import _ from "lodash";

import TGAuth from "../../components/taptap/TGAuth";
import Error500 from "../error/Error500";
import Drawer from "../../components/taptap/Drawer";

import { setItems, getScore } from "../../utlis/localstorage";

import minerbg from "../../assets/img/mine-bg.png";
import stars from "../../assets/img/stars-robo.svg";
import energy from "../../assets/img/energy.svg";
import clock from "../../assets/img/clock.svg";
import upgrade from "../../assets/img/upgrade.svg";
import robot_1 from "../../assets/img/robot-1.png";
import robot_2 from "../../assets/img/robot-2.png";
import robot_3 from "../../assets/img/robot-3.png";
import robot_4 from "../../assets/img/robot-4.png";

const robot = {
  0: robot_1,
  1: robot_1,
  2: robot_2,
  3: robot_3,
  4: robot_4,
  5: robot_4,
};

function RoboMine() {
  const navigate = useNavigate();

  const [minerLevel, setMinerLevel] = useState(0);
  const [lastMineAt, setLastMineAt] = useState(null);
  const [countDown, setCountDown] = useState(false);
  const [isError, setIsError] = useState(false);

  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");

  function getRobot() {
    let index = 0;
    if (minerLevel >= 1 && minerLevel <= 25) {
      index = Math.floor((minerLevel - 1) / 5) + 1;
    }
    return robot[index] ? robot[index] : robot_1;
  }

  function getSeconds(lastMineAt) {
    let endTime = moment.utc(lastMineAt).add(3, "hours");
    let seconds = endTime.diff(moment.utc(), "seconds");

    if (seconds > 0) return seconds;
    return 0;
  }

  function convertSecondsToTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedTime = `${String(hours).padStart(2, "0")}:${String(
      minutes
    ).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;

    return formattedTime;
  }

  function getCalcScore(minerLevel, next = true) {
    if (next) minerLevel = minerLevel + 1;
    var requiredScore = 0;
    var readScore = "";
    var claimScore = 0;
    var readClaim = "";
    if (minerLevel >= 1 && minerLevel <= 25) {
      const v = 20000;
      const r = 2;
      requiredScore = v * Math.pow(r, minerLevel - 1);
      readScore = numeral(requiredScore).format("0a");
      claimScore = requiredScore * 0.75;
      readClaim = numeral(claimScore).format("0a");
    }

    return [requiredScore, readScore, claimScore, readClaim];
  }

  function init() {
    let flag = true;
    let minerLevel = localStorage.getItem("miner_level");
    let lastMineAt = localStorage.getItem("last_mine_at");
    if (_.isNil(minerLevel) || isNaN(parseInt(minerLevel))) flag = false;

    if (
      _.isNil(lastMineAt) ||
      (lastMineAt !== "" &&
        !moment(lastMineAt, moment.ISO_8601, true).isValid())
    )
      flag = false;

    if (flag === false) navigate("/game");
    let seconds = getSeconds(lastMineAt);
    setMinerLevel(parseInt(minerLevel));
    setLastMineAt(lastMineAt);
    setCountDown(seconds);
  }

  useEffect(() => {
    init();
    let intervalId = setInterval(function () {
      setCountDown((prevCountDown) => {
        if (prevCountDown > 0) {
          return prevCountDown - 1;
        }
        return prevCountDown;
      });
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const tg = window.Telegram.WebApp;
    tg.expand();

    tg.BackButton.show();
    tg.BackButton.onClick(() => {
      navigate(-1);
      tg.BackButton.hide();
    });
  });

  function handleUpgrade() {
    const [requiredScore, scoreRead, claimScore, readClaim] =
      getCalcScore(minerLevel);
    const score = getScore();
    const nextMinerLevel = minerLevel + 1;
    if (score !== false) {
      if (requiredScore <= score) {
        axios
          .get("/api/reward/upgrade")
          .then((res) => {
            var data = res.data;
            if (data.sync_data) {
              setItems(data.sync_data);
              init();
              setContent(`Upgraded to level ${nextMinerLevel}`);
              setOpen(true);
            } else {
              throw new Error("Sync data is not found");
            }
          })
          .catch((err) => {
            const { status } = err.response;
            if (status === 400) {
              var data = err.response.data;
              alert(data.message);
              return navigate("/game");
            }
            setIsError(true);
          });
      } else {
        setContent(`score is lower than the required score (${scoreRead})`);
        setOpen(true);
      }
    } else {
      setIsError(true);
    }
  }

  function handleClaim() {
    const [requiredScore, scoreRead, claimScore, readClaim] = getCalcScore(
      minerLevel,
      false
    );
    axios
      .get("/api/reward/claim")
      .then((res) => {
        var data = res.data;
        if (data.sync_data) {
          setItems(data.sync_data);
          init();
          setContent(`${readClaim} claimed`);
          setOpen(true);
        } else {
          throw new Error("Sync data is not found");
        }
      })
      .catch((err) => {
        const { status } = err.response;
        if (status === 400) {
          var data = err.response.data;
          alert(data.message);
          return navigate("/game");
        }
        setIsError(true);
      });
  }

  return (
    <TGAuth>
      {isError === true && <Error500 />}
      {isError === false && (
        <>
          <Drawer open={open} setOpen={setOpen}>
            <div className="flex flex-col items-center justify-center px-4 gap-2">
              <h2 className="text-white font-sfSemi text-2xl">{content}</h2>
            </div>
          </Drawer>
          <div
            className="RoboMine relative h-screen bg-black bg-cover bg-no-repeat flex items-center justify-center px-2 flex-col py-4 bg-top pt-10"
            style={{ backgroundImage: `url(${minerbg})` }}
          >
            <h1 className="font-bold text-4xl text-white">ROBO MINER</h1>
            <p className=" text-xl text-white">Upgrade your robot</p>
            <div className="robotcontainer relative flex">
              <img
                src={getRobot()}
                className="h-80 w-auto z-20 small:h-60 small:w-60"
                alt=""
              />
              <motion.img
                src={stars}
                className="absolute  h-80 w-80 small:h-60 small:w-60"
                alt=""
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                initial={{ rotate: 0 }}
              />
              <motion.img
                src={stars}
                className="absolute  h-80 w-80 small:h-60 small:w-60"
                alt=""
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                initial={{ rotate: 0 }}
              />
              <div className="h-52 w-52 bg-[#39ff9571] rounded-full absolute top-1/2 -translate-y-1/2 z-0 blur-2xl left-1/2  -translate-x-1/2"></div>
            </div>
            <div className="stats w-full h-full bg-[#0b0b0b4f] backdrop-blur-md border-[1px] border-[#313131] rounded-3xl flex flex-col items-center justify-center gap-2">
              <div className="flex flex-row items-center w-5/6 justify-between gap-4">
                <img src={energy} className="w-6 h-6" alt="" />
                <div className="flex flex-col items-center justify-center w-full gap-1">
                  <div className="flex flex-row items-center justify-between w-full">
                    <h1 className="text-white font-bold text-sm">Energy</h1>
                    <h1 className="text-white font-bold text-sm">
                      {minerLevel}
                    </h1>
                  </div>
                  <div className="progressbar w-full rounded-full relative  h-3 bg-[#050F08] border-[#45D470] border-[1px]">
                    <div
                      className="absolute  h-full bg-gradient-to-r from-[#0FF378] to-[#6ABE6A] bottom-0 rounded-full"
                      style={{ width: `${minerLevel * 4}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="flex flex-row items-center justify-center gap-4">
                {minerLevel === 0 && (
                  <>
                    <button
                      onClick={handleUpgrade}
                      className="claim bg-[#0FF378] flex flex-row items-center justify-center gap-2 px-6 py-4 mt-2 rounded-2xl text-xl font-bold "
                    >
                      Unlock {getCalcScore(minerLevel)[1]}
                    </button>
                  </>
                )}
                {minerLevel > 0 && (
                  <>
                    {minerLevel < 25 && (
                      <button
                        onClick={handleUpgrade}
                        className="claim bg-[#0FF378] flex flex-row items-center justify-center gap-2 px-6 py-4 mt-2 rounded-2xl text-xl font-bold "
                      >
                        <img src={upgrade} className="h-6 w-6" />
                        Upgrade
                      </button>
                    )}

                    {countDown !== false && countDown <= 0 && (
                      <button
                        onClick={handleClaim}
                        className="claim bg-[#0FF378] flex flex-row items-center justify-center gap-2 px-6 py-4 mt-2 rounded-2xl text-xl font-bold "
                      >
                        Claim
                      </button>
                    )}
                    {countDown !== false && countDown > 0 && (
                      <button className="claim bg-[#0FF378] flex flex-row items-center justify-center gap-2 px-6 py-4 mt-2 rounded-2xl text-xl font-bold ">
                        <img src={clock} className="h-6 w-6" />
                        {convertSecondsToTime(countDown)}
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </TGAuth>
  );
}

export default RoboMine;
