import { PortfolioHome } from "@/components/pages/PortfolioHome"
import { getFeaturedPublishedProjects } from "@/lib/cms/project-repository"
import { getCodingYears } from "@/lib/coding-years"

export const dynamic = "force-dynamic"

export default function PortfolioPage() {
  return (
    <PortfolioHome
      featuredProjects={getFeaturedPublishedProjects()}
      initialCodingYears={getCodingYears()}
    />
  )
}
