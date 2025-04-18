import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {supabase} from "../../tools/SupabaseClient.jsx";
import {showMessage} from "../../tools/Tools.jsx";
import {Chip, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, User} from "@heroui/react";

export const GameMatch = () => {
  const [gameDtlList, setGameDtlList] = useState([]);

  const { id: dtlId } = useParams();

  const columns = [
    {
      key: "name",
      label: "Баг",
    },
    {
      key: "team_point",
      label: "Нийт оноо",
    },
    {
      key: "team_three_point",
      label: "Нийт 3н оноо",
    },
    {
      key: "team_rebount",
      label: "Нийт самбар",
    },
    {
      key: "team_steal",
      label: "Бөмбөг таслалт",
    },
    {
      key: "team_free_throw",
      label: "Чөлөөт шидэлт",
    },
    {
      key: "plus_minus",
      label: "STATUS",
    },
    {
      key: "win_or_loss",
      label: "Үр дүн",
    },
  ];

  const empColumns = [
    {
      key: "player_name",
      label: "Нэр",
    },
    {
      key: "point",
      label: "PTS",
    },
    {
      key: "three_point",
      label: "3PTM",
    },
    {
      key: "rebount",
      label: "REB",
    },
    {
      key: "steal",
      label: "ST",
    },
    {
      key: "block",
      label: "BLK",
    },
    {
      key: "turnovers",
      label: "TO",
    },
    {
      key: "total_free_throw",
      label: "FTM/A*",
    },
    {
      key: "fouls",
      label: "Алдаа",
    },
  ];

  useEffect(() => {
    getGameDtl();
  }, [dtlId]);

  const renderCell = (user, columnKey) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case "name":
        return (
            <User avatarProps={{radius: "lg", src: user.image}} description={user.email} name={cellValue}>
              {user.name}
            </User>
        );
      case "role":
        return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">{cellValue}</p>
              <p className="text-bold text-sm capitalize text-default-400">{user.team}</p>
            </div>
        );
      case "win_or_loss":
        return (
            <Chip className="capitalize" color={cellValue == 1 ? 'success' : 'warning'} size="sm" variant="flat">
              {cellValue == 3 ? '' :cellValue == 1 ? 'win' : 'loss'}
            </Chip>
        );
      default:
        return cellValue;
    }
  };

  const getGameDtl = async () => {
    const { data: gameDtl, error: gameDtlError } = await supabase
      .from('game_dtl')
      .select(`
    id,
    away_plus_minus,
    away_team_id,
    away_team_loss_point,
    away_team_point,
    away_team:away_team_id (
      id,
      name,
      gender,
      sport_type,
      image
    ),
    master_win,
    away_win,
    master_plus_minus,
    master_team_id,
    master_team_loss_point,
    master_team_point,
    master_team:master_team_id (
      id,
      name,
      gender,
      sport_type,
      image
    )
  `)
      .eq("active_flag", 1)
      .eq("id", dtlId);

    if (gameDtlError) {
      showMessage({ type: "warning", text: "data дуудах үед алдаа гарлаа." });
    } else {

      const data = [];
      gameDtl.forEach((it, index) => {
        const away_team_totals = {
          key: `away-${index}`,
          gameDtlid: it.id,
          name: it.away_team.name,
          sport_type: it.away_team.sport_type,
          gender: it.away_team.gender,
          image: it.away_team.image,
          team_point: 0,
          team_three_point: 0,
          team_rebount: 0,
          team_steal: 0,
          team_free_throw: 0,
          plus_minus: 0,
          win_or_loss: it.away_win === it.master_win ? 3 : it.away_win
        };

        const master_team_totals = {
          key: `master-${index}`,
          gameDtlid: it.id,
          name: it.master_team.name,
          sport_type: it.master_team.sport_type,
          gender: it.master_team.gender,
          image: it.master_team.image,
          team_point: 0,
          team_three_point: 0,
          team_rebount: 0,
          team_steal: 0,
          team_free_throw: 0,
          plus_minus: 0,
          win_or_loss: it.master_win === it.away_win ? 3 : it.master_win
        };

        data.push(away_team_totals);
        data.push(master_team_totals);
      });
      setGameDtlList(data);
    }
  };

  return(
    <div className={'w-full flex flex-col justify-center items-center gap-10'}>
      <Table isStriped className='w-full' aria-label="Team statistics table">
        <TableHeader columns={columns}>
          {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
        </TableHeader>
        <TableBody items={gameDtlList}>
          {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
              </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="w-full flex flex-row justify-center items-start gap-10 overflow-x-auto">
        <div className="min-w-[500px]">
          <Table isStriped className="w-full" aria-label="Team statistics table">
            <TableHeader columns={empColumns}>
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
        </div>

        <div className="min-w-[500px]">
          <Table isStriped className="w-full" aria-label="Team statistics table">
            <TableHeader columns={empColumns}>
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
        </div>
      </div>

    </div>
  );
}