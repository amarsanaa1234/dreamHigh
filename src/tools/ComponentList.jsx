import {AdminComponent} from "../components/adminComponent/AdminComponent.jsx";
import {TeamAddComponent} from "../components/registration/teamAddComponent/TeamAddComponent.jsx";
import {PlayerAddComponent} from "../components/registration/playerAddComponent/PlayerAddComponent.jsx";
import {Home} from "../components/main/Home.jsx";
import {GameSchedule} from "../components/gameSchedule/GameSchedule.jsx";
import {GameMatch} from "../components/gameMatch/GameMatch.jsx";

export const ComponentList = {
  ADMIN_COMPONENT:{
    componentCode: "ADMIN_COMPONENT",
    component: <AdminComponent />,
  },
  HOME:{
    componentCode: "HOME",
    component: <Home />,
  },
  TEAM_ADD:{
    componentCode: "TEAM_ADD",
    component: <TeamAddComponent />,
  },
  PLAYER_ADD:{
    componentCode: "PLAYER_ADD",
    component: <PlayerAddComponent />,
  },
  GAME_SCHEDULE:{
    componentCode: "GAME_SCHEDULE",
    component: <GameSchedule />,
  },
  GAME_MATCH:{
    componentCode: "GAME_MATCH",
    component: <GameMatch />,
  }
};