import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {supabase} from "../../tools/SupabaseClient.jsx";
import {showMessage} from "../../tools/Tools.jsx";
import {getKeyValue, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from "@heroui/react";

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
      label: "Нийт оноо",
    },
    {
      key: "team_rebount",
      label: "Нийт оноо",
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

  useEffect(() => {
    getGameDtl();
  }, [dtlId]);

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
    loss_team_id,
    win_team_id,
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
      console.log(gameDtl);
      setGameDtlList(gameDtl);
    }
  };

  return(
    <Table aria-label="Example table with dynamic content">
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody items={gameDtlList}>
        {(item) => (
          <TableRow key={item.key}>
            {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}