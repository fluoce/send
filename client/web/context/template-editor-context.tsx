"use client"

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react"
import { TemplateType } from "@/types/data/template-data"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { useTemplateId } from "@/hooks/use-template-id"
import { useTemplate } from "@/hooks/use-template"
import { PageSpinner } from "@/components/shared/loader"
import { Nodata } from "@/components/ui/no-data"
import { ArrowUpRight, Form, RotateCcw } from "lucide-react"
import { dashboardRoute } from "@/const/route"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"
import { useSaveTemplateHtml } from "@/hooks/use-save-template-html"

type EditorType = "text" | "html"

type TemplateEditorContextType = {
  template: TemplateType | null
  refetchKey: number
  setRefetchKey: Dispatch<SetStateAction<number>>
  refetchTemplate: () => void
  isRefetching: boolean
  setEditor: Dispatch<SetStateAction<EditorType>>
  editor: EditorType
  save: (html: string) => void
  saveNow: (html: string) => Promise<void>
  setInitialHtml: (html: string) => void
  isSaving: boolean
}

const TemplateEditorContext = createContext<
  TemplateEditorContextType | undefined
>(undefined)

export function TemplateEditorProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [editor, setEditor] = useState<EditorType>("text")

  const [refetchKey, setRefetchKey] = useState<number>(0)

  const workspaceId = useWorkspaceId()

  const templateId = useTemplateId()

  const { data, isLoading, refetch, isRefetching } = useTemplate({
    templateId,
    workspaceId,
  })

  const { isSaving, save, saveNow, setInitialHtml } = useSaveTemplateHtml({
    templateId,
    workspaceId,
  })

  function refetchTemplate() {
    refetch().then(() => {
      setRefetchKey((prev) => prev + 1)
      toast.success("Template has been refetched successfully")
    })
  }

  useEffect(() => {
    if (data?.data?.template) {
      setInitialHtml(data?.data?.template?.html || "")
    }
  }, [data?.data?.template, data?.data?.template?.html, setInitialHtml])

  const value = {
    template: data?.data?.template ?? null,
    refetchKey,
    setRefetchKey,
    refetchTemplate,
    isRefetching,
    editor,
    setEditor,
    save,
    saveNow,
    setInitialHtml,
    isSaving,
  }

  if (isLoading) {
    return <PageSpinner />
  }

  if (!data?.data?.template && !isLoading) {
    return (
      <Nodata
        icon={<Form />}
        title="Template not found !"
        description="There was an issue fetching template data."
      >
        <Link
          href={dashboardRoute.template({
            workspaceId,
          })}
          tabIndex={-1}
        >
          <Button variant="secondary">
            <ArrowUpRight /> Templates
          </Button>
        </Link>
        <Button disabled={isRefetching} onClick={refetchTemplate}>
          {isRefetching ? <Spinner /> : <RotateCcw />} Retry
        </Button>
      </Nodata>
    )
  }

  return (
    <TemplateEditorContext.Provider value={value}>
      {children}
    </TemplateEditorContext.Provider>
  )
}

export function useTemplateEditor() {
  const context = useContext(TemplateEditorContext)
  if (context === undefined) {
    throw new Error(
      "useTemplateEditor must be used within a TemplateEditorProvider"
    )
  }
  return context
}
