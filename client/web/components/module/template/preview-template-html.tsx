import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { FileText, X } from "lucide-react"
import { ReactNode } from "react"

export function PreviewTemplateHtml({
  children,
  html,
}: {
  children: ReactNode
  html: string
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent showCloseButton={false}>
        <SheetHeader className="px-4 py-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-start gap-2">
              <FileText className="mt-1 shrink-0" />
              <div>
                <SheetTitle>Email Preview</SheetTitle>
                <SheetDescription className="line-clamp-1">
                  Preview of your currunt templete's content
                </SheetDescription>
              </div>
            </div>
            <SheetClose>
              <Button variant="ghost" size="icon-lg">
                <X />
              </Button>
            </SheetClose>
          </div>
        </SheetHeader>
        <div className="h-full w-full overflow-auto">
          <iframe
            srcDoc={html}
            title="Email preview"
            className="h-full w-full border-0"
            sandbox=""
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}
