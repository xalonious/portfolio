import { isAdminAuthenticated } from "@/lib/cms/auth"
import {
  listMediaAssets,
  saveUploadedImage,
} from "@/lib/cms/media"

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "Unauthorized." }, { status: 401 })
  }

  return Response.json({ media: listMediaAssets() })
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "Unauthorized." }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get("file")

    if (!(file instanceof File)) {
      return Response.json({ error: "Select an image." }, { status: 400 })
    }

    const media = await saveUploadedImage(file)
    return Response.json({ media }, { status: 201 })
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to upload the image.",
      },
      { status: 400 },
    )
  }
}
