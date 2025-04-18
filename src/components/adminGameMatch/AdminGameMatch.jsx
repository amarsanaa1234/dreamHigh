import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {supabase} from "../../tools/SupabaseClient.jsx";
import {showMessage} from "../../tools/Tools.jsx";
import {
    Button,
    Card,
    CardBody, Checkbox,
    Chip, Form, Image, Select, SelectItem, Tab,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow, Tabs, User
} from "@heroui/react";

export const AdminGameMatch = () => {

    const [gameDtlList, setGameDtlList] = useState([]);
    const [masterPlayersData, setMasterPlayersData] = useState([]);
    const [awayPlayersData, setAwayPlayersData] = useState([]);

    const {id: dtlId} = useParams();

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
            key: "successful_free_throw",
            label: "SFT*",
        },
        {
            key: "total_free_throw",
            label: "TFM*",
        },
        {
            key: "fouls",
            label: "Алдаа",
        },
    ];

    useEffect(() => {
        getGameDtl();
    }, [dtlId]);

    useEffect(() => {
        const interval = setInterval(() => {
            intervalFunction();
        }, 10000);

        return () => clearInterval(interval);
    }, [masterPlayersData, awayPlayersData]);

    const intervalFunction = async () => {
        let totalMasterPoint = 0;
        let totalMasterLossPoint = 0;
        let totalAwayPoint = 0;
        let totalAwayLossPoint = 0;
        masterPlayersData.forEach(it => {
            totalMasterPoint += it.point;
            totalAwayLossPoint = totalMasterPoint;
        })
        awayPlayersData.forEach(it => {
            totalAwayPoint += it.point;
            totalMasterLossPoint = totalAwayPoint;
        })
        let totalAwayPlusMinus = totalAwayPoint - totalAwayLossPoint;
        let totalMasterPlusMinus = totalMasterPoint - totalMasterLossPoint;

        const {error} = await supabase
            .from('game_dtl')
            .update({
                'master_team_point': totalMasterPoint,
                'away_team_point': totalAwayPoint,
                'master_team_loss_point': totalMasterLossPoint,
                'away_team_loss_point': totalAwayLossPoint,
                'master_plus_minus': totalMasterPlusMinus,
                'away_plus_minus': totalAwayPlusMinus
            })
            .eq('id', dtlId)
            .eq('active_flag', 1);

        if (!error) {
            // getGameDtl();
        } else {
            showMessage({type: "warning", text: "Шинэчлэл амжилтгүй боллоо."});
        }
    }

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
                    <Chip className="capitalize" color={cellValue == 1 ? 'success' : 'warning'} size="sm"
                          variant="flat">
                        {cellValue == 3 ? '' : cellValue == 1 ? 'win' : 'loss'}
                    </Chip>
                );
            default:
                return cellValue;
        }
    };

    const updateStat = async (user, columnKey, amount, type) => {
        const currentValue = user[columnKey] || 0;

        const isMinus = type === 'minus';
        const newValue = isMinus ? currentValue - amount : currentValue + amount;

        if (isMinus && currentValue === 0) return;

        let updateData = { [columnKey]: newValue };
        if (columnKey === 'three_point') {
            if(isMinus)
                user['point'] -= 3;
            else
                user['point'] += 3;
            updateData = {['point']: user['point'], [columnKey]: newValue};
        } else if (columnKey === 'successful_free_throw') {
            if(isMinus)
                user['point'] -= 1;
            else
                user['point'] += 1;
            updateData = {['point']: user['point'], [columnKey]: newValue};
        }

        const { error } = await supabase
            .from('basketball_player_dtl')
            .update(updateData)
            .eq('id', user.id)
            .eq('team_id', user.team_id)
            .eq('game_id', user.game_id);

        if (error) {
            showMessage({ type: 'warning', text: 'Шинэчлэл амжилтгүй боллоо.' });
            return;
        }

        getGameDtl();
    };


    const renderCellPlayer = (user, columnKey) => {
        const cellValue = user[columnKey];

        if (['player_name'].includes(columnKey)) {
            return (
                <User
                    avatarProps={{radius: "lg", src: user.player.image}}
                    description={`#${user.player_num} - ${user.player.role}`}
                    name={user.player.firstname}
                />
            );
        }

        switch (columnKey) {
            case "player_name":
                return (
                    <User avatarProps={{radius: "lg", src: user.player.image}}
                          description={'#' + user.player_num + '-' + user.player.role} name={user.player.firstname}>
                        {user.player.firstname}
                    </User>
                );
            case "point":
                return (
                    <div className={'flex flex-row justify-center items-center gap-2'}>
                        <span>{cellValue}</span>
                        <div className={'flex flex-row justify-center items-center gap-1'}>
                            <button className="px-1 text-sm bg-primary-600 rounded"
                                    onClick={() => updateStat(user, columnKey, 2, 'plus')}>+
                            </button>
                            <button className="px-1 text-sm bg-secondary-400 rounded"
                                    onClick={() => updateStat(user, columnKey, 2, 'minus')}>-
                            </button>
                        </div>
                    </div>
                );
            case "three_point":
                return (
                    <div className={'flex flex-row justify-center items-center gap-2'}>
                        <span>{cellValue}</span>
                        <div className={'flex flex-row justify-center items-center gap-1'}>
                            <button className="px-1 text-sm bg-primary-600 rounded"
                                    onClick={() => updateStat(user, columnKey, 1, 'plus')}>+
                            </button>
                            <button className="px-1 text-sm bg-secondary-400 rounded"
                                    onClick={() => updateStat(user, columnKey, 1, 'minus')}>-
                            </button>
                        </div>
                    </div>
                );
            case "rebount":
                return (
                    <div className={'flex flex-row justify-center items-center gap-2'}>
                        <span>{cellValue}</span>
                        <div className={'flex flex-row justify-center items-center gap-1'}>
                            <button className="px-1 text-sm bg-primary-600 rounded"
                                    onClick={() => updateStat(user, columnKey, 1, 'plus')}>+
                            </button>
                            <button className="px-1 text-sm bg-secondary-400 rounded"
                                    onClick={() => updateStat(user, columnKey, 1, 'minus')}>-
                            </button>
                        </div>
                    </div>
                );
            case "steal":
                return (
                    <div className={'flex flex-row justify-center items-center gap-2'}>
                        <span>{cellValue}</span>
                        <div className={'flex flex-row justify-center items-center gap-1'}>
                            <button className="px-1 text-sm bg-primary-600 rounded"
                                    onClick={() => updateStat(user, columnKey, 1, 'plus')}>+
                            </button>
                            <button className="px-1 text-sm bg-secondary-400 rounded"
                                    onClick={() => updateStat(user, columnKey, 1, 'minus')}>-
                            </button>
                        </div>
                    </div>
                );
            case "block":
                return (
                    <div className={'flex flex-row justify-center items-center gap-2'}>
                        <span>{cellValue}</span>
                        <div className={'flex flex-row justify-center items-center gap-1'}>
                            <button className="px-1 text-sm bg-primary-600 rounded"
                                    onClick={() => updateStat(user, columnKey, 1, 'plus')}>+
                            </button>
                            <button className="px-1 text-sm bg-secondary-400 rounded"
                                    onClick={() => updateStat(user, columnKey, 1, 'minus')}>-
                            </button>
                        </div>
                    </div>
                );
            case "turnovers":
                return (
                    <div className={'flex flex-row justify-center items-center gap-2'}>
                        <span>{cellValue}</span>
                        <div className={'flex flex-row justify-center items-center gap-1'}>
                            <button className="px-1 text-sm bg-primary-600 rounded"
                                    onClick={() => updateStat(user, columnKey, 1, 'plus')}>+
                            </button>
                            <button className="px-1 text-sm bg-secondary-400 rounded"
                                    onClick={() => updateStat(user, columnKey, 1, 'minus')}>-
                            </button>
                        </div>
                    </div>
                );
            case "successful_free_throw":
                return (
                    <div className={'flex flex-row justify-center items-center gap-2'}>
                        <span>{cellValue}</span>
                        <div className={'flex flex-row justify-center items-center gap-1'}>
                            <button className="px-1 text-sm bg-primary-600 rounded"
                                    onClick={() => updateStat(user, columnKey, 1, 'plus')}>+
                            </button>
                            <button className="px-1 text-sm bg-secondary-400 rounded"
                                    onClick={() => updateStat(user, columnKey, 1, 'minus')}>-
                            </button>
                        </div>
                    </div>
                );
            case "total_free_throw":
                return (
                    <div className={'flex flex-row justify-center items-center gap-2'}>
                        <span>{cellValue}</span>
                        <div className={'flex flex-row justify-center items-center gap-1'}>
                            <button className="px-1 text-sm bg-primary-600 rounded"
                                    onClick={() => updateStat(user, columnKey, 1, 'plus')}>+
                            </button>
                            <button className="px-1 text-sm bg-secondary-400 rounded"
                                    onClick={() => updateStat(user, columnKey, 1, 'minus')}>-
                            </button>
                        </div>
                    </div>
                );
            case "fouls":
                return (
                    <div className={'flex flex-row justify-center items-center gap-2'}>
                        <span>{cellValue}</span>
                        <div className={'flex flex-row justify-center items-center gap-1'}>
                            <button className="px-1 text-sm bg-primary-600 rounded"
                                    onClick={() => updateStat(user, columnKey, 1, 'plus')}>+
                            </button>
                            <button className="px-1 text-sm bg-secondary-400 rounded"
                                    onClick={() => updateStat(user, columnKey, 1, 'minus')}>-
                            </button>
                        </div>
                    </div>
                );
        }
    };

    const getGameDtl = async () => {
        const {data: gameDtl, error: gameDtlError} = await supabase
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
            showMessage({type: "warning", text: "data дуудах үед алдаа гарлаа."});
        } else {

            const data = [];

            gameDtl.forEach((it, index) => {
                const away_team_totals = {
                    key: `away-${index}`,
                    gameDtlid: it.id,
                    team_id: it.away_team.id,
                    name: it.away_team.name,
                    sport_type: it.away_team.sport_type,
                    gender: it.away_team.gender,
                    image: it.away_team.image,
                    team_point: it.away_team_point,
                    team_three_point: it.away_team_three_point,
                    plus_minus: it.away_plus_minus,
                    win_or_loss: it.away_win === it.master_win ? 3 : it.away_win
                };

                const master_team_totals = {
                    key: `master-${index}`,
                    gameDtlid: it.id,
                    team_id: it.master_team.id,
                    name: it.master_team.name,
                    sport_type: it.master_team.sport_type,
                    gender: it.master_team.gender,
                    image: it.master_team.image,
                    team_point: it.master_team_point,
                    team_three_point: it.master_team_three_point,
                    plus_minus: it.master_plus_minus,
                    win_or_loss: it.master_win === it.away_win ? 3 : it.master_win
                };

                data.push(away_team_totals);
                data.push(master_team_totals);
            });

            setGameDtlList(data);
            getTeamPlayers(data);
        }
    };

    const getTeamPlayers = async (data) => {
        const masterPlayers = [];
        const awayPlayers = [];

        for (const item of data) {
            const {data: gamePlayers, error: gameDtlError} = await supabase
                .from('basketball_player_dtl')
                .select(`
            id,
            team_id,
            game_id,
            player_num,
            player_name,
            starting_player_status,
            three_point,
            point,
            rebount,
            steal,
            block,
            turnovers,
            total_free_throw,
            successful_free_throw,
            loss_free_throw,
            fouls,
            player:player_id (
                id,
                firstname,
                job_position,
                role,
                image
            )
        `)
                .eq("active_flag", 1)
                .eq("team_id", item.team_id)
                .eq("game_id", item.gameDtlid);

            if (gameDtlError) {
                showMessage({type: "warning", text: "data дуудах үед алдаа гарлаа."});
            } else if (gamePlayers?.length) {
                if (item.key.startsWith("master")) {
                    masterPlayers.push(...gamePlayers);
                } else if (item.key.startsWith("away")) {
                    awayPlayers.push(...gamePlayers);
                }
            }
        }

        setMasterPlayersData(masterPlayers);
        setAwayPlayersData(awayPlayers);
    };


    return (
        <div className={'w-full flex flex-col justify-center items-center gap-10'}>
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
            </div>
            <div className="w-full flex flex-row justify-center items-start gap-10">
                <div>
                    <Table isStriped className="w-full" aria-label="Team statistics table">
                        <TableHeader columns={empColumns}>
                            {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                        </TableHeader>
                        <TableBody items={masterPlayersData}>
                            {(item) => (
                                <TableRow key={item.key}>
                                    {(columnKey) => <TableCell>{renderCellPlayer(item, columnKey)}</TableCell>}
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div>
                    <Table isStriped className="w-full" aria-label="Team statistics table">
                        <TableHeader columns={empColumns}>
                            {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                        </TableHeader>
                        <TableBody items={awayPlayersData}>
                            {(item) => (
                                <TableRow key={item.key}>
                                    {(columnKey) => <TableCell>{renderCellPlayer(item, columnKey)}</TableCell>}
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

        </div>
    );
}