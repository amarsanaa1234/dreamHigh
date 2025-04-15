import {AdminComponent} from "../components/adminComponent/AdminComponent.jsx";
import {TeamAddComponent} from "../components/registration/teamAddComponent/TeamAddComponent.jsx";
import {PlayerAddComponent} from "../components/registration/playerAddComponent/PlayerAddComponent.jsx";
import {Home} from "../components/main/Home.jsx";

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
  }
};