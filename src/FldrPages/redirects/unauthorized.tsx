import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function Unauthorized() {
  console.log("Unauthorized page loaded")
  const handleGoBack = () => {
    window.history.go(-3)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md p-8 space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Unauthorized</h1>
          <p className="text-muted-foreground">
            You don't have permission to access this page. Please log in with the appropriate credentials.
          </p>
        </div>

        <div className="flex justify-center pt-4">
          <Button variant="outline" onClick={handleGoBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  )
}

