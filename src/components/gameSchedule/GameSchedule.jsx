import React, {useRef, useState} from 'react';
import {Button, Checkbox, Form, Image, Input, Select, SelectItem} from "@heroui/react";
import {supabase} from "../../tools/SupabaseClient.jsx";
import {showMessage} from "../../tools/Tools.jsx";
import vs from '../../assets/vsImage.png';

export const GameSchedule = () => {

  const [teamList, setTeamList] = useState([]);
  const [errors, setErrors] = useState({});
  const [sportType, setSportType] = useState();
  const formRef = useRef();

  const convertToSelectionType = (data) => {
    return {key: data.id, label: data.name}
  }

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
      console.log('rasdasdows', rows);
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

    return(
      <div className="flex flex-col justify-center items-center gap-12">
        <Form
            className="flex flex-col justify-center items-center gap-12"
            onSubmit={callTypeAndGenderTeams}
        >
          <div className="flex flex-row justify-center items-center gap-12">
            <Select
                className="w-[400px]"
                color={'warning'}
                label="Спортын төрөл"
                defaultSelectedKeys={'1'}
                name="type"
            >
              <SelectItem key={'1'}>BASKETBALL</SelectItem>
              <SelectItem key={'2'}>VOLLEYBALL</SelectItem>
            </Select>
            <Select
                className="w-[400px]"
                color={'warning'}
                label="Хүйс"
                defaultSelectedKeys={'1'}
                name="gender"
            >
              <SelectItem key={'1'}>Эрэгтэй</SelectItem>
              <SelectItem key={'2'}>Эмэгтэй</SelectItem>
            </Select>
          </div>
          <div className="gap-4 w-60 flex flex-col flex-wrap">
            <Button className="w-full" color="primary" type="submit" size="sm">
              Хайх
            </Button>
          </div>
        </Form>
        <Form
              ref={formRef}
              className="flex flex-col justify-center items-center gap-12"
              validationErrors={errors}
              onSubmit={onSubmit}
          >
            <div className="flex flex-row justify-center items-center">
              <Select
                  className="w-[400px]"
                  color={'success'}
                  label="1-р Баг"
                  placeholder="Тоглох багаа сонгоно уу?"
                  name="master_team_id"
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
                  className="w-[400px]"
                  color={'success'}
                  label="1-р Баг"
                  placeholder="Эсрэг багаа сонгоно уу?"
                  name="away_team_id"
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
      </div>
    )
}