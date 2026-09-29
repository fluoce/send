import { ReactNode } from "react"
import { TemplateEditorProvider } from "@/context/template-editor-context"
import { TemplateEditorTopbar } from "@/components/module/template/template-editor-topbar"

export default function TemplateEditeLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <TemplateEditorProvider>
      <div className="flex h-full w-full flex-col gap-2">
        <TemplateEditorTopbar />
        <div className="w-full flex-1 overflow-x-auto px-4">{children}</div>
      </div>
    </TemplateEditorProvider>
  )
}
