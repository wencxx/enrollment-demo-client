import { columns } from "@/components/FldrDatatable/routes-columns";
import { DataTable } from "@/components/FldrDatatable/data-table";
import { useEffect, useState } from "react";
import axios from "axios";
import { plsConnect } from "@/FldrClass/ClsGetConnection";
import { routes } from "@/FldrTypes/routes";

function RoutePage() {
    const [routes, setRoutes] = useState<routes[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    const getAllRoutes = async () => {
        try {
            setLoading(true)
            const res = await axios.get(`${plsConnect()}/api/Object`)

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
            {/* <Dialog>
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
                    <RoutesForm getAllRoutes={getAllRoutes} />
                </DialogContent>
            </Dialog> */}
            <div className="mt-4">
                <DataTable columns={columns} data={routes} title="routes" loading={loading} />
            </div>
        </>
    );
}

export default RoutePage;