import { useParams } from "next/navigation"

export const useTemplateId = () => {
  const { templateId } = useParams<{ templateId: string }>()
  return templateId
}
