import { useState, useEffect } from "react";
import axios from "axios";
import { group, User } from "@/FldrTypes/types";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"
import { plsConnect } from "@/FldrClass/ClsGetConnection";
import { Plus } from 'lucide-react'
import { UserForm } from "@/components/FldrForm/entryuser";
import { UserTable } from "@/components/FldrDatatable/users-columns";

export default function Users() {
    const [groups, setGroups] = useState<group[]>([])
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false);

//     const getGroups = async () => {
//         

  const getAllUsers = async () => {
    try {
        setLoading(true)
        const res = await axios.get(`${plsConnect()}/API/WebAPI/UserController/AllUsers`)

        if (res.status === 200) {
            const usersData = res.data.map((user: User) => ({
                ...user,
                groupName: groups.find(group => group.groupCode == user.groupCode)?.groupName || '--'
            }));
            setUsers(usersData);
        }

        console.log(res.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

    const getGroups = async () => {
    try {
            const res = await axios.get(`${plsConnect()}/api/Group`)

            if (res.data.length) {
                setGroups(res.data)
            }
        } catch (error: unknown) {
            console.log(error)
        }
    }

    useEffect(() => {
        getGroups();
    }, []);

    useEffect(() => {
        if (groups.length > 0) {
            getAllUsers();
        }
    }, [groups]);

  return (
        <>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add new user
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <UserForm
                                groups={groups}
                                onCancel={getAllUsers}
                                onSuccess={() => {
                                    getAllUsers();
                                    setIsDialogOpen(false);
                                }}
                            />
                        </DialogContent>
                      </Dialog>
            <div className="mt-4">
                <UserTable data={users} loading={loading} onRefresh={getAllUsers} />
            </div>
            <Toaster />
        </>
    );
}

