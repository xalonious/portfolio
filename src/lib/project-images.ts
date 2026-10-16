import type { ProjectDocument } from "@/lib/project-schema"

export function mapProjectImages(
  document: ProjectDocument,
  mapSource: (source: string) => string,
): ProjectDocument {
  return {
    ...document,
    image: mapSource(document.image),
    caseStudy: document.caseStudy
      ? {
          ...document.caseStudy,
          sections: document.caseStudy.sections.map((section) => ({
            ...section,
            content: section.content.map((block) =>
              block.type === "images"
                ? {
                    ...block,
                    images: block.images.map((image) => ({
                      ...image,
                      src: mapSource(image.src),
                    })),
                  }
                : block,
            ),
          })),
        }
      : null,
  }
}

export function getProjectImageSources(document: ProjectDocument) {
  const sources = new Set<string>()
  mapProjectImages(document, (source) => {
    sources.add(source)
    return source
  })
  return sources
}
