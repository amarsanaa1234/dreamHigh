import React, {useEffect, useRef, useState} from 'react';
import {
  Button, Card, CardBody,
  Checkbox, Chip,
  Form,
  Image,
  Input,
  Select,
  SelectItem, Spinner, Tab,
  Table,
  TableBody, TableCell,
  TableColumn,
  TableHeader, TableRow, Tabs
} from "@heroui/react";
import {supabase} from "../../tools/SupabaseClient.jsx";
import {isNullOrEmptyArray, showMessage} from "../../tools/Tools.jsx";
import vs from '../../assets/vsImage.png';
import {useNavigate, useParams} from "react-router-dom";

export const GameSchedule = () => {

  const [teamList, setTeamList] = useState([]);
  const [errors, setErrors] = useState({});
  const [sportType, setSportType] = useState();
  const [basketballMale, setBasketballMale] = useState([]);
  const [basketballFemale, setBasketballFemale] = useState([]);
  const [volleyballMale, setVolleyballMale] = useState([]);
  const [volleyballFemale, setVolleyballFemale] = useState([]);

  const formRef = useRef();
  const navigate = useNavigate();

  const columns = [
    {key: "master_team_name", label: "1 - Баг"},
    {key: "status", label: ""},
    {key: "away_team_name", label: "2 - Баг"}
  ];

  const convertToSelectionType = (data) => {
    return {key: data.id, label: data.name}
  }

  useEffect(() => {
    getCallGameSchedule();
  }, []);

  const getCallGameSchedule = async () => {
    const { data, error } = await supabase
      .from('game_dtl')
      .select(`
    id,
    master_team:master_team_id (
      id,
      name,
      gender,
      sport_type
    ),
    away_team:away_team_id (
      id,
      name,
      gender,
      sport_type
    )
  `)
      .eq('active_flag', 1);

    if (error) {
      showMessage({ type: "warning", text: "data дуудах үед алдаа гарлаа." });
    } else {
      const transformed = data.map((item) => ({
        id: item.id,
        master_team_name: item.master_team?.name || '',
        master_team_gender: item.master_team?.gender === 1 ? 'male' : 'female',
        master_team_sport_type: item.master_team?.sport_type === 1 ? 'basketBall' : 'volleyBall',

        away_team_name: item.away_team?.name || '',
        away_team_gender: item.away_team?.gender === 1 ? 'male' : 'female',
        away_team_sport_type: item.away_team?.sport_type === 1 ? 'basketBall' : 'volleyBall',

        status: "VS",
      }));

      const basketballMale = [];
      const basketballFemale = [];
      const volleyballMale = [];
      const volleyballFemale = [];

      transformed.forEach((item) => {
        const gender = item.master_team_gender; // assume both teams have same gender
        const sportType = item.master_team_sport_type;

        if (sportType === 'basketBall' && gender === 'male') basketballMale.push(item);
        if (sportType === 'basketBall' && gender === 'female') basketballFemale.push(item);
        if (sportType === 'volleyBall' && gender === 'male') volleyballMale.push(item);
        if (sportType === 'volleyBall' && gender === 'female') volleyballFemale.push(item);
      });

      setBasketballMale(basketballMale);
      setBasketballFemale(basketballFemale);
      setVolleyballMale(volleyballMale);
      setVolleyballFemale(volleyballFemale);
    }
  }

  const MyTable = ({ data }) => {
    if (isNullOrEmptyArray(data)) {
      return <Card>
                <CardBody>
                  <p>Тоглолтын хуваарь байхгүй байна.</p>
                </CardBody>
              </Card>
    } else {
      return <Table aria-label="Game Schedule Table">
        <TableHeader columns={columns}>
          {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
        </TableHeader>
        <TableBody items={data}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    }
  };

  const callTypeAndGenderTeams = async (e) => {
    e.preventDefault();

    const filterData = Object.fromEntries(new FormData(e.currentTarget));
    setSportType(filterData);
    const { data, error } = await supabase.from("team")
        .select("*")
        .eq("active_flag", 1)
        .eq("sport_type", parseInt(filterData.type))
        .eq("gender", parseInt(filterData.gender));
    if (error) {
      showMessage({ type: "warning", text: "data дуудах үед алдаа гарлаа." });
    } else {
      setTeamList(data.map((it) => convertToSelectionType(it)));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));

    if (data.terms !== "true") {
      setErrors({ terms: "Итгэлгүй байгаамуудаа вуудада" });
      return;
    }



    const gameDtl = {
      master_team_id: parseInt(data.master_team_id),
      away_team_id: parseInt(data.away_team_id),
      master_team_point: 0,
      away_team_point: 0,
      master_team_loss_point: 0,
      away_team_loss_point: 0,
      master_plus_minus: 0,
      away_plus_minus: 0,
      win_team_id: 0,
      loss_team_id: 0,
      active_flag: 1
    };

    const { error } = await supabase.from("game_dtl").insert([gameDtl]).single();

    if (error) {
      console.error("Upload error:", error.message);
    }

    const { data: rows, error: err } = await supabase
        .from("game_dtl")
        .select("*")
        .eq("active_flag", 1)
        .in("master_team_id", [data.master_team_id, data.away_team_id])
        .in("away_team_id", [data.master_team_id, data.away_team_id]);

    if(err){
      showMessage({ type: "warning", text: "data дуудах үед алдаа гарлаа." });
    }else{
      console.log('rows', rows);
    }


    let team_ids = new Array(data.master_team_id, data.away_team_id);


    if(sportType?.type === '1'){
      for (const teamId of team_ids) {
        const { data: teamPlayers, error: playerErr } = await supabase
            .from("player")
            .select("*")
            .eq("active_flag", 1)
            .eq("team_id", teamId);

        if (playerErr) {
          showMessage({ type: "warning", text: "player data дуудах үед алдаа гарлаа." });
          continue;
        }

        for (const player of teamPlayers) {
          const basketballPlayerDtl = {
            team_id: teamId,
            game_id: rows[0].id,
            player_id: player.id,
            player_num: player.player_num,
            player_name: player.firstname,
            starting_player_status: player.starting_player_status,
            three_point: 0,
            point: 0,
            rebount: 0,
            steal: 0,
            block: 0,
            turnovers: 0,
            total_free_throw: 0,
            successful_free_throw: 0,
            loss_free_throw: 0,
            fouls: 0,
            active_flag: 1,
          };

          const { error: insertErr } = await supabase
              .from("basketball_player_dtl")
              .insert([basketballPlayerDtl])
              .single();

          if (insertErr) {
            console.error("Insert player_dtl error:", insertErr.message);
          }
        }
      }
    }else{
      for (const teamId of team_ids) {
        const { data: teamPlayers, error: playerErr } = await supabase
            .from("player")
            .select("*")
            .eq("active_flag", 1)
            .eq("team_id", teamId);

        if (playerErr) {
          showMessage({ type: "warning", text: "player data дуудах үед алдаа гарлаа." });
          continue;
        }

        for (const player of teamPlayers) {
          const volleyballPlayerDtl = {
            team_id: teamId,
            game_id: rows[0].id,
            player_id: player.id,
            player_num: player.player_num,
            player_name: player.firstname,
            starting_player_status: player.starting_player_status,
            block: 0,
            point: 0,
            attack: 0,
            opening: 0,
            opening_error: 0,
            active_flag: 1,
          };

          const { error: insertErr } = await supabase
              .from("volleyball_player_dtl")
              .insert([volleyballPlayerDtl])
              .single();

          if (insertErr) {
            console.error("Insert player_dtl error:", insertErr.message);
          }
        }
      }
    }
  }

  const renderCell = (user, columnKey) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case "master_team_name":
        return (
        <Card>
          <CardBody>
            <Chip className="capitalize" color="warning" variant="bordered">
              {cellValue}
            </Chip>
          </CardBody>
        </Card>
        );
      case "away_team_name":
        return (
          <Card>
            <CardBody>
              <Chip className="capitalize" color="warning" variant="bordered">
                {cellValue}
              </Chip>
            </CardBody>
          </Card>
        );
      case "status":
        return (
          <Card className={"flex justify-center items-center"}>
            <CardBody className={"flex justify-center items-center"}>
              <Button color={'primary'} variant="shadow" size={"sm"} onClick={() => navigate(`/gameMatch/${user.id}`)}>
                {cellValue}
              </Button>
            </CardBody>
          </Card>

        );

    }
  };

  const gameTable = [
    {
      id: 1,
      label: "Basketball - Эрэгтэй",
      content: <MyTable data={basketballMale}/>
    },
    {
      id: 2,
      label: "Basketball - Эмэгтэй",
      content: <MyTable data={basketballFemale}/>
    },
    {
      id: 3,
      label: "Volleyball - Эрэгтэй",
      content: <MyTable data={volleyballMale}/>
    },
    {
      id: 4,
      label: "Volleyball - Эмэгтэй",
      content: <MyTable data={volleyballFemale}/>
    },
  ]
  return (
    <div className="w-full flex flex-col justify-center items-center gap-12">
      <Form
        className="w-full flex flex-col justify-center items-center gap-12"
        onSubmit={callTypeAndGenderTeams}
      >
        <div className="w-full flex flex-row justify-center items-center gap-12">
          <Select
                className="w-80"
                color={'warning'}
                label="Спортын төрөл"
                defaultSelectedKeys={'1'}
                name="type"
                labelPlacement="outside"
            >
              <SelectItem key={'1'}>BASKETBALL</SelectItem>
              <SelectItem key={'2'}>VOLLEYBALL</SelectItem>
            </Select>
            <Select
              className="w-80"
                color={'warning'}
                label="Хүйс"
                defaultSelectedKeys={'1'}
                labelPlacement="outside"
                name="gender"
            >
              <SelectItem key={'1'}>Эрэгтэй</SelectItem>
              <SelectItem key={'2'}>Эмэгтэй</SelectItem>
            </Select>
          </div>
          <div className="gap-4 w-60 flex flex-col flex-wrap">
            <Button className="w-full" color={'warning'} type="submit" size="sm">
              Хайх
            </Button>
          </div>
        </Form>
      <Form
          ref={formRef}
          className="w-full flex flex-col justify-center items-center gap-12"
          validationErrors={errors}
          onSubmit={onSubmit}
      >
        <div className="w-full flex flex-row justify-center items-center">
          <Select
            className="w-80"
              color={'success'}
              label="1-р Баг"
              placeholder="Тоглох багаа сонгоно уу?"
              name="master_team_id"
              labelPlacement="outside"
          >
            {teamList.map((animal) => (
              <SelectItem key={animal.key}>{animal.label}</SelectItem>
            ))}
        </Select>
      <Image
        alt="HeroUI hero Image"
        src={vs}
        width={100}
        height={100}
      />
      <Select
        className="w-80"
        color={'success'}
        label="2-р Баг"
        placeholder="Эсрэг багаа сонгоно уу?"
        name="away_team_id"
        labelPlacement="outside"
          >
            {teamList.map((animal) => (
                <SelectItem key={animal.key}>{animal.label}</SelectItem>
            ))}
          </Select>
        </div>
        <div className="gap-4 w-60 flex flex-col flex-wrap">
          <Checkbox
              isRequired
              classNames={{label: "text-small",}}
              isInvalid={!!errors.terms}
              name="terms"
              validationBehavior="aria"
              value="true"
              onValueChange={() => setErrors((prev) => ({...prev, terms: undefined}))}
          >
            Хадгалахдаа итгэлтэй байна уу?
          </Checkbox>

          {errors.terms && <span className="text-danger text-small">{errors.terms}</span>}

          <div className="flex gap-4">
            <Button className="w-full" color="primary" type="submit" size="sm">
              Хадгалах
            </Button>
            <Button type="reset" variant="bordered" size="sm">
              Цэвэрлэх
            </Button>
          </div>
        </div>
      </Form>

        <Tabs key={'secondary'} aria-label="Tabs colors" color={'primary'} radius="full" items={gameTable} className="w-full flex flex-col justify-center items-center gap-12">
          {(item) => (
            <Tab key={item.id} title={item.label}>
              <Card>
                <CardBody>{item.content}</CardBody>
              </Card>
            </Tab>
          )}
        </Tabs>
      </div>
    )
}