import { prepareUploadedImage, type PreparedImage } from "@/lib/cms/media"
import { publishProject, saveProjectDraft } from "@/lib/cms/project-repository"
import { getProjectImageSources, mapProjectImages } from "@/lib/project-images"
import { projectDocumentSchema } from "@/lib/project-schema"

export async function saveProjectForm(formData: FormData) {
  const input = formData.get("document")
  if (typeof input !== "string") throw new Error("Project data is missing.")

  const document = projectDocumentSchema.parse(JSON.parse(input))
  const images: PreparedImage[] = []
  const replacements = new Map<string, string>()

  for (const source of getProjectImageSources(document)) {
    if (!source.startsWith("blob:")) continue

    const file = formData.get(`image:${source}`)
    if (!(file instanceof File)) {
      throw new Error("A selected image is missing. Choose the image again.")
    }

    const image = await prepareUploadedImage(file)
    images.push(image)
    replacements.set(source, image.asset.publicPath)
  }

  const resolved = mapProjectImages(
    document,
    (source) => replacements.get(source) ?? source,
  )
  return formData.get("publish") === "true"
    ? publishProject(resolved, images)
    : saveProjectDraft(resolved, images)
}
