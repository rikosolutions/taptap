
import axios from "../../utlis/axiosInstance";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

import GameLayout from "../layout/GameLayout";
import Drawer from "../../components/taptap/Drawer";
import LoadingScreen from "../../components/taptap/LoadingScreen";
import Tasklist from "../../components/taptap/Tasklist";

import telelogo from "../../assets/img/Logo.svg";

function Tasks() {
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [tasklist, setTasklist] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const axioController = new AbortController();

    const getTasklist = async () => {
      try {
        const response = await axios.get("/api/task/list", { signal: axioController.signal });

        if (response.status === 200) {
          setIsLoading(false);
          const res = response?.data?.data;
          console.log("res", res);
          setTasklist(res);
        } else {
          setIsLoading(true);
        }
      } catch (error) {
        console.log("Error fetching task list:", error);
        // Navigate to error page or handle as needed
        // navigate("/game");
      }
    };

    getTasklist();

    return () => {
      axioController.abort();
    };
  }, []);

  const handleClaim = () => {
    console.log("claimed");
    // Add logic for claiming tasks
  };

  return (
    <GameLayout>
      {isLoading ? (
        <LoadingScreen isloaded={isLoading} reURL={''} />
      ) : (
        <>
          <Drawer open={open} setOpen={setOpen}>
            <h1 className="text-white font-sfSemi text-2xl">Drawer Content</h1>
          </Drawer>

          {tasklist.length > 0 ? (
            tasklist.map((task, index) => (
              <Tasklist
                key={index}
                title={task.title}
                icon={telelogo} 
                claimpoint={task.claim_point} 
                isClaimed={task.isClaimed} 
                onClaim={handleClaim}
              />
            ))
          ) : (
            <h1 className="text-white font-sfSemi text-2xl">No Tasks Available</h1>
          )}
        </>
      )}
    </GameLayout>
  );
}

export default Tasks;
