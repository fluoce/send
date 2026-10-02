"use client"

import { useState, ChangeEvent, useEffect } from "react"
import { TemplateEditorInput } from "./template-editor-input"
import { useTemplateEditor } from "@/context/template-editor-context"
import { useTemplateUpdateMeta } from "@/hooks/use-template"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { CheckCheck, Copy, Plus, X } from "lucide-react"
import { useCopy } from "@/hooks/use-copy"
import { funcTrunc } from "@/func/func-trunc"
import { Badge } from "@/components/ui/badge"

export function TemplateMetaEditor() {
  const workspaceId = useWorkspaceId()

  const { template } = useTemplateEditor()

  const u = useTemplateUpdateMeta()

  const { copy, showCopiedSuccess } = useCopy({
    text: template?.id!,
  })

  const [showReplyTo, setShowReplyTo] = useState(false)

  const [meta, setMeta] = useState({
    name: template?.name ?? "",
    from: template?.from ?? "",
    replyTo: template?.replyTo ?? "",
    subject: template?.subject ?? "",
  })

  useEffect(() => {
    setMeta({
      name: template?.name ?? "",
      from: template?.from ?? "",
      replyTo: template?.replyTo ?? "",
      subject: template?.subject ?? "",
    })
    if (template?.replyTo) {
      setShowReplyTo(true)
    }
  }, [template])

  const handleChange =
    (field: keyof typeof meta) => (e: ChangeEvent<HTMLInputElement>) => {
      setMeta((prev) => ({
        ...prev,
        [field]: e.target.value,
      }))
    }

  const handleBlur = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target as HTMLInputElement
    if (name === "name" && !value) {
      toast.error("Name should not be empty, Name not saved.")
      return
    }
    const prevValue = template?.[name as keyof typeof template]
    if (prevValue === value) return
    u.mutateAsync({
      body: {
        [name]: value,
        status: template?.status,
      },
      templateId: template?.id!,
      workspaceId,
    }).catch((erro) => {
      toast.error(erro?.message ?? "Template saving failed !")
    })
  }

  return (
    <div className="flex w-full flex-col gap-1">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <TemplateEditorInput
          className="flex-1"
          labelProps={{ children: "Name", htmlFor: "template-name" }}
          inputProps={{
            name: "name",
            id: "template-name",
            value: meta.name,
            onChange: handleChange("name"),
            onBlur: handleBlur,
          }}
        />
        <div className="flex items-center gap-1 pl-1 text-xs text-muted-foreground">
          <span>{funcTrunc(template?.id!)}</span>
          <Button
            onClick={() => copy()}
            variant="secondary"
            size="icon-sm"
            className="text-muted-foreground"
          >
            {showCopiedSuccess ? <CheckCheck /> : <Copy />}
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap items-end justify-between gap-2">
        <TemplateEditorInput
          className="flex-1"
          labelProps={{ children: "From", htmlFor: "template-from" }}
          inputProps={{
            name: "from",
            id: "template-from",
            value: meta.from,
            onChange: handleChange("from"),
            onBlur: handleBlur,
          }}
        />
        {!showReplyTo ? (
          <Button
            onClick={() => {
              setShowReplyTo(true)
              setTimeout(() => {
                const el = document.getElementById("template-replyTo")
                el?.focus()
              }, 0)
            }}

            variant="ghost"
            size="lg"
            className="group text-muted-foreground"
          >
            <Plus className="group-hover:text-blue-500" /> Reply-To
          </Button>
        ) : null}
      </div>
      {showReplyTo ? (
        <div className="flex flex-wrap items-end justify-between gap-2">
          <TemplateEditorInput
            className="flex-1"
            labelProps={{ children: "Reply-To", htmlFor: "template-replyTo" }}
            inputProps={{
              name: "replyTo",
              id: "template-replyTo",
              value: meta.replyTo,
              onChange: handleChange("replyTo"),
              onBlur: handleBlur,
            }}
          />
          <Button
            onClick={() => {
              setShowReplyTo(false)
              if (!meta.replyTo) return
              u.mutateAsync({
                body: {
                  status: template?.status,
                  replyTo: "",
                },
                templateId: template?.id!,
                workspaceId,
              })
            }}
            variant="ghost"
            size="lg"
            className="group text-muted-foreground"
          >
            <X className="group-hover:text-red-500" /> Remove
          </Button>
        </div>
      ) : null}
      <TemplateEditorInput
        labelProps={{ children: "Subject", htmlFor: "template-subject" }}
        inputProps={{
          name: "subject",
          id: "template-subject",
          value: meta.subject,
          onChange: handleChange("subject"),
          onBlur: handleBlur,
        }}
      />
      {template?.variables?.length ? (
        <div className="group smooth flex w-full flex-1 flex-wrap items-center gap-3 border-b px-1 text-sm">
          <label className="text-muted-foreground">Variables</label>
          <div className="flex flex-wrap items-center gap-1 py-2">
            {template?.variables?.map((v) => (
              <Badge key={v?.name} variant="outline">
                {v?.name}
              </Badge>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
