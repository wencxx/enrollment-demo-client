import { Button } from "@/components/ui/button"
import { Printer, Download } from "lucide-react"
import SOAComponent from "@/FldrPages/FldrStudent/statement-of-account/statement-of-account"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function StatementOfAccount() {
  return (
    <>
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-end">


          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.print()} className="flex items-center gap-2 print:hidden">
              <Printer className="h-4 w-4" />
              Print
            </Button>
            <Button variant="outline" className="flex items-center gap-2 print:hidden">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>

        <SOAComponent />
      </div>
    </>
  )
}

