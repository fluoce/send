"use client"

import { useCallback, useEffect, useRef } from "react"
import debounce from "lodash.debounce"
import { toast } from "sonner"
import { useTemplateUpdateHtml } from "@/hooks/use-template"

interface UseSaveTemplateProps {
  templateId: string
  workspaceId: string
  delay?: number
}

export function useSaveTemplate({
  templateId,
  workspaceId,
  delay = 2200,
}: UseSaveTemplateProps) {
  const updateHtml = useTemplateUpdateHtml()

  const lastSavedHtml = useRef("")

  const save = useCallback(
    async (html: string) => {
      if (html === lastSavedHtml.current) {
        return
      }

      try {
        await updateHtml.mutateAsync({
          body: {
            html,
          },
          templateId,
          workspaceId,
        })

        lastSavedHtml.current = html
      } catch (error) {
        toast.error(
          (error as { message?: string })?.message ?? "Failed to save template"
        )
      }
    },
    [templateId, workspaceId, updateHtml]
  )

  const debouncedSave = useCallback(
    debounce((html: string) => {
      save(html)
    }, delay),
    [save, delay]
  )

  useEffect(() => {
    return () => {
      debouncedSave.cancel()
    }
  }, [debouncedSave])

  const setInitialHtml = useCallback((html: string) => {
    lastSavedHtml.current = html
  }, [])

  return {
    save: debouncedSave,
    saveNow: save,
    setInitialHtml,
    isSaving: updateHtml.isPending,
  }
}
