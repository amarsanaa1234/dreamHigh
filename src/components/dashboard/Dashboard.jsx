import React, { useEffect, useState } from "react";
import { supabase } from "../../tools/SupabaseClient";


import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";

const Dashboard = () => {
  const [gameDtlList, setGameDtlList] = useState([]);
  const [playerDtlList, setPlayerDtlList] = useState([]);

  useEffect(() => {
    getGameDtl();
    getPlayerDtl();
  }, []);

  const getGameDtl = async () => {
    const { data: gameDtl, error } = await supabase
      .from("game_dtl")
      .select(`
        id,
        away_team_id,
        master_team_id,
        master_team:master_team_id (id, name),
        away_team:away_team_id (id, name)
      `)
      .eq("active_flag", 1)
      

    if (error) {
      console.warn("game_dtl татахад алдаа гарлаа", error);
      return;
    }

    const data = gameDtl.flatMap((it, index) => [
      {
        key: `away-${index}`,
        id: it.away_team.id,
        name: it.away_team.name,
      },
      {
        key: `master-${index}`,
        id: it.master_team.id,
        name: it.master_team.name,
      },
    ]);

    setGameDtlList(data);
  };

  const getPlayerDtl = async () => {
    const { data: players, error } = await supabase
      .from("basketball_player_dtl")
      .select("player_name, point, rebount, fouls, team_id")
      .eq("active_flag", 1);

    if (error) {
      console.warn("Тоглогчийн мэдээлэл татахад алдаа гарлаа", error);
      return;
    }

    setPlayerDtlList(players);
  };

  const filterPlayersByTeam = (teamId) => {
    return playerDtlList.filter((player) => parseInt(player.team_id) === parseInt(teamId));
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-10 px-4 grid grid-cols-1 md:grid-cols-2 gap-10">
      {gameDtlList.map((team) => (
        <div key={team.key} className="bg-[#1e1e2f] p-6 rounded-xl shadow-md">
          <p className="text-2xl font-bold mb-4 text-center">{team.name}</p>

          <Table isStriped className="w-full" aria-label={`${team.name} тоглогчдын хүснэгт`}>
            <TableHeader>
              <TableColumn>Нэр</TableColumn>
              <TableColumn>Оноо</TableColumn>
              <TableColumn>REB</TableColumn>
              <TableColumn>Алдаа</TableColumn>
            </TableHeader>
            <TableBody items={filterPlayersByTeam(team.id)}>
              {(player) => (
                <TableRow key={player.id}>
                  <TableCell>{player.player_name}</TableCell>
                  <TableCell>{player.point}</TableCell>
                  <TableCell>{player.rebount}</TableCell>
                  <TableCell>{player.fouls}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      ))}
    </div>
  );
};
export default Dashboard;


