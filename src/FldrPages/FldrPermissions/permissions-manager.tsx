import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react";
import axios from "axios";
import { plsConnect } from "@/FldrClass/ClsGetConnection";
import { Group } from "@/FldrTypes/routes";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { toast } from "sonner";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
  } from "@/components/ui/collapsible"
  
  

function GrantPermission() {
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isOpen, setIsOpen] = useState<boolean>(true);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [allObjects, setAllObjects] = useState<string[]>([]);

    const [allowedPermissions, setAllowedPermissions] = useState<string[]>([]);
    const [notAllowedPermissions, setNotAllowedPermissions] = useState<string[]>([]);
    const [permissionsLoading, setPermissionsLoading] = useState<boolean>(false);

    const [save, setSave] = useState(false);

    useEffect(() => {

        const fetchGroups = async () => {
            try {
                const response = await axios.get<Group[]>(`${plsConnect()}/api/Group/ListAllGroups`);
                setGroups(response.data);
                } catch (error) {
                console.error("Failed to fetch groups", error);
                } finally {
                setLoading(false);
                }
            };
            
            fetchGroups();
    }, [])

    const handleGroupDoubleClick = async (group: Group) => {
        setAllowedPermissions([]);
        setNotAllowedPermissions([]);
        setPermissionsLoading(true);

        setSelectedGroup(group);
        setPermissionsLoading(true);
        try {
            const allowedResponse = await axios.get<{ objectName: string }[]>(`${plsConnect()}/api/Permission/ListPermissions?groupCode=${group.groupCode}`);
            const allObjectsResponse = await axios.get<{ objectName: string }[]>(`${plsConnect()}/api/Object/ListObjects`);
    
            const allowed = allowedResponse.data.map(p => p.objectName);
            const all = allObjectsResponse.data.map(o => o.objectName);
            const notAllowed = all.filter(objectName => !allowed.includes(objectName));
    
            setAllowedPermissions(allowed);
            setAllObjects(all);
            setNotAllowedPermissions(notAllowed);
        } catch (error) {
            console.error("Failed to fetch permissions", error);
        } finally {
            setPermissionsLoading(false);
        }
    };

    const handleAddPermission = (permission: string) => {
        setAllowedPermissions(prev => [...prev, permission]);
        setNotAllowedPermissions(prev => prev.filter(p => p !== permission));
    };
    
    const handleRemovePermission = (permission: string) => {
        setNotAllowedPermissions(prev => [...prev, permission]);
        setAllowedPermissions(prev => prev.filter(p => p !== permission));
    };

    const handleSavePermissions = async () => {
        if (!selectedGroup) return;
    
        setSave(true);
        try {
            const payload = allowedPermissions.map((permission) => ({
                groupCode: selectedGroup.groupCode,
                objectName: permission,
            }));
    
            await axios.post(`${plsConnect()}/api/Permission/SavePermissions`, payload);
            console.log("Saving permissions:", payload);
            toast("Permissions saved successfully. Affected users must log back in.");
        } catch (error) {
            console.error("Failed to save permissions", error); 
            toast("Failed to save. Please try again.");
        } finally {
            setSave(false);
        }
    };
    

    return (
    <div>
      {loading ? (
        <div className="text-center p-4">Loading groups...</div>
      ) : (
        <>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold mb-4">User Groups</h2>
            <CollapsibleTrigger>
                <Button variant="outline" size="sm">
                    <span>Collapse</span>
                </Button>
            </CollapsibleTrigger>
        </div>
        <CollapsibleContent>
        <div className="rounded-md border">
        <Table className="text-lg">
        <TableHeader>
            <TableRow>
            <TableHead className="w-[30%]">Group Code</TableHead>
            <TableHead>Group Name</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {groups.map((group) => (
            <TableRow
                key={group.groupCode}
                className="hover:bg-gray-50 cursor-pointer"
                onDoubleClick={() => handleGroupDoubleClick(group)}
          >
            <TableCell>{group.groupCode}</TableCell>
            <TableCell className="font-medium">{group.groupName}</TableCell>
            </TableRow>
            ))}
        </TableBody>
        </Table>
        </div>
        </CollapsibleContent>
        </Collapsible>
        </>
      )}

      {selectedGroup && (
        <div className="mt-2">
          <h3 className="text-xl font-semibold mb-4">
            Editing Permissions for: <span className="text-gray-600">{selectedGroup.groupName}</span>
          </h3>

          <div className="flex gap-8">
            <div className="w-1/2">
              <h4 className="font-bold mb-2">Allowed</h4>
                {/* allowed */}
                <div className="border rounded-md p-4 min-h-[200px] flex flex-col gap-2">
                {permissionsLoading ? (
                    <div className="text-center text-gray-500">Loading...</div>
                ) : allowedPermissions.length > 0 ? (
                    allowedPermissions.map((permission) => (
                    <div
                        key={permission}
                        className="px-3 py-2 bg-green-100 rounded-md hover:bg-green-200 cursor-pointer"
                        onClick={() => handleRemovePermission(permission)}
                    >
                        {permission}
                    </div>
                    ))
                ) : (
                    <div className="text-center text-gray-400">No permissions allowed</div>
                )}
                </div>
            </div>

            <div className="w-1/2">
              <h4 className="font-bold mb-2">Not Allowed</h4>
                {/* not allowed */}
                <div className="border rounded-md p-4 min-h-[200px] flex flex-col gap-2">
                {permissionsLoading ? (
                    <div className="text-center text-gray-500">Loading...</div>
                ) : notAllowedPermissions.length > 0 ? (
                    notAllowedPermissions.map((permission) => (
                    <div
                        key={permission}
                        className="px-3 py-2 bg-red-100 rounded-md hover:bg-red-200 cursor-pointer"
                        onClick={() => handleAddPermission(permission)}
                    >
                        {permission}
                    </div>
                    ))
                ) : (
                    allObjects.map((permission) => (
                        <div
                            key={permission}
                            className="px-3 py-2 bg-red-100 rounded-md hover:bg-red-200 cursor-pointer"
                            onClick={() => handleAddPermission(permission)}
                        >
                            {permission}
                        </div>
                    ))
                )}
                </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button onClick={handleSavePermissions} disabled={save}>
                {save ? "Saving..." : "Save Changes"}
            </Button>
        </div>
        </div>
      )}
    </div>
    );
}

export default GrantPermission;