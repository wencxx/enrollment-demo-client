import { columns } from "@/components/FldrDatatable/routes-columns";
import { DataTable } from "@/components/FldrDatatable/data-table";
import { Routesform } from "@/components/FldrForm/entryroutes"
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogHeader,
    DialogDescription
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import { DialogTitle } from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import axios from "axios";
import { plsConnect } from "@/FldrClass/ClsGetConnection";
import { routes } from "@/FldrTypes/routes";

function Routes() {
    const [routes, setRoutes] = useState<routes[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    const getAllRoutes = async () => {
        try {
            setLoading(true)
            const res = await axios.get(`${plsConnect()}/api/Permission`)

            if(res.status === 200){
                setRoutes(res.data)
            }
        } catch (error: unknown) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getAllRoutes();
    }, []);

    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline">
                        <Plus />
                        Add new route
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-lg font-medium">Add new route</DialogTitle>
                        <DialogDescription>
                        </DialogDescription>
                    </DialogHeader>
                    <Routesform getAllRoutes={getAllRoutes} />
                </DialogContent>
            </Dialog>
            <div className="mt-4">
                <DataTable columns={columns} data={routes} title="granted permissions" loading={loading} />
            </div>
        </>
    );
}

export default Routes;