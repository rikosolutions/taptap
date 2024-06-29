import React, { useState, useEffect } from 'react';
import moment from 'moment';
import {  useNavigate } from "react-router-dom";
import axios from "../../utlis/axiosInstance";

const Restoretimer = ({ enery, targetTime ,onTimerExpire}) => {
  
  const calculateTimeRemaining = (timestamp) => {
    
    const now = moment.utc();
    const target = moment.utc(parseInt(timestamp));

    if (!target.isValid()) {
      console.error('Invalid target time');
      return 0;
    }

    const difference = target.diff(now);

    
    // console.log(`time diff : ${difference}`);

    return difference > 0 ? difference : 0;
  };

  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining(targetTime));

  const navigate = useNavigate();

  const timeover =  async() =>{
    // TODO:check the validation
    try {
        const res =  await  axios.get('/api/earn/getscore')
        if(res.status == 200){
            let resdata = res.data
            let final = resdata.data
            console.log("final", final.enery_restore_time)
            let local_time  = localStorage.getItem("restore_time")
            console.log("flocal_time", local_time)
            if(final.enery_restore_time != local_time){
                console.log("something worg");
                // navigate("/game"); 
            }
        }
           
    } catch (error) {
        console.log("time over error",error);
        
    }
   
    
  }


  useEffect(() => {
    const intervalId = setInterval(() => {
      const newTimeRemaining = calculateTimeRemaining(targetTime);
      if(newTimeRemaining > 0){
        setTimeRemaining(newTimeRemaining);
      }else{
        // TODO: make api cal check with db 
        clearInterval(intervalId);
        timeover()
        onTimerExpire()
        
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [targetTime]);

  const formatTime = (milliseconds) => {
    if (milliseconds <= 0) {
      return enery;
    }
    const duration = moment.duration(milliseconds);
    const hours = Math.floor(duration.asHours());
    const minutes = duration.minutes();
    const seconds = duration.seconds();
    return `${hours}:${minutes}:${seconds}`;
  };

  console.log("res render");

  return (
    <span>{formatTime(timeRemaining)}</span>
  );
};

export default Restoretimer;
