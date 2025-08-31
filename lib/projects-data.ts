export type Localized = {
  en: string
  ar: string
}

export type Project = {
  slug: string
  cover: string
  title: Localized
  short: Localized
  description: Localized[]
  tags: Localized[]
  features: Localized[]
  metrics: Array<{ label: Localized; value: string }>
  gallery: string[]
}

export const projects: Project[] = [
  {
    slug: "modern-living-room",
    cover: "/2-7fb9c07a.webp",
    title: { en: "Modern Living Room", ar: "غرفة معيشة عصرية" },
    short: {
      en: "A sleek living room concept blending wood textures with soft lighting and minimal lines.",
      ar: "تصميم غرفة معيشة أنيق يمزج الخشب والإضاءة الهادئة مع خطوط بسيطة.",
    },
    description: [
      {
        en: "This concept emphasizes comfort and simplicity with warm materials and a balanced palette.",
        ar: "يركّز هذا التصميم على الراحة والبساطة باستخدام خامات دافئة ولوحة ألوان متوازنة.",
      },
      {
        en: "Subtle accents and hidden lighting add depth, while functional layout improves everyday living.",
        ar: "اللمسات الخفيفة والإضاءة المخفية تضيف عمقًا، والتخطيط العملي يحسن الاستخدام اليومي.",
      },
    ],
    tags: [
      { en: "Demo", ar: "تجريبي" },
      { en: "Animation", ar: "حركة" },
      { en: "Minimal", ar: "بسيط" },
    ],
    features: [
      { en: "Hidden LED ambient lights", ar: "إضاءة خفية محيطية LED" },
      { en: "Sustainable wood finishes", ar: "تشطيبات خشبية مستدامة" },
      { en: "Modular storage walls", ar: "حوائط تخزين معيارية" },
    ],
    metrics: [
      { label: { en: "Area", ar: "المساحة" }, value: "36 m²" },
      { label: { en: "Duration", ar: "المدة" }, value: "2 weeks" },
      { label: { en: "Budget", ar: "الميزانية" }, value: "$8k" },
    ],
    gallery: [
      "/2-7fb9c07a.webp",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=2000&auto=format&fit=crop",
    ],
  },
  {
    slug: "minimal-bedroom",
    cover: "/aman-2dea0ac9.webp",
    title: { en: "Minimal Bedroom", ar: "غرفة نوم بسيطة" },
    short: {
      en: "A tranquil bedroom with clean geometry and matte textures for timeless serenity.",
      ar: "غرفة نوم هادئة بهندسة نظيفة ولمسات مطفية لراحة دائمة.",
    },
    description: [
      {
        en: "Natural light and soft textiles create a cozy, airy atmosphere.",
        ar: "الضوء الطبيعي والأقمشة الناعمة يخلقان أجواء دافئة ومنتعشة.",
      },
      {
        en: "Clutter-free storage and neutral colors keep focus on rest and wellness.",
        ar: "التخزين المنظم والألوان الهادئة يركزان على الراحة والرفاهية.",
      },
    ],
    tags: [
      { en: "Theme", ar: "نمط" },
      { en: "RTL", ar: "اتجاه" },
    ],
    features: [
      { en: "Floating nightstands", ar: "كوميدينو معلّق" },
      { en: "Acoustic wall paneling", ar: "ألواح جدارية عازلة" },
      { en: "Under-bed drawers", ar: "أدراج أسفل السرير" },
    ],
    metrics: [
      { label: { en: "Area", ar: "المساحة" }, value: "18 m²" },
      { label: { en: "Duration", ar: "المدة" }, value: "10 days" },
      { label: { en: "Budget", ar: "الميزانية" }, value: "$5k" },
    ],
    gallery: [
      "/aman-2dea0ac9.webp",
      "https://images.unsplash.com/photo-1505691723518-36a5ac3b2d35?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=2000&auto=format&fit=crop",
    ],
  },
  {
    slug: "kitchen-showcase",
    cover: "/forsa-a294033f.webp",
    title: { en: "Kitchen Showcase", ar: "عرض المطبخ" },
    short: {
      en: "An efficient kitchen emphasizing workflow, durability, and smart storage.",
      ar: "مطبخ عملي يركز على سهولة الحركة والمتانة والتخزين الذكي.",
    },
    description: [
      {
        en: "High-traffic materials and ergonomic layout streamline daily tasks.",
        ar: "خامات تتحمل الاستخدام وتخطيط مريح يسهّل المهام اليومية.",
      },
      {
        en: "Warm accents soften the space while keeping it professional.",
        ar: "لمسات دافئة تُلطّف المساحة مع الحفاظ على طابع عملي.",
      },
    ],
    tags: [
      { en: "UI", ar: "واجهة" },
      { en: "Card", ar: "بطاقة" },
    ],
    features: [
      { en: "Soft-close cabinetry", ar: "خزائن بإغلاق هادئ" },
      { en: "Pull-out pantry", ar: "خزانة سحب" },
      { en: "Heat-resistant counters", ar: "أسطح مقاومة للحرارة" },
    ],
    metrics: [
      { label: { en: "Area", ar: "المساحة" }, value: "14 m²" },
      { label: { en: "Duration", ar: "المدة" }, value: "12 days" },
      { label: { en: "Budget", ar: "الميزانية" }, value: "$6.5k" },
    ],
    gallery: [
      "/forsa-a294033f.webp",
      "https://images.unsplash.com/photo-1600585154340-1e53b8b6b9a7?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505691723518-36a5ac3b2d35?q=80&w=2000&auto=format&fit=crop",
    ],
  },
  {
    slug: "cozy-workspace",
    cover: "/merna.webp",
    title: { en: "Cozy Workspace", ar: "مساحة عمل مريحة" },
    short: {
      en: "A compact workspace that encourages focus with warm tones and clear zoning.",
      ar: "مساحة عمل صغيرة تشجع التركيز بألوان دافئة وتقسيم واضح.",
    },
    description: [
      {
        en: "Cable management and ergonomic furniture improve productivity.",
        ar: "إدارة الأسلاك والأثاث المريح يحسّنان الإنتاجية.",
      },
      {
        en: "A reading nook adds character and relaxation.",
        ar: "زاوية قراءة تضيف طابعًا مميزًا واستراحة.",
      },
    ],
    tags: [
      { en: "Badge", ar: "شارة" },
      { en: "Motion", ar: "حركة" },
    ],
    features: [
      { en: "Sit-stand desk", ar: "مكتب ارتفاع متغيّر" },
      { en: "Acoustic carpet", ar: "سجاد عازل للصوت" },
      { en: "Task lighting", ar: "إضاءة موجهة" },
    ],
    metrics: [
      { label: { en: "Area", ar: "المساحة" }, value: "10 m²" },
      { label: { en: "Duration", ar: "المدة" }, value: "7 days" },
      { label: { en: "Budget", ar: "الميزانية" }, value: "$3.2k" },
    ],
    gallery: [
      "/merna.webp",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505691723518-36a5ac3b2d35?q=80&w=2000&auto=format&fit=crop",
    ],
  },
]
