/* ============================================================
   SKILLSQUAD — CENTRALIZED CONTENT CONFIGURATION
   ------------------------------------------------------------
   Edit business content HERE instead of hunting through pages.
   Anything marked PLACEHOLDER must be replaced with verified
   real data before launch. Never present placeholders as facts.
   ============================================================ */

window.SKILLSQUAD = {

  /* ---------- Company ---------- */
  company: {
    name: "Skillsquad Digital Media",
    shortName: "Skillsquad",
    tagline: "Digital Media for Businesses Ready to Stand Out.",
    // PLACEHOLDER — replace with the real business location
    location: "Your City, Your Country",
    // PLACEHOLDER — replace with real contact details
    email: "skillsquaddigitalmedia@gmail.com",
    phone: "+00 000 000 0000",
    hours: "Mon – Fri, 9:00 – 18:00",
  },

  /* ---------- Social links ----------
     PLACEHOLDER — replace "#" with real profile URLs */
  social: {
    instagram: "#",
    linkedin: "#",
    facebook: "#",
    behance: "#",
    dribbble: "#",
  },

  /* ---------- Statistics ----------
     PLACEHOLDER — these numbers are editable examples, NOT verified facts. */
  stats: [
    { value: 16, suffix: "+", label: "Years", caption: "Creative experience across the team", placeholder: true },
    { value: 100, suffix: "+", label: "Projects", caption: "Delivered across brand, web and content", placeholder: true },
    { value: 0, suffix: "", label: "Multi-Disciplinary", caption: "Designers, developers, motion artists", placeholder: true, static: true },
    { value: 0, suffix: "", label: "Global Mindset", caption: "Local execution, international standards", placeholder: true, static: true },
  ],

  /* ---------- Services (10) ---------- */
  services: [
    { n: "01", title: "Branding & Visual Identity", tags: ["Logo", "Identity Systems", "Guidelines"], desc: "Distinctive brand identities engineered from strategy: naming support, logo systems, typography, color and rules that keep every touchpoint unmistakably yours.", img: "work-kinetic.jpg" },
    { n: "02", title: "Graphic Design", tags: ["Print", "Editorial", "Campaigns"], desc: "High-impact graphic design for campaigns, print and digital, from concept to press-ready artwork with obsessive attention to detail.", img: "work-pulse.jpg" },
    { n: "03", title: "UI/UX Design", tags: ["Research", "Wireframes", "Prototypes"], desc: "Interfaces that feel effortless. Research-driven UX and refined UI for web and mobile products people actually enjoy using.", img: "work-atlas.jpg" },
    { n: "04", title: "Website Development", tags: ["Design", "Build", "CMS"], desc: "Fast, accessible, conversion-focused websites. Designed in-house and built with clean, maintainable code.", img: "work-atlas.jpg" },
    { n: "05", title: "Social Media Marketing", tags: ["Strategy", "Content", "Growth"], desc: "Content systems and campaigns that build audiences and turn attention into business results.", img: "work-pulse.jpg" },
    { n: "06", title: "Video & Motion", tags: ["Editing", "Motion Graphics", "Reels"], desc: "Scroll-stopping video editing and motion graphics, cut and animated for every platform.", img: "work-orbit.jpg" },
    { n: "07", title: "3D & VFX", tags: ["3D Modeling", "Animation", "VFX"], desc: "Dimensional storytelling: 3D modeling, 2D/3D animation and visual effects that give brands physical presence.", img: "work-orbit.jpg" },
    { n: "08", title: "Digital Marketing", tags: ["SEO", "Ads", "Analytics"], desc: "Performance-minded digital marketing that connects creative output to measurable growth.", img: "work-lumen.jpg" },
    { n: "09", title: "AI Creative Solutions", tags: ["Workflows", "Concepts", "Production"], desc: "Modern AI pipelines accelerate ideation and production, while human creative direction protects originality, quality and strategy.", img: "work-orbit.jpg" },
    { n: "10", title: "Print & 3D Signage", tags: ["Print Media", "Sign Boards", "Large Format"], desc: "From premium print collateral to dimensional 3D sign boards that dominate physical space.", img: "work-verde.jpg" },
  ],

  /* ---------- Projects (REAL WORK — Hafiz Tayyab Sheikh Behance portfolio) ---------- */
  projects: [
    { slug: "nexgistic", title: "Nexgistic Logistic Company", category: "Brand Identity",
      year: "Behance", tags: ["Identity", "Branding"],
      blurb: "Logistics brand identity — logo and visual system for a modern freight company.",
      img: "work-nexgistic.jpg", url: "https://www.behance.net/gallery/252504809/Nexgistic-Logistic-Company", },
    { slug: "metabuddy", title: "MetaBuddy 2.0", category: "Website Design",
      year: "Behance", tags: ["UI", "Landing Page"],
      blurb: "Web landing page UI design — clean, conversion-focused interface.",
      img: "work-metabuddy.jpg", url: "https://www.behance.net/gallery/192811193/MetaBuddy-20-_-Web-Landing-Page-_-UI-Design", },
    { slug: "email-design", title: "Email Design", category: "Website Design",
      year: "Behance", tags: ["Email", "Template"],
      blurb: "Email template design — polished layouts built for inboxes.",
      img: "work-email-design.jpg", url: "https://www.behance.net/gallery/232833885/Email-Design", },
    { slug: "nutritional-world", title: "Nutritional World", category: "Social Media",
      year: "Behance", tags: ["Social", "Creatives"],
      blurb: "Social media creative set for a nutrition brand.",
      img: "work-nutritional-world.jpg", url: "https://www.behance.net/gallery/232833171/Nutritional-World-Social-Media", },
    { slug: "carousel-designs", title: "Creative Carousels", category: "Social Media",
      year: "Behance", tags: ["Social", "Carousel"],
      blurb: "Swipe-worthy carousel designs for social feeds.",
      img: "work-carousel-designs.jpg", url: "https://www.behance.net/gallery/232831907/Creative-Carousel-Designs", },
    { slug: "just-nakhre", title: "Just Nakhre Jewelry", category: "Brand Identity",
      year: "Behance", tags: ["Identity", "Branding"],
      blurb: "Jewelry brand identity — elegant marks for a boutique label.",
      img: "work-just-nakhre.jpg", url: "https://www.behance.net/gallery/232831371/Just-Nakhre-Jewelry-Brand-Identity", },
    { slug: "social-ads", title: "Social Media Ads", category: "Social Media",
      year: "Behance", tags: ["Ads", "Social"],
      blurb: "Creative ads and post designs engineered to stop the scroll.",
      img: "work-social-ads.jpg", url: "https://www.behance.net/gallery/232831063/Social-Media-Creative-Ads-Post-Designs", },
    { slug: "fairy-tales", title: "Fairy Tales Boutique", category: "Brand Identity",
      year: "Behance", tags: ["Identity", "Branding"],
      blurb: "Boutique branding — a dreamy identity for a fashion label.",
      img: "work-fairy-tales.jpg", url: "https://www.behance.net/gallery/232830263/Fairy-Tales-Boutique-Branding", },
    { slug: "nouva", title: "Nouva", category: "Brand Identity",
      year: "Behance", tags: ["Identity", "Branding"],
      blurb: "Brand identity for a future-focused venture.",
      img: "work-nouva.jpg", url: "https://www.behance.net/gallery/232829993/Nouva-Innovating-The-Future", },
    { slug: "herbcare", title: "HerbCare App", category: "Website Design",
      year: "Behance", tags: ["UI/UX", "App"],
      blurb: "Herbal cosmetics app case study — UI/UX from research to prototype.",
      img: "work-herbcare.jpg", url: "https://www.behance.net/gallery/217371103/HerbCare-Herbal-Cosmetics-App-Case-Study-(UIUX)", },
    { slug: "fashion-poster", title: "Fashion Posters", category: "Social Media",
      year: "Behance", tags: ["Poster", "Print"],
      blurb: "Fashion poster design series — bold print-ready compositions.",
      img: "work-fashion-poster.jpg", url: "https://www.behance.net/gallery/217822813/Fashion-Poster-Designs", },
    { slug: "sonic-poster", title: "Sonic Movie Poster", category: "3D & Motion",
      year: "Behance", tags: ["Poster", "Key Art"],
      blurb: "Movie poster design — cinematic key art.",
      img: "work-sonic-poster.jpg", url: "https://www.behance.net/gallery/217821775/Sonic-Movie-Poster-Design", },
  ],

  /* ---------- Process ---------- */
  process: [
    { n: "01", title: "Discover", desc: "Understand the business, audience, market, objectives and the real problems design needs to solve." },
    { n: "02", title: "Strategize", desc: "Define positioning, direction, priorities and the creative opportunities worth pursuing." },
    { n: "03", title: "Create", desc: "Turn strategy into visual concepts, prototypes and digital experiences with intent." },
    { n: "04", title: "Refine", desc: "Test, review, polish and strengthen the strongest direction until it is undeniable." },
    { n: "05", title: "Launch", desc: "Prepare and deliver the final experience across every relevant channel, flawlessly." },
    { n: "06", title: "Grow", desc: "Evaluate, evolve and expand the creative system as the business grows." },
  ],

  /* ---------- Differentiators ---------- */
  why: [
    { title: "Creative Thinking", desc: "We don't just make things look good. We solve communication problems through design." },
    { title: "Strategy First", desc: "Every creative decision should support a business objective. If it doesn't move the needle, it doesn't ship." },
    { title: "One Creative Partner", desc: "Branding, design, digital, content, motion and technology under one roof. No handoffs, no dilution." },
    { title: "AI + Human Creativity", desc: "Modern AI tools accelerate ideation and production while human creative direction protects originality, quality and strategy." },
    { title: "Built to Stand Out", desc: "Every project develops its own visual personality instead of following the same formula." },
  ],

  /* ---------- Industries ---------- */
  industries: [
    "Study Abroad & Education", "Real Estate", "Logistics", "Technology",
    "E-commerce", "Healthcare", "Restaurants & Hospitality", "Startups",
    "Professional Services",
  ],

  /* ---------- Testimonials ----------
     PLACEHOLDER — sample quotes. Replace with real, permissioned
     client testimonials before launch. */
  testimonials: [
    {
      quote: "Skillsquad transformed the way our brand looks and communicates. Every touchpoint finally feels like one company.",
      name: "Sample Client", company: "Sample Company", industry: "E-commerce",
      placeholder: true,
    },
    {
      quote: "Strategy first, design second, excuses never. The new website paid for itself within a quarter.",
      name: "Sample Client", company: "Sample Company", industry: "Real Estate",
      placeholder: true,
    },
    {
      quote: "One partner for brand, web and motion meant nothing got lost in translation. The launch content was unreal.",
      name: "Sample Client", company: "Sample Company", industry: "Hospitality",
      placeholder: true,
    },
  ],

  /* ---------- Contact form ----------
     endpoint: where inquiries are sent. PLACEHOLDER — wire to a
     real backend (Formspree, Basin, custom API) before launch. */
  form: {
    endpoint: "",  // e.g. "https://formspree.io/f/xxxx" — empty = demo mode
    emailFallback: true,
  },
};
