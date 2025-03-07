import { DataTable } from "@/components/FldrDatatable/data-table"
import { CompanyForm } from "@/components/FldrForm/entrycompany"
import { CompanyCol, columns } from "@/components/FldrDatatable/company";
import { useState, useEffect } from "react";
import axios from "axios";
import { plsConnect } from "@/FldrClass/ClsGetConnection";

export default function Company() {
  const [data, setData] = useState<CompanyCol[]>([]);

  useEffect(() => {
    axios
      .get<CompanyCol[]>(`${plsConnect}/API/WEBAPI/ListController/ListCompany`)
      .then((response) => {
        setData(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <>
      <div className="flex gap-6">
      <div className="flex-1">
        <CompanyForm />
      </div>
      <div className="flex-2">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
    </>
  )
}
