import { columns } from "@/components/FldrDatatable/permissions-columns";
import { DataTable } from "@/components/FldrDatatable/data-table";
import { GrantPermForm } from "@/components/FldrForm/entrygrantperm"
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
import { grantedPermissions } from "@/FldrTypes/routes";

function GrantPermissionNOTUSED() {
    const [grantedPerm, setGrantedPerm] = useState<grantedPermissions[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    const getAllGrantedPerm = async () => {
        try {
            setLoading(true)
            const res = await axios.get(`${plsConnect()}/api/Permission`)

            if(res.status === 200){
                setGrantedPerm(res.data)
            }
        } catch (error: unknown) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getAllGrantedPerm();
    }, []);

    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline">
                        <Plus />
                        Grant permission
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-lg font-medium">Grant permission</DialogTitle>
                        <DialogDescription>
                        </DialogDescription>
                    </DialogHeader>
                    <GrantPermForm getAllGrantedPerm={getAllGrantedPerm} />
                </DialogContent>
            </Dialog>
            <div className="mt-4">
                <DataTable columns={columns} data={grantedPerm} title="granted permissions" loading={loading} />
            </div>
        </>
    );
}

export default GrantPermissionNOTUSED;