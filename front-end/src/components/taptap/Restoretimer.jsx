import React, { useState, useEffect } from 'react';
import moment from 'moment';
import {  useNavigate } from "react-router-dom";
import axios from "../../utlis/axiosInstance";

const Restoretimer = ({ energy, targetTime , onTimerExpire}) => {
  
  const calculateTimeRemaining = (timestamp) => {
    const now = moment.utc();
    const target = moment.utc(timestamp);

    if (!target.isValid()) {
      return 0;
    }

    const difference = target.diff(now, "seconds");
    return difference > 0 ? difference : 0;
  };

  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining(targetTime));

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newTimeRemaining = calculateTimeRemaining(targetTime);
      if(newTimeRemaining > 0){
        setTimeRemaining(newTimeRemaining);
      }else{ 
        clearInterval(intervalId);
        onTimerExpire()
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [targetTime]);

  function convertSecondsToTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedTime = `${String(hours).padStart(2, "0")}:${String(
      minutes
    ).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;

    return formattedTime;
  }


  return (
    <span>{timeRemaining <=0 ? energy : convertSecondsToTime(timeRemaining)}</span>
  );
};

export default Restoretimer;
