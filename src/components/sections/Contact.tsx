import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactBlob } from "./contact/ContactBlob";
import { ContactBody } from "./contact/ContactBody";

/**
 * "06 / Contact" — static section shell (server component).
 * The blob reads the device tier and the body holds the clipboard / animation logic, so both are client children.
 */
export function Contact() {
  return (
    <section
      id="contact"
      data-section="contact"
      aria-labelledby="contact-title"
      className="container-x relative overflow-hidden bg-ink py-20 md:py-28 lg:py-36"
    >
      <ContactBlob />
      <div className="relative z-10">
        <ContactBody>
          <SectionHeading id="contact" />
        </ContactBody>
      </div>
    </section>
  );
}
