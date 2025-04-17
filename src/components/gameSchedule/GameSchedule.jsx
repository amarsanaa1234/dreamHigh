import React, {useEffect, useState} from 'react';
import {Button, Image, Select, SelectItem} from "@heroui/react";
import {supabase} from "../../tools/SupabaseClient.jsx";
import {showMessage} from "../../tools/Tools.jsx";
import vs from '../../assets/vsImage.png';

export const GameSchedule = () => {

  const [teamList, setTeamList] = useState([]);

  const convertToSelectionType = (data) => {
    return {key: data.id, label: data.name}
  }

  useEffect(() => {
    const fetchTeams = async () => {
      const { data, error } = await supabase.from("team").select("*").eq("active_flag", 1);
      if (error) {
        showMessage({ type: "warning", text: "data дуудах үед алдаа гарлаа." });
      } else {
        setTeamList(data.map((it) => convertToSelectionType(it)));
      }
    };

    fetchTeams();
  }, []);

    return(
      <div className="flex flex-col justify-center items-center gap-12">
        <div className="flex flex-row justify-center items-center">
          <Select
            className="w-[400px]"
            color={'success'}
            label="1-р Баг"
            placeholder="Тоглох багаа сонгоно уу?"
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
          >
            {teamList.map((animal) => (
              <SelectItem key={animal.key}>{animal.label}</SelectItem>
            ))}
          </Select>
        </div>
        <div className="flex flex-row justify-center items-center w-screen">
          <Button color="primary" size="lg">
            Хадгалах
          </Button>
        </div>
      </div>
    )
}