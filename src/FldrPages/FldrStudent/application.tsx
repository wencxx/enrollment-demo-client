import { ApplicationForm } from "@/components/FldrForm/entryapplication"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"
import { Plus } from 'lucide-react'

export default function Application() {


  return (
    <>
      <div className="space-x-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Plus />
              Apply
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-scroll scrollbar-hidden" aria-labelledby="dialog-title">
            <ApplicationForm />
          </DialogContent>
        </Dialog>
      </div>
      <Toaster />
    </>
  )
}
