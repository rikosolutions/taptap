import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import React, { useState, useEffect, useRef } from "react";

import 'react-toastify/dist/ReactToastify.css'; 
import axios from "../../utlis/axiosInstance";

import GameLayout from "../layout/GameLayout";
import InviteCard from "../../components/taptap/InviteCard";
import Tasklist from "../../components/taptap/List";
import LoadingScreen from "../../components/taptap/LoadingScreen";

import LogoImg from "../../assets/img/logo.png";
import ActualizarImg from "../../assets/img/actualizar.png";
import giftbox1 from "../../assets/img/giftbox1.png";
import giftbox2 from "../../assets/img/giftbox2.png";
import Drawer from "../../components/taptap/Drawer";



const Friends = () => {
  const [friends, setFriends] = useState([]);
  const [refLink, setRefLink] = useState('');
  const [open, setOpen] = useState({ isopen: false, message: "" });
  const [isLoading, setIsLoading] = useState(true);
  
  const navigate = useNavigate();
  const effectRan = useRef(false);

  const axioController = new AbortController();

  const getTasklist = async () => {
    try {
      const response = await axios.get("/api/referral/list", { signal: axioController.signal });

      if (response.status === 200) {
        const res = response?.data?.data;
        // TODO:add to env change in pro
        
        const GAME_TG_URL = "https://t.me/ckwsncjnsefcn_bot/test_app";
        
        setRefLink(`${GAME_TG_URL}?startapp=${res.refCode}`);
        setFriends(res.friends)
        setIsLoading(false);
      } else {
        setIsLoading(true);
      }
    } catch (error) {
      console.log("Error fetching task list:", error);
      // Navigate to error page or handle as needed
      // navigate("/game");
    }
  };

  useEffect(() => {
    if (!effectRan.current) {
      getTasklist();
      effectRan.current = true;
    }
  }, [navigate]);


  const triggerCopy = (e) => {
    e.preventDefault();
    navigator.clipboard
      .writeText(refLink)
      .then(() => {
        setOpen({ 
          isopen: true, 
          message: 'Invite Copied, Share it with your friends and family.' 
        });
        
      })
      .catch(() => {
        setOpen({ 
          isopen: true, 
          message: 'Fail to copy' 
        });
      })
      .finally(() => {
        setTimeout(() => setOpen((prevState)=>{ 
          return{
            ...prevState,
          isopen: false, 
          }
        }), 5000);
      });
  };
  
  const claim = async (friendId) => {
    try {
      setIsLoading(true);
     const response =  await axios.post('/api/referral/claim', { friendID:friendId});

     if (response.status === 200) {
      const res = response?.data?.data;
      const updatedCalim = friends.map((item) =>
        item.id === res.friendid ? { ...item, claimed: "Y" } : item
      );
      const pointsInLocalStorage = localStorage.getItem("score");
      const newScore = parseInt(res.claimedPoint) + parseInt(pointsInLocalStorage);
      localStorage.setItem("score", newScore);
      setFriends(updatedCalim);

      setOpen({
        message:`You clamied ${res.claimedPoint}!`,
        isopen: true, 
      })

      setIsLoading(false);

     }else{
      // navigate("/game");
     }
     
    } catch (error) {
      console.error("Error claiming reward:", error);
    }
  };
  const calimall = async()=>{
    try {
      
      setIsLoading(true);
      const response =  await axios.post('/api/referral/claimall');
 
      if (response.status === 200) {
        
       const res = response?.data?.data;
 
       if(res.claimedUsers && (res.claimedUsers).length>0){

        const updatedClaim = friends.map(item =>
          res.claimedUsers.includes(item.id) ? { ...item, claimed: "Y" } : item
        );
         const pointsInLocalStorage = localStorage.getItem("score");
         const newScore = parseInt(res.claimedPoints) + parseInt(pointsInLocalStorage);
         localStorage.setItem("score", newScore);
         setFriends(updatedClaim);
         setOpen({
           message:`You clamied ${res.claimedPoints}!`,
           isopen: true, 
         })
       }
      
       setIsLoading(false);
      }else{
       // navigate("/game");
      }
      
     } catch (error) {
       console.error("Error claiming reward:", error);
     }


  }

  return (
    <GameLayout>
      {isLoading ? (
        <LoadingScreen isloaded={isLoading} reURL={''} />
      ):(
          <>
            <div className="w-full">
              <Drawer open={open.isopen} setOpen={setOpen}>
                <div className="flex flex-col items-center justify-center px-4 gap-2">
                  <h1 className="text-white font-sfSemi text-2xl ">
                  {open.message}
                  </h1>
                    <motion.svg
                      initial={{ rotate: -90, opacity: 0 }}
                      whileInView={{ rotate: 0, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.4 }}
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="icon icon-tabler icons-tabler-outline icon-tabler-circle-dashed-check w-14 h-14 text-white"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M8.56 3.69a9 9 0 0 0 -2.92 1.95" />
                      <path d="M3.69 8.56a9 9 0 0 0 -.69 3.44" />
                      <path d="M3.69 15.44a9 9 0 0 0 1.95 2.92" />
                      <path d="M8.56 20.31a9 9 0 0 0 3.44 .69" />
                      <path d="M15.44 20.31a9 9 0 0 0 2.92 -1.95" />
                      <path d="M20.31 15.44a9 9 0 0 0 .69 -3.44" />
                      <path d="M20.31 8.56a9 9 0 0 0 -1.95 -2.92" />
                      <path d="M15.44 3.69a9 9 0 0 0 -3.44 -.69" />
                      <path d="M9 12l2 2l4 -4" />
                    </motion.svg>
                  </div>
                </Drawer>
                <h1 className="text-white text-2xl font-sfSemi">Invite Friends</h1>
                <InviteCard
                  title="Invite friend"
                  points="+2500 TTC"
                  description="for you and your friend"
                  logo={LogoImg}
                  background={giftbox1}
                />
                <InviteCard
                  title="Invite friend with Telegram Premium"
                  points="+5000 TTC"
                  description="for you and your friend"
                  background={giftbox2}
                  logo={LogoImg}
                />
              
                  <div className=" sticky mt-4 relative w-[80%] text-center mx-auto">
                  <motion.a
                      className="absolute left-0 top-0"
                      onTouchStart={calimall}
                      whileTap={{ rotate: 180 }}
                    >
                    <h3 className="text-white text-[15px] font-sfSemi">Claim All</h3>  
                    </motion.a>
                    <h3 className="text-white text-[15px] font-sfSemi">Friends List</h3>
                    <motion.a
                      className="absolute right-0 top-0"
                      onTouchStart={getTasklist}
                      whileTap={{ rotate: 180 }}
                    >
                      <img
                        className="h-[19px] w-[19px]"
                        src={ActualizarImg}
                        alt="Refresh"
                      />
                    </motion.a>
                  </div>
                </div>
                <div className="w-full overflow-y-auto">
                {friends.length > 0 &&
                  friends.filter(frd => frd.claimed === "N")
                  .concat(friends.filter(frd => frd.claimed !== "N"))
                  .map(frd => (
                      <Tasklist
                        key={frd.id}
                        title={frd.first_name !== '' ? frd.first_name : frd.username}
                        icon={LogoImg}
                        claimpoint={frd.gamelevel}
                        isClaimed={frd.claimed === "Y"}
                        onClaim={() => claim(frd.id)}
                      />
                ))}
                </div>
                <div className=" h-auto w-full fixed bottom-0 bg-[#0b0b0b5e] backdrop-blur-md pt-2">
                  
                  <a
                    href="#"
                    onClick={triggerCopy}
                    className="text-[#0b0b0b] text-xl w-1/2  mb-28 rounded-[20px] bg-[#0FF378]  justify-center py-4 mt-2 mx-auto flex items-center"
                  >
                    Invite friends
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
                      className="icon icon-tabler icons-tabler-outline icon-tabler-users w-8 h-8 mx-2"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
                      <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      <path d="M21 21v-2a4 4 0 0 0 -3 -3.85" />
                    </svg>
                  </a>
                </div>
              </>

          )}
    </GameLayout>
  );
};

export default Friends;
