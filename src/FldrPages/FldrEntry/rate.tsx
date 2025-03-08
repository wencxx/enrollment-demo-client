import { RateCol, columns } from "@/components/FldrDatatable/rate-columns";
import { DataTable } from "@/components/FldrDatatable/data-table";
import { useState, useEffect } from "react";
import axios from "axios";
import { plsConnect } from "@/FldrClass/ClsGetConnection";



export default function Rate() {
    const [data, setData] = useState<RateCol[]>([]);

    useEffect(() => {
        axios
            .get<RateCol[]>(`${plsConnect()}/API/WEBAPI/ListController/ListRate`)
            .then((response) => {
                setData(response.data);
                console.log("wtf", data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);


    return (
        <>
            <DataTable columns={columns} data={data} />
        </>

    );
}