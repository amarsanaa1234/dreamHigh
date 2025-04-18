import React, { useEffect, useState } from "react";
import { supabase } from "../../tools/SupabaseClient.jsx";
import {
  Tabs,
  Tab,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Image,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  Button,
  DropdownItem,
} from "@heroui/react";

export const Home = () => {
  const [maleBasketball, setMaleBasketball] = useState([]);
  const [femaleBasketball, setFemaleBasketball] = useState([]);
  const [maleVolleyball, setMaleVolleyball] = useState([]);
  const [femaleVolleyball, setFemaleVolleyball] = useState([]);
  const [gameDetailsMap, setGameDetailsMap] = useState({});
  const [teamIdMap, setTeamIdMap] = useState({});

  useEffect(() => {
    fetchTeamsAndGames();
  }, []);

  const fetchTeamsAndGames = async () => {
    const { data: teams, error } = await supabase
      .from("team")
      .select("*")
      .eq("active_flag", 1);

    if (error || !teams) {
      console.error("Error fetching teams:", error);
      return;
    }

    const malebs = [], femalebs = [], malevl = [], femalevl = [];
    const idMap = {};

    teams.forEach((team) => {
      idMap[team.id] = {
        name: team.name,
        image: team.image,
      };

      if (team.sport_type === 1 && team.gender === 1) malebs.push(team);
      else if (team.sport_type === 1 && team.gender === 2) femalebs.push(team);
      else if (team.sport_type === 2 && team.gender === 1) malevl.push(team);
      else if (team.sport_type === 2 && team.gender === 2) femalevl.push(team);
    });

    setTeamIdMap(idMap);
    setMaleBasketball(malebs);
    setFemaleBasketball(femalebs);
    setMaleVolleyball(malevl);
    setFemaleVolleyball(femalevl);
  };

  const fetchGameDetails = async (teamId) => {
    const { data, error } = await supabase
      .from("game_dtl")
      .select("*")
      .or(`master_team_id.eq.${teamId},away_team_id.eq.${teamId}`)
      .order("id", { ascending: false })
      .limit(3);

    if (error) {
      console.error("Error fetching game details:", error);
      return [];
    }
    return data;
  };

  const handleDropdownOpen = async (teamId) => {
    if (!gameDetailsMap[teamId]) {
      const games = await fetchGameDetails(teamId);
      setGameDetailsMap((prev) => ({ ...prev, [teamId]: games }));
    }
  };

  const createTable = (dataList) => (
    <Table
      isHeaderSticky
      aria-label="Team list"
      className="max-h-[600px] overflow-auto mt-4"
    >
      <TableHeader>
        <TableColumn className="w-[400px] font-bold">Nickname</TableColumn>
        <TableColumn>W</TableColumn>
        <TableColumn>L</TableColumn>
        <TableColumn>W/L Ratio</TableColumn>
        <TableColumn>Sport Type</TableColumn>
        <TableColumn>Actions</TableColumn>
      </TableHeader>
      <TableBody emptyContent={"Мэдээлэл олдсонгүй"}>
        {dataList.map((item, index) => (
          <TableRow
            key={index}
            className="hover:bg-gray-400 hover:text-white transition duration-200 cursor-pointer"
          >
            <TableCell>
              <div className="flex items-center gap-2">
                <Image
                  src={
                    item.image ||
                    "https://qcgqnbovwktkbdbsiidk.supabase.co/storage/v1/object/public/dream-high-image/team/default-logo.jpg"
                  }
                  alt={item.name}
                  width={28}
                  height={28}
                  className="rounded-full object-cover"
                />
                {item.nickname}
              </div>
            </TableCell>
            <TableCell>{item.total_win}</TableCell>
            <TableCell>{item.total_loss}</TableCell>
            <TableCell>{item.total_plus_minus}</TableCell>
            <TableCell>{item.sport_type}</TableCell>
            <TableCell className="text-right">
              <Dropdown
                backdrop="blur"
                onOpenChange={(isOpen) => {
                  if (isOpen) handleDropdownOpen(item.id);
                }}
              >
                <DropdownTrigger>
                  <Button
                    variant="bordered"
                    size="sm"
                    className="hover:bg-blue-300 hover:text-white transition duration-200"
                  >
                    Тоглолт
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Өмнөх тоглолтууд" variant="faded">
                  {gameDetailsMap[item.id]?.length > 0 ? (
                    gameDetailsMap[item.id].map((game, idx) => {
                      const isMaster = game.master_team_id === item.id;
                      const opponentId = isMaster
                        ? game.away_team_id
                        : game.master_team_id;
                      const opponent = teamIdMap[opponentId];

                      const teamScore = isMaster
                        ? game.master_team_point
                        : game.away_team_point;
                      const opponentScore = isMaster
                        ? game.away_team_point
                        : game.master_team_point;

                      return (
                        <DropdownItem key={idx}>
                          <div className="flex items-center gap-2">
                            <Image
                              src={item.image || "https://qcgqnbovwktkbdbsiidk.supabase.co/storage/v1/object/public/dream-high-image/team/default-logo.jpg"}
                              alt={item.name}
                              width={24}
                              height={24}
                              className="rounded-full object-cover"
                            />
                            <span className="font-semibold text-sm">VS</span>
                            <Image
                              src={opponent?.image || "https://qcgqnbovwktkbdbsiidk.supabase.co/storage/v1/object/public/dream-high-image/team/default-logo.jpg"}
                              alt={opponent?.name}
                              width={24}
                              height={24}
                              className="rounded-full object-cover"
                            />
                            <span>
                              {teamIdMap[item.id]?.name} {teamScore} : {opponentScore} {opponent?.name}
                            </span>
                          </div>
                        </DropdownItem>
                      );
                    })
                  ) : (
                    <DropdownItem key="empty" className="italic text-gray-500">
                      Тоглолт олдсонгүй
                    </DropdownItem>
                  )}
                </DropdownMenu>
              </Dropdown>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="p-6 min-h-screen">
      <div className="bg-gray-100 p-4 rounded-xl shadow">
        <Tabs aria-label="Sports Categories" variant="bordered">
          <Tab key="female-basketball" title="Эмэгтэй сагсан бөмбөг">
            {createTable(femaleBasketball)}
          </Tab>
          <Tab key="male-basketball" title="Эрэгтэй сагсан бөмбөг">
            {createTable(maleBasketball)}
          </Tab>
          <Tab key="female-volleyball" title="Эмэгтэй волейбол">
            {createTable(femaleVolleyball)}
          </Tab>
          <Tab key="male-volleyball" title="Эрэгтэй волейбол">
            {createTable(maleVolleyball)}
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};
