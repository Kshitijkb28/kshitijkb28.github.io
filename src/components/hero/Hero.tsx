import { ArrowDown, ArrowUpRight, FileText, Globe, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { links, profile } from "@/data/resume";
import { Button } from "@/components/ui/Button";
import { HeroCanvas } from "./HeroCanvas";
import { HeroIntro } from "./HeroIntro";

const HERO_REVEAL_SCRIPT =
  "try{var d=document.documentElement,h=document.getElementById('hero-title');if(h&&d.getAttribute('data-js')==='pending'){var done=false,go=function(){if(!done){done=true;d.setAttribute('data-js','ready')}};setTimeout(go,450);var f=getComputedStyle(h).fontFamily.split(',')[0];(document.fonts&&document.fonts.load?document.fonts.load('800 1em '+f):Promise.resolve()).then(go,go)}}catch(e){}";

const profiles = [
  { href: links.github.href, label: "GitHub profile", Icon: GithubIcon },
  { href: links.linkedin.href, label: "LinkedIn profile", Icon: LinkedinIcon },
  { href: links.site.href, label: "Personal site (kshitijkb28.github.io)", Icon: Globe },
];

/**
 * Hero: server-rendered text (the H1 is the LCP element) + the Soft Stack 3D tower.
 * Phones: tower slot on top (clamp(240px, 42svh, 360px)), text in flow, section may grow past 100svh.
 * Desktop: 7/5 grid, tower on the right.
 */
export function Hero() {
  return (
    <section id="top" data-section="top" aria-labelledby="hero-title" className="relative overflow-x-clip">
      <HeroIntro>
        <div
          className="container-x relative flex min-h-screen-safe flex-col lg:grid lg:grid-cols-12 lg:items-center lg:gap-8"
          style={{
            paddingTop: "calc(76px + env(safe-area-inset-top, 0px))",
            paddingBottom: "calc(40px + env(safe-area-inset-bottom, 0px))",
          }}
        >
          <div
            data-hero-canvas-slot
            className="relative h-[clamp(240px,42svh,360px)] w-full shrink-0 lg:order-2 lg:col-span-5 lg:h-[min(78vh,760px)]"
          >
            <HeroCanvas />
          </div>

          <div data-hero-text className="relative mt-4 flex flex-1 flex-col justify-center lg:order-1 lg:col-span-7 lg:mt-0">
            <p className="label-mono text-muted" data-hero-secondary>
              {profile.eyebrow}
            </p>
            <h1 id="hero-title" className="font-display text-hero mt-4 font-extrabold text-text">
              <span className="hero-line">
                <span>{profile.firstName}</span>
              </span>
              <span className="hero-line">
                <span>{profile.lastName}</span>
              </span>
            </h1>
            {/* Runs as soon as the <h1> is parsed: reveal once its display font is loaded (450 ms cap). */}
            <script dangerouslySetInnerHTML={{ __html: HERO_REVEAL_SCRIPT }} />
            <p className="text-step-0 md:text-step-1 mt-6 max-w-[42ch] text-muted" data-hero-secondary>
              {profile.hook}
            </p>

            <div className="mt-8 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center" data-hero-secondary>
              <Button href="#projects" size="lg" icon={<ArrowDown />}>
                See projects
              </Button>
              <Button href={`mailto:${profile.email}`} variant="outline" size="lg" icon={<Mail />} iconPosition="left">
                Email me
              </Button>
              <Button href={profile.resumePdf} variant="ghost" size="lg" icon={<FileText />} iconPosition="left" target="_blank" rel="noopener noreferrer">
                Résumé (PDF)
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3" data-hero-secondary>
              <a
                href={profile.now.href}
                target="_blank"
                rel="noopener noreferrer"
                className="pressable label-mono inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-3.5 text-text/90 hover:border-mint/50"
              >
                <span className="size-1.5 shrink-0 rounded-full bg-mint" aria-hidden="true" />
                <span className="hidden text-muted xs:inline">{profile.now.label}</span>
                <span>
                  {profile.now.role} @ {profile.now.company}
                </span>
                <ArrowUpRight size={14} aria-hidden="true" />
              </a>
              <ul className="flex items-center" aria-label="Profiles">
                {profiles.map(({ href, label, Icon }) => (
                  <li key={href}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="pressable flex size-11 items-center justify-center rounded-full text-muted hover:text-text"
                    >
                      <Icon size={20} aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div
            className="pointer-events-none absolute bottom-7 left-[var(--gutter)] hidden items-center gap-3 lg:flex"
            aria-hidden="true"
            data-hero-secondary
          >
            <span className="label-mono text-muted">scroll</span>
            <span className="block h-10 w-px overflow-hidden bg-line">
              <span className="animate-cue block h-full w-full bg-tangerine" />
            </span>
          </div>
        </div>
      </HeroIntro>
    </section>
  );
}
