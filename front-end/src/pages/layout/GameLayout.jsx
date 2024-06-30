import Tabs from "../../components/taptap/Tabs";
import TGAuth from "../../components/taptap/TGAuth";
import {getAuth} from "../../utlis/localstorage";

import { getTGUser } from "../../utlis/tg";

import walleticon from "../../assets/img/cutomsvg/wallet.svg";
import leaderboard from "../../assets/img/leaderboard.svg";
import coinIcon from "../../assets/img/coin.png";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";


function GameLayout({ children }) {
  const [wallet,setWallet] = useState('');
  let tg_user = getTGUser();
  const tg = window.Telegram.WebApp;
  useEffect(() => {
    let local_address = localStorage.getItem("wallet") 
    console.log("wallet",local_address)
    setWallet(local_address!='' && local_address!=null ? local_address : '')
    tg.expand();
  }, []);
  
  
  
  
  const formatWalletAddress = (address) => {
    if (!address || address.length < 10) return address;
    const start = address.slice(0, 2);
    const end = address.slice(-4);
    return `${start}...${end}`;
  };

  const connectWallet = () => {
    if (wallet === null || wallet === '') {
      const token = getAuth();
      //change the dmoin in live
      const teleBotURL = `https://9eef-120-60-207-230.ngrok-free.app/game/connectwallet?walletid=${token}`;
      const encodedTeleBotUrl = encodeURIComponent(teleBotURL);
      const deepLink = "okx://wallet/dapp/url?dappUrl=" + encodedTeleBotUrl;
      const encodedUrl = "https://www.okx.com/download?deeplink=" + encodeURIComponent(deepLink);
      
      window.Telegram.WebApp.openLink(encodedUrl);
      window.Telegram.WebApp.close();
    } else {
      setOpen(true);
    }
  };
  return (
    <TGAuth>
      {tg_user !== false && (
        <div className="container text-center h-screen flex flex-col items-center px-2 bg-transparent backdrop-blur-md font-sfRegular">
          <div className="top-bar w-full flex flex-row items-center justify-between py-2 h-[74px]">
            <div className="flex flex-row justify-between align-items-center w-full">
              <div className="flex flex-row items-center justify-center">
                <img
                  src={tg_user.photo_url || coinIcon}
                  className="w-12 h-12 m-1 border-2 border-[#0B2113] rounded-full"
                  alt="Profile"
                  width="50"
                />
                <span className="ml-2 text-white text-xl font-sfSemi">
                  {tg_user.first_name}
                </span>
              </div>
              <div className="menu flex flex-row items-center justify-center gap-4">
                {wallet!='' ? (
                  <button
                    
                    className="text-white px-4 font-sfSemi rounded-xl bg-[#0B2113] h-12"
                  >
                    {formatWalletAddress(wallet)}
                  </button>
                ) : (
                  <button onClick={connectWallet}>
                    
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
    className="icon icon-tabler icons-tabler-outline icon-tabler-wallet w-12 h-12 text-white p-2 rounded-xl bg-[#0B2113]"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M17 8v-3a1 1 0 0 0 -1 -1h-10a2 2 0 0 0 0 4h12a1 1 0 0 1 1 1v3m0 4v3a1 1 0 0 1 -1 1h-12a2 2 0 0 1 -2 -2v-12" />
    <path d="M20 12v4h-4a2 2 0 0 1 0 -4h4" />
  </svg>
                    
                  </button>
                )}

                <Link to="/game/leaderboard" className=" ">
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
    className="icon icon-tabler icons-tabler-outline icon-tabler-medal w-12 h-12 text-white p-2 rounded-xl bg-[#0B2113]"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M12 4v3m-4 -3v6m8 -6v6" />
    <path d="M12 18.5l-3 1.5l.5 -3.5l-2 -2l3 -.5l1.5 -3l1.5 3l3 .5l-2 2l.5 3.5z" />
  </svg>
                </Link>
              </div>
            </div>
          </div>
          {children}
          <Tabs />
        </div>
      )}
      {tg_user === false && (
        <h1 className="text-7xl text-white font-sfSemi text-center">
          
        </h1>
      )}
    </TGAuth>
  );
}

export default GameLayout;
