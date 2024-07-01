import axios from "../../utlis/axiosInstance";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

import GameLayout from "../layout/GameLayout";
import Drawer from "../../components/taptap/Drawer";
import LoadingScreen from "../../components/taptap/LoadingScreen";
import Tasklist from "../../components/taptap/List";

import taptaplogo from "../../assets/img/logo.png";

function Tasks() {
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState({ isopen: false, message: "" });
  const [tasklist, setTasklist] = useState([]);
  const [checkinDetails, setCheckinDetails] = useState({});
  const navigate = useNavigate();
  
  const axioController = new AbortController();
  const getTasklist = async () => {
      try {
        const response = await axios.get("/api/task/list", { signal: axioController.signal });

        if (response.status === 200) {
          setIsLoading(false);
          const res = response?.data?.data;
          setTasklist(res.tasklist);
          setCheckinDetails(res.checkin);
        } else {
          setIsLoading(true);
        }
      } catch (error) {
        // Navigate to error page or handle as needed
        // navigate("/game");
      }
    };

  useEffect(() => {

    getTasklist();

    return () => {
      axioController.abort();
      setIsLoading(false);
    };
  }, []);

  const handleClaim = async (data) => {
    try {
      const task = data;
      if (task) {
        const response = await axios.post("/api/task/claim", { taskID: task.id });
        if (response.status === 200) {
          const resdata = response?.data?.data;
          const updatedTasklist = tasklist.map((item) =>
            item.id === task.id ? { ...item, isClaimed: "Y" } : item
          );
          const pointsInLocalStorage = localStorage.getItem("score");
          const newScore = parseInt(resdata.taskscore) + parseInt(pointsInLocalStorage);
          localStorage.setItem("score", newScore);
          setTasklist(updatedTasklist);
          window.Telegram.WebApp.openLink(task.url);
        }
      }
    } catch (error) {
    }
  };

  const checkinclaim = async () => {
    try {
      if (Object.keys(checkinDetails).length > 0) {
        const response = await axios.post("/api/task/checkin", {});
        if (response.status === 200) {
          const resData = response?.data?.data;
          setCheckinDetails((prevDetails) => ({
            ...prevDetails,
            dailycheckin: false
          }));

          if (resData?.rewardPoints && resData.rewardPoints != null && !isNaN(resData.rewardPoints)) {
            const pointsInLocalStorage = localStorage.getItem("score");
            const newScore = parseInt(resData.rewardPoints) + parseInt(pointsInLocalStorage);
            localStorage.setItem("score", newScore);
            setOpen({
              isopen: true,
              message: `You claimed ${resData.rewardPoints}`
            });
          }
        }
      }
    } catch (error) {
    }
  };

  return (
    <GameLayout>
      {isLoading ? (
        <LoadingScreen isloaded={isLoading} reURL={''} />
      ) : (
        <div style={{ overflowY: 'scroll', maxHeight: '100vh' }}>
          <Drawer open={open.isopen} setOpen={setOpen}>
            <h1 className="text-white font-sfSemi text-2xl">{open.message}</h1>
          </Drawer>

          {Object.keys(checkinDetails).length > 0 && (
            <Tasklist
              title={"Daily check-in"}
              icon={taptaplogo}
              claimpoint={checkinDetails["rewardPoints"]}
              isClaimed={!checkinDetails["dailycheckin"]}
              onClaim={checkinclaim}
            />
          )}

          {tasklist.length > 0 ? (
            tasklist.map((task) => (
              <Tasklist
                key={task.id}
                title={task.title}
                icon={`/src/assets/img/${task.img}`}
                claimpoint={task.points}
                isClaimed={task.isClaimed === "Y"}
                onClaim={() => handleClaim(task)}
              />
            ))
            
          ) : (
            <h1 className="text-white font-sfSemi text-2xl">No Tasks Available</h1>
          )}
        </div>
      )}
    </GameLayout>
  );
}

export default Tasks;
