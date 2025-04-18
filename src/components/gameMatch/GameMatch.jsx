import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../tools/SupabaseClient.jsx";
import { showMessage } from "../../tools/Tools.jsx";
import {
  Chip,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  User,
  Avatar,
  Image,
} from "@heroui/react";

export const GameMatch = () => {
  const [gameDtlList, setGameDtlList] = useState([]);
  const [playerDtlList, setPlayerDtlList] = useState([]);

  const { id: dtlId } = useParams();

  const columns = [
    { key: "name", label: "Баг" },
    { key: "team_point", label: "Нийт оноо" },
    { key: "team_three_point", label: "Нийт 3н оноо" },
    { key: "team_rebount", label: "Нийт самбар" },
    { key: "team_steal", label: "Бөмбөг таслалт" },
    { key: "team_free_throw", label: "Чөлөөт шидэлт" },
    { key: "plus_minus", label: "STATUS" },
    { key: "win_or_loss", label: "Үр дүн" },
  ];

  const empColumns = [
    { key: "player_name", label: "Нэр" },
    { key: "point", label: "PTS" },
    { key: "three_point", label: "3PTM" },
    { key: "rebount", label: "REB" },
    { key: "steal", label: "ST" },
    { key: "block", label: "BLK" },
    { key: "turnovers", label: "TO" },
    { key: "free_throw", label: "FTM/A*" },
    { key: "fouls", label: "Алдаа" },
  ];

  useEffect(() => {
    getPlayerDtl();
  }, [dtlId]);

  const calculateTeamStats = (players, teamId) => {
    const teamPlayers = players.filter(p => parseInt(p.team_id) === parseInt(teamId));

    let totalThreePoint = 0;
    let totalRebound = 0;
    let totalSteal = 0;
    let totalFreeThrow = 0;

    for (const p of teamPlayers) {
      totalThreePoint += p.three_point || 0;
      totalRebound += p.rebount || 0;
      totalSteal += p.steal || 0;
      totalFreeThrow += p.successful_free_throw || 0;
    }

    return {
      team_three_point: totalThreePoint,
      team_rebount: totalRebound,
      team_steal: totalSteal,
      team_free_throw: totalFreeThrow,
    };
  };

  const getPlayerDtl = async () => {
    const { data: players, error } = await supabase
      .from("basketball_player_dtl")
      .select("*, player:player_id(image, role, player_num), team_id")
      .eq("game_id", dtlId)
      .eq("active_flag", 1);

    if (error) {
      showMessage({ type: "warning", text: "Тоглогчийн дата татахад алдаа гарлаа." });
    } else {
      const formatted = players.map((p) => ({
        ...p,
        image: p.player?.image ?? "",
        free_throw: `${p.successful_free_throw}/${p.total_free_throw}`,
        starting_player_status: p.starting_player_status,
      }));
      setPlayerDtlList(formatted);
      getGameDtl(formatted); // багийн статистик гаргах
    }
  };

  const getGameDtl = async (players) => {
    const { data: gameDtl, error } = await supabase
      .from("game_dtl")
      .select(`
        id,
        away_plus_minus,
        away_team_id,
        away_win,
        away_team_point,
        master_win,
        master_plus_minus,
        master_team_id,
        master_team_point,
        master_team:master_team_id (id, name, gender, sport_type, image),
        away_team:away_team_id (id, name, gender, sport_type, image)
      `)
      .eq("active_flag", 1)
      .eq("id", dtlId);

    if (error) {
      showMessage({ type: "warning", text: "game_dtl татахад алдаа гарлаа." });
      return;
    }

    const data = gameDtl.flatMap((it, index) => {
      const awayStats = {
        ...calculateTeamStats(players, it.away_team.id),
        team_point: it.away_team_point ?? 0,
      };

      const masterStats = {
        ...calculateTeamStats(players, it.master_team.id),
        team_point: it.master_team_point ?? 0,
      };

      return [
        {
          key: `away-${index}`,
          id: it.away_team.id,
          name: it.away_team.name,
          image: it.away_team.image,
          ...awayStats,
          plus_minus: it.away_plus_minus,
          win_or_loss: it.away_win === it.master_win ? 3 : it.away_win,
        },
        {
          key: `master-${index}`,
          id: it.master_team.id,
          name: it.master_team.name,
          image: it.master_team.image,
          ...masterStats,
          plus_minus: it.master_plus_minus,
          win_or_loss: it.master_win === it.away_win ? 3 : it.master_win,
        },
      ];
    });

    setGameDtlList(data);
  };

  const filterPlayersByTeam = (teamId) => {
    return playerDtlList.filter((player) => parseInt(player.team_id) === parseInt(teamId));
  };

  const filterStartingPlayersByTeam = (teamId) => {
    return playerDtlList.filter(
      (player) =>
        parseInt(player.team_id) === parseInt(teamId) &&
        player.starting_player_status === 1
    );
  };

  const renderCell = (user, columnKey) => {
    const value = user[columnKey];
    switch (columnKey) {
      case "name":
        return (
          <div className="flex items-center gap-3">
            <Avatar
              src={
                user.image ||
                "https://qcgqnbovwktkbdbsiidk.supabase.co/storage/v1/object/public/dream-high-image/player/default-logo.jpg"
              }
            />
            <span>{user.name}</span>
          </div>
        );
      case "win_or_loss":
        return (
          <Chip className="capitalize" color={value === 1 ? "success" : "danger"} size="sm" variant="flat">
            {value === 3 ? "" : value === 1 ? "Win" : "Loss"}
          </Chip>
        );
      default:
        return value;
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-10 px-4 py-8 bg-[#0d1117] text-white">
      <Table isStriped className="w-full max-w-6xl shadow-lg rounded-xl bg-[#1e1e2f]" aria-label="Team statistics table">
        <TableHeader columns={columns}>
          {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
        </TableHeader>
        <TableBody items={gameDtlList}>
          {(item) => (
            <TableRow key={item.key}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-10">
        {gameDtlList.map((team) => (
          <div key={team.key} className="bg-[#1e1e2f] p-6 rounded-xl shadow-md">
            <p className="text-2xl font-bold mb-6 text-center">{team.name}</p>

            <div className="mb-6">
              <p className="text-lg font-semibold text-center mb-4">{team.name} - Гарааны тоглогчид</p>
              <div className="flex flex-wrap justify-center gap-4">
                {filterStartingPlayersByTeam(team.id).map((player) => (
                  <div
                    key={player.id}
                    className="flex flex-col items-center bg-[#2c2f3f] px-4 py-3 rounded-xl w-36 shadow transition hover:scale-105"
                  >
                    <Image
                      alt="HeroUI Player Image"
                      src={
                        player.image ||
                        "https://qcgqnbovwktkbdbsiidk.supabase.co/storage/v1/object/public/dream-high-image/player/default-logo.jpg"
                      }
                      width={240}
                      height={140}
                    />
                    <p className="font-medium text-white text-sm text-center">{player.player_name}</p>
                    <p className="text-xs text-center">
                      #{player.player?.player_num ?? "-"} - {player.player?.role ?? "role"}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <Table isStriped className="w-full" aria-label="Player statistics table">
              <TableHeader columns={empColumns}>
                {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
              </TableHeader>
              <TableBody items={filterPlayersByTeam(team.id)}>
                {(item) => (
                  <TableRow key={item.id}>
                    {(columnKey) => (
                      <TableCell>
                        {columnKey === "player_name" ? (
                          <User
                            avatarProps={{
                              src:
                                item.image ||
                                "https://qcgqnbovwktkbdbsiidk.supabase.co/storage/v1/object/public/dream-high-image/player/default-logo.jpg",
                            }}
                            name={item.player_name}
                            description={
                              <span className="text-xs">
                                #{item.player?.player_num ?? "-"} - {item.player?.role ?? "role"}
                              </span>
                            }
                            className="font-medium"
                          />
                        ) : (
                          item[columnKey]
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        ))}
      </div>
    </div>
  );
};
