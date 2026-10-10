import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectsShowcase } from "./projects/ProjectsShowcase";

/**
 * "03 / Projects" — Selected work.
 * Server component: static shell + heading; the showcase (pinned horizontal scroll on
 * desktop-fine, native snap carousel everywhere else) is a client child.
 */
export function Projects() {
  return (
    <section id="projects" data-section="projects" aria-labelledby="projects-title" className="py-20 md:py-28 lg:py-36">
      <div className="container-x">
        <SectionHeading id="projects" />
        <ProjectsShowcase />
      </div>
    </section>
  );
}
