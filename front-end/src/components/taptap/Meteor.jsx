import { easeInOut, motion } from "framer-motion";
import React, { useState, useEffect } from "react";


import coinBackgroundImg from "../../assets/img/coin-background.png";

const Meteor = ()=>{

    const [meteorStyles, setMeteorStyles] = useState([]);

    const number = 20;
  useEffect(() => {
    const styles = [...new Array(number)].map(() => ({
      top: 0,
      left: Math.floor(Math.random() * window.innerWidth) + "px",
      animationDelay: Math.random() * 1 + 0.2 + "s",
      animationDuration: Math.floor(Math.random() * 8 + 2) + "s",
    }));
    setMeteorStyles(styles);
  }, [number])

    return(
      <>
        
        {[...meteorStyles].map((style, idx) => (
          <span
            key={idx}
            className="pointer-events-none absolute left-1/2 top-1/2 h-0.5 w-0.5 rotate-[215deg] animate-meteor rounded-[9999px] bg-[#0FF378] shadow-[0_0_0_1px_#ffffff10]"
            style={style}
          >
            <div className="pointer-events-none absolute top-1/2 -z-10 h-[1px] w-[85px] -translate-y-1/2 bg-gradient-to-r from-[#0FF378] to-transparent" />
          </span>
        ))}
        </>
    )
    
}

export default Meteor;