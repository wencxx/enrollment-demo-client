import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import useAuthStore from "@/FldrStore/auth"
import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function Unauthorized() {
  const store = useAuthStore()
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  console.log("Unauthorized page loaded")
  const handleGoBack = () => {
    window.history.go(-3)
  }

  const handleLogout = () => {
    store.logout()
    window.location.href = "/login"
  }

  return (
    <>
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md p-8 space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Unauthorized</h1>
          <p className="text-muted-foreground">
            You don't have permission to access this page. Please log in with the appropriate credentials.
          </p>
        </div>

        <div className="flex flex-col items-center gap-2 pt-4">
          <Button variant="outline" onClick={handleGoBack} className="flex items-center cursor-pointer ">
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          <p onClick={() => setIsAlertOpen(true)} className="text-muted-foreground underline cursor-pointer text-sm pb-0">Log out</p>
        </div>
      </div>
    </div>

    <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Logout</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to logout?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleLogout} className="bg-red-500 text-white">Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  )
}

