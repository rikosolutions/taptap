import { Route } from "react-router-dom";

import Game from "../pages/game/Game";
import Earn from "../pages/game/Earn";
import Friends from "../pages/game/Friends";
import Reward from "../pages/game/Reward";
import Tasks from "../pages/game/Tasks";
import Leaderboard from "../pages/game/Leaderboard";

import Waitlist from "../pages/game/Waitlist";
import Connectwallet from "../pages/game/Connectwallet";



const GameRouter = [

  <Route key="game" path="/game" element={<Game />} />,
  <Route key="earn" path="/game/earn" element={<Earn />} />,
  <Route key="friends" path="/game/friends" element={<Friends />} />,
  <Route key="reward" path="/game/reward" element={<Reward />} />,
  <Route key="tasks" path="/game/tasks" element={<Tasks />} />,
  <Route key="leaderboard" path="/game/leaderboard" element={<Leaderboard />} />,
  <Route key="miner" path="/game/connectwallet" element={<Connectwallet />} />,5

];
export default GameRouter;
