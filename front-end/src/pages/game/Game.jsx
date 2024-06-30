import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../utlis/axiosInstance";

import Error500 from "../error/Error500";

import { getTGUser } from "../../utlis/tg";
import { setItems } from "../../utlis/localstorage";

import LoadingScreen from "../../components/taptap/LoadingScreen";

function Game() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const referralBy = queryParams.get("tgWebAppStartParam");

  const [error, setError] = useState(false);
  const [isTg, setIsTg] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(function () {
    let unmounted = false;
    let tgUser = getTGUser();
    setIsTg(tgUser !== false);

    if (tgUser !== false) {
      tgUser["referral_by"] = referralBy;
      axios
        .post("/api/tg/auth/", tgUser)
        .then((res) => {
          var data = res.data;
          if (data.sync_data) {
            setItems(data.sync_data);
            setIsLoading(false);
            return navigate("/game/earn");
          } else {
            throw new Error("Sync data is not found");
          }
        })
        .catch((err) => {
          if (!unmounted) {
            if (err.response.status === 403) {
              setIsTg(false);
            } else {
              setError(true);
            }
            setIsLoading(false);
          }
        });
    } else {
      setIsLoading(false);
    }

    return () => {
      unmounted = true;
    };
  }, []);

  return (
    <>
      {isLoading === true && <LoadingScreen isloaded={isLoading} reURL={""} />}
      {isLoading === false && error === true && <Error500 />}
      {isLoading === false && error === false && isTg === false && (
        <h1 className="text-7xl text-white font-sfSemi text-center">
          Please open in TG
        </h1>
      )}
    </>
  );
}

export default Game;
