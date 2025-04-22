import { plsConnect } from "@/FldrClass/ClsGetConnection";
import axios from "axios";
import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle
} from "@/components/ui/dialog"
import { columns } from "@/components/FldrDatatable/enroll-description-columns";
import { DataTable } from "@/components/FldrDatatable/data-table";
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"
import { Plus } from "lucide-react";
import { EnrollDesciprtionForm } from "@/components/FldrForm/entryenrolldescription";

function EnrollDescription() {
    
    const [enrollDescription, setEnrollDescription] = useState([])
    const [loading, setLoading] = useState<boolean>(false)

    const getEnrollDescription = async () => {
        try {
            setLoading(true)
            const res = await axios.get(`${plsConnect()}/api/EnrollDescription`)
            
            if(res.status === 200) {
                setEnrollDescription(res.data)
            }
        } catch (error) {
            console.error("Error fetching enroll description:", error);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getEnrollDescription()
    }, [])
    return (
        <>
            <div className="container py-6">
                <div className="space-x-2">
                    {/* <h2 className="text-xl font-semibold">Courses</h2> */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline">
                                <Plus className="mr-2 h-4 w-4" />
                                Add new enroll description
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogTitle className="text-lg font-semibold">Enroll Description</DialogTitle>
                            <EnrollDesciprtionForm getEnrollDescription={getEnrollDescription} />
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="mt-4">
                    <DataTable
                        columns={columns({getEnrollDescription})}
                        data={enrollDescription}
                        loading={loading}
                        title="enroll description"
                    />
                </div>
                <Toaster />
            </div>
        </>
    );
}

export default EnrollDescription;