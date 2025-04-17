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

  useEffect(() => {
    fetchMultipleTables();
  }, []);

  const fetchMultipleTables = async () => {
      const { data, error } = await supabase.from("team").select("*").eq("active_flag", 1);
      if (!error && data) {
        // combinedData = [...combinedData, ...data];
        const malebs = [];
        const malevl = [];
        const femalebs = [];
        const femalevl = [];
        data.map(it => {
          if(it.sport_type === 1 && it.gender === 1){
            malebs.push(it);
          }else if(it.sport_type === 1 && it.gender === 2){
            femalebs.push(it)
          }
          else if(it.sport_type === 2 && it.gender === 1){
            malevl.push(it)
          }
          else if (it.sport_type === 2 && it.gender === 2){
            femalevl.push(it)
          }
        })
        setMaleBasketball(malebs);
        setFemaleBasketball(femalebs);
        setMaleVolleyball(malevl);
        setFemaleVolleyball(femalevl);
      }
  };
  
  const createTable = (dataList) => (
    <Table
      isHeaderSticky
      aria-label="Team list"
      className="max-h-[600px] overflow-auto mt-4"
    >
      <TableHeader>
        <TableColumn className="w-[400px]">Nickname</TableColumn>
        <TableColumn>W</TableColumn>
        <TableColumn>L</TableColumn>
        <TableColumn>W/L Ratio</TableColumn>
        <TableColumn>Sport Type</TableColumn>
        <TableColumn>Actions</TableColumn>
      </TableHeader>
      <TableBody emptyContent={"Мэдээлэл олдсонгүй"}>
        {dataList.map((item, index) => (
          <TableRow key={index}>
            <TableCell>
              <div className="flex items-center gap-2">
                <Image
                  src={
                    item.logo ||
                    "https://qcgqnbovwktkbdbsiidk.supabase.co/storage/v1/object/public/dream-high-image/team/1744816634923.jpg"
                  }
                  alt={item.nickname}
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
              <Dropdown backdrop="blur">
                <DropdownTrigger>
                  <Button variant="bordered" size="sm">
                    Тоглолт
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Өмнөх тоглолтууд" variant="faded">
                  <DropdownItem key="1">VS Team A — 88:76</DropdownItem>
                  <DropdownItem key="2">VS Team B — 74:80</DropdownItem>
                  <DropdownItem key="3">VS Team C — 91:87</DropdownItem>
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
      <div className="bg-white p-4 rounded-xl shadow">
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
          zl lalrasaas
          asdasdasdasasdas
          sd
        </Tabs>
      </div>
    </div>
  );
};
