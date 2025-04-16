import {Route, Routes} from "react-router-dom";
import {ComponentList} from "./tools/ComponentList.jsx";
import {Header} from "./components/header/Header.jsx";
import {MainFooter} from "./components/footer/MainFooter.jsx";

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
      </Routes>
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
      <Header/>
      <div className={'mb-8 w-full h-[calc(100vh-180px)] justify-center items-center flex'}>
        {getRoutes()}
      </div>
      <MainFooter/>
    </div>
  );
}

export default App
