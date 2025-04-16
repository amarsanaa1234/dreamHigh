import React, {useEffect, useState} from 'react'
import {supabase} from "../../tools/SupabaseClient.jsx";
import {showMessage} from "../../tools/Tools.jsx";
import {Image} from "@heroui/react";

export const Home = () => {
  const [dataList, setDataList] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data, error } = await supabase.from("team").select("*");
    if(error){
      showMessage({ type: "warning", text: "data дуудах үед алдаа гарлаа." });
    }else{
      setDataList(data);
    }
  }

  return (
    <>
      {dataList.map((item, index) => (
        <div key={index}>
          <Image
            isZoomed
            alt="HeroUI Fruit Image with Zoom"
            src={item.image}
            width={240}
          />
          {item.name}
        </div>
      ))}
    </>
  );
}