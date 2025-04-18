import {Route, Routes} from "react-router-dom";
import {ComponentList} from "./tools/ComponentList.jsx";
import {Header} from "./components/header/Header.jsx";
import {MainFooter} from "./components/footer/MainFooter.jsx";
import {LayoutGroup} from "framer-motion";

function App() {

  const getComponent = (componentCode) => {
    const compCode = Object.keys(ComponentList).find(c => ComponentList[c].componentCode === componentCode);
    if (!compCode)
      return null;
    return (
      <>
        {ComponentList[compCode].component}
      </>
    );
  }

  const getRoutes = () => {
    return (
      <Routes>
        <Route path="/" element={getComponent("HOME")}/>
        <Route path="adminComponent" element={getComponent("ADMIN_COMPONENT")}/>
        <Route path="teamAdd" element={getComponent("TEAM_ADD")}/>
        <Route path="playerAdd" element={getComponent("PLAYER_ADD")}/>
        <Route path="gameSchedule" element={getComponent("GAME_SCHEDULE")}/>
        <Route path="gameMatch/:id" element={getComponent("GAME_MATCH")}/>
        <Route path="dashboard/:id" element={getComponent("DASHBOARD")}/>
      </Routes>
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
      <Header/>
          <div className={'mb-8 w-full justify-center items-center flex container mx-auto max-w-7xl pt-16 px-6 flex-grow'}>
            {getRoutes()}
          </div>
      <MainFooter/>
    </div>
  );
}

export default App
