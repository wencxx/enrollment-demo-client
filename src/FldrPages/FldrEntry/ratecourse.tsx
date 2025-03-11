import { columns } from "@/components/FldrDatatable/ratecourse-columns";
import { DataTable } from "@/components/FldrDatatable/data-table";
import { useState, useEffect } from "react";
import axios from "axios";
import { plsConnect } from "@/FldrClass/ClsGetConnection";
import { RateCourseCol } from "@/FldrTypes/ratecourse-col";



export default function RateCourse() {
  const [data, setData] = useState<RateCourseCol[]>([]);

  useEffect(() => {
    axios
      .get<RateCourseCol[]>(`${plsConnect()}/API/WEBAPI/ListController/ListRateCourse`)
      .then((response) => {
        setData(response.data);
        console.log("wtf", data);
        console.log("plsConnect:", plsConnect);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);


return (
    <>
        <DataTable columns={columns} data={data}/>
    </>
    
  );
}
