import React from "react";
import { motion } from "framer-motion";

import telelogo from "../../assets/img/telelogo.svg";
import ime from "../../assets/img/ime.jpg";
import Xlogo from "../../assets/img/Xlogo.png";
import aranwen3 from "../../assets/img/aranwen3.svg";
import OKX_logo from "../../assets/img/OKX_logo.svg";
import taptaplogo from "../../assets/img/logo.png";

const promoImg = {
  "telelogo.svg": telelogo,
  "ime.jpg": ime,
  "Xlogo.png": Xlogo,
  "aranwen3.svg": aranwen3,
  "OKX_logo.svg": OKX_logo,
  "taptaplogo.png": taptaplogo
};

const List = ({
    title,
    icon,
    claimpoint='',
     isClaimed, 
     onClaim 
    }) => {
        
    const formatNumber = (value) => {
        if (value >= 1e9) {
            return (value / 1e9).toFixed(1).replace(/\.0$/, "") + "B";
        } else if (value >= 1e6) {
            return (value / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
        } else if (value >= 1e3) {
            return (value / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
        } else {
            return value;
        }
        };

  return (
    <div className="flex items-center justify-center w-[95%] bg-[#0FF378] rounded-2xl py-2 mt-2 shadow-[0 0 24px -6px #6ABE6A] px-4 mx-auto">
      
      <img
        src={promoImg[icon]}
        alt="TAPTAP"
        className="w-12 h-12 m-1 border-2 border-[#0B2113] rounded-full"
      />
      <div className="flex flex-col flex-grow text-left ml-2">
        <p className="text-[#0B0B0B] text-[15px] font-sfSemi">{title}</p>
        <p className="text-[#0B0B0B] text-base font-sfSemi flex items-center gap-1">
        {claimpoint !== '' && !isNaN(claimpoint) ? `+ ${formatNumber(parseFloat(claimpoint))}` : (claimpoint!=undefined && claimpoint!=null ? claimpoint : '')} 
        </p>
      </div>
      
      {isClaimed ? (
        <p className="ml-2 text-sm text-[#0B0B0B] font-sfSemi">Claimed</p>
      ) : (
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{
            boxShadow: "0px 0px 8px rgb(0, 0, 0)",
            backgroundColor: "rgba(11, 11, 11, 0.5)",
            backdropFilter: "blur(8px)",
          }}
          onClick={onClaim} 
          className="ml-2 p-4 text-sm rounded-lg shadow-md transition duration-300 bg-[#0b0b0b] text-white hover:bg-[#0b0b0b5e] hover:backdrop-blur-md active:grayscale"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="icon icon-tabler icon-tabler-outline icon-tabler-moneybag"
          >
            <path d="M9.5 3h5a1.5 1.5 0 0 1 1.5 1.5a3.5 3.5 0 0 1 -3.5 3.5h-1a3.5 3.5 0 0 1 -3.5 -3.5a1.5 1.5 0 0 1 1.5 -1.5z" />
            <path d="M4 17v-1a8 8 0 1 1 16 0v1a4 4 0 0 1 -4 4h-8a4 4 0 0 1 -4 -4z" />
          </svg>
        </motion.button>
      )}
    </div>
  );
};

export default List;
