import { revalidatePath } from "next/cache"
import { actionFailure } from "@/lib/cms/action-result"
import { isAdminAuthenticated } from "@/lib/cms/auth"
import { saveProjectForm } from "@/lib/cms/project-save"

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return Response.json(
      { ok: false, error: "Unauthorized.", issues: [] },
      { status: 401 },
    )
  }

  try {
    const origin = request.headers.get("origin")
    const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host")
    if (origin && new URL(origin).host !== (host ?? new URL(request.url).host)) {
      return Response.json(
        { ok: false, error: "Invalid request origin.", issues: [] },
        { status: 403 },
      )
    }

    const formData = await request.formData()
    const document = await saveProjectForm(formData)
    if (formData.get("publish") === "true") {
      revalidatePath("/")
      revalidatePath("/projects")
      revalidatePath(`/projects/${document.slug}`)
    }
    revalidatePath("/admin")
    revalidatePath(`/admin/projects/${document.id}`)
    return Response.json({ ok: true, document })
  } catch (error) {
    return Response.json(actionFailure(error, "Unable to save the project."), {
      status: 400,
    })
  }
}
