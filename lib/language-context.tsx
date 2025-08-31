"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "en" | "ar"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  isRTL: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Complete translation object
const translations = {
  en: {
    "product": {
  "new": "NEW",
  "off": "OFF",
  "featured": "FEATURED",
  "reviews": "reviews",
  "views": "views",
  "save": "Save",
  "inStock": "In Stock",
  "available": "available",
  "outOfStock": "Out of Stock",
  "quantity": "Quantity",
  "addToCart": "Add to Cart",
  "buyNow": "Buy Now",
  "trust": {
    "securePayment": "Secure Payment",
    "freeShipping": "Free Shipping",
    "easyReturns": "Easy Returns",
    "qualityGuarantee": "Quality Guarantee"
  },
  "tabs": {
    "description": "Description",
    "specifications": "Specifications",
    "shipping": "Shipping & Returns",
    "reviews": "Reviews"
  },
  "careInstructions": "Care Instructions",
  "specs": {
    "weight": "Weight",
    "dimensions": "Dimensions",
    "material": "Material",
    "color": "Color",
    "warranty": "Warranty",
    "additional": "Additional Specifications"
  },
  "shippingInfo": {
    "freeTitle": "Free Shipping",
    "freeDesc": "On orders over $50",
    "fastTitle": "Fast Delivery",
    "fastDesc": "2-3 business days",
    "returnsTitle": "Easy Returns",
    "returnsDesc": "30-day return policy"
  },
  "reviewsInfo": {
    "noReviews": "No reviews yet",
    "beFirst": "Be the first to review this product",
    "writeReview": "Write a Review"
  }
},
    // Navigation
    "nav.home": "Home",
    "nav.about": "About Us",
    "nav.contact": "Contact",
    "nav.categories": "Categories",
    "nav.projects": "Projects",
    "nav.signin": "Sign In",
    "nav.signup": "Sign Up",
    "nav.profile": "Profile",
    "nav.orders": "Orders",
    "nav.signout": "Sign Out",

    // Hero Section
    "hero.title": "Redefining",
    "hero.title.bold": "Modern Living",
    "hero.subtitle": "Discover furniture that transforms spaces into experiences",
    "hero.explore": "Explore Collection",
    "hero.view3d": "View 3D Designs",

    // Featured Products
    "featured.title": "Featured",
    "featured.title.bold": "Products",
    "featured.subtitle": "Discover our most popular pieces, carefully curated for modern living",
    "featured.loading": "Loading our most popular pieces...",
    "featured.error": "Unable to load products at the moment",
    "featured.tryagain": "Try Again",
    "featured.comingsoon": "Coming Soon",
    "featured.newcollection": "New Collection",
    "featured.instock": "In Stock",
    "featured.outofstock": "Out of Stock",

    // Projects Page
    "projects.title": "Our",
    "projects.title.bold": "Projects",
    "projects.subtitle": "A selection of fantastic projects showcasing our expertise in furniture design and 3D visualization",
    "projects.learnmore": "Learn More",

    // Categories
    "categories.title": "Our",
    "categories.title.bold": "Categories",
    "categories.subtitle": "Explore our comprehensive range of furniture and home solutions",
    "categories.loading": "Loading our comprehensive range...",
    "categories.items": "items",
    "categories.configure": "Configure Database Connection",

    // New Bedrooms Section
    "newbedrooms.title": "New",
    "newbedrooms.title.bold": "Bedrooms",
    "newbedrooms.subtitle":
      "Experience the perfect blend of comfort and style with our latest bedroom collection. Each piece is designed to create a sanctuary of rest and relaxation.",
    "newbedrooms.feature1": "Premium materials and craftsmanship",
    "newbedrooms.feature2": "Customizable designs and finishes",
    "newbedrooms.feature3": "Sustainable and eco-friendly options",
    "newbedrooms.explore": "Explore Bedrooms",

    // Who We Are Section
    "whoweare.title": "Who",
    "whoweare.title.bold": "We Are",
    "whoweare.subtitle":
      "A story of passion, innovation, and dedication to creating exceptional furniture that transforms the way people live and work.",
    "whoweare.mission": "Our Mission",
    "whoweare.mission.p1":
      "We believe that great furniture should be more than just functional—it should inspire, comfort, and reflect the unique personality of every space it inhabits.",
    "whoweare.mission.p2":
      "Through innovative design, sustainable practices, and cutting-edge technology, we're shaping the future of modern living, one piece at a time.",

    // Models & Videos Section
    "modelsvideos.title": "See Our",
    "modelsvideos.title.bold": "Furniture in Action",
    "modelsvideos.subtitle": "Watch real customers transform their spaces with our furniture collections",
    "modelsvideos.viewall": "View All Videos",

    // Customer Feedback Section
    "feedback.title": "What Our",
    "feedback.title.bold": "Customers Say",
    "feedback.subtitle": "Real feedback from real customers who have transformed their spaces with our furniture",

    // Warranty Section
    "warranty.title": "Our",
    "warranty.title.bold": "Promise",
    "warranty.subtitle": "We stand behind every piece we create with comprehensive warranties and exceptional service",
    "warranty.lifetime": "Lifetime Warranty",
    "warranty.lifetime.desc": "Comprehensive coverage on all structural components and craftsmanship defects",
    "warranty.delivery": "Free Delivery",
    "warranty.delivery.desc": "Complimentary white-glove delivery and setup service for all orders",
    "warranty.support": "24/7 Support",
    "warranty.support.desc": "Round-the-clock customer service and technical support whenever you need it",
    "warranty.quality": "Quality Guarantee",
    "warranty.quality.desc": "30-day satisfaction guarantee with hassle-free returns and exchanges",

    // About Page
    "about.title": "About",
    "about.title.bold": "glory home",
    "about.subtitle":
      "Crafting extraordinary furniture experiences that transform the way people live, work, and connect with their spaces.",
    "about.stats.experience": "Years Experience",
    "about.stats.customers": "Happy Customers",
    "about.stats.designs": "Unique Designs",
    "about.stats.countries": "Countries Served",
    "about.story.title": "Our",
    "about.story.title.bold": "Story",
    "about.story.p1":
      "GLORY HOME, founded in 2017.",
    "about.story.p2":
      "we are factory for furniture products and wooden crafts for more than 6 years, for the people and organizations who are looking for quality, commitment, speed and accuracy.",
    "about.story.p3":
      "As a furniture factory and an interior design office have experience that allow us make expectation to reality and offer exclusive solutions for any need. Our journey start by design ends by manufacture home furniture, commercial furniture and furniture for contract projects, we also can implement any 3d model and make it come reality",
    "about.story.sustainable": "Sustainable Materials",
    "about.story.warranty": "Lifetime Warranty",
    "about.story.shipping": "Global Shipping",
    "about.values.title": "Our",
    "about.values.title.bold": "Values",
    "about.values.subtitle": "The principles that guide everything we do",
    "about.values.passion": "Passion for Design",
    "about.values.passion.desc":
      "Every piece we create is infused with passion and attention to detail, ensuring exceptional quality and beauty.",
    "about.values.sustainability": "Sustainability",
    "about.values.sustainability.desc":
      "We're committed to eco-friendly practices, using sustainable materials and responsible manufacturing processes.",
    "about.values.excellence": "Excellence",
    "about.values.excellence.desc":
      "We strive for excellence in every aspect of our business, from design to customer service.",
    "about.values.innovation": "Innovation",
    "about.values.innovation.desc":
      "We embrace cutting-edge technology and innovative design approaches to create furniture for the future.",
    "about.team.title": "Meet Our",
    "about.team.title.bold": "Team",
    "about.team.subtitle": "The passionate individuals behind LUXE's success",
    "about.team.sarah":
      "With over 20 years in furniture design, Sarah founded LUXE with a vision to revolutionize modern living spaces.",
    "about.team.michael":
      "Michael brings innovative design concepts to life, blending functionality with aesthetic appeal in every piece.",
    "about.team.emily":
      "Emily leads our sustainability initiatives, ensuring our products are both beautiful and environmentally responsible.",
    "about.team.david":
      "David oversees our 3D visualization and AR technology, bringing the future of furniture shopping to our customers.",
    "about.journey.title": "Our",
    "about.journey.title.bold": "Journey",
    "about.journey.subtitle": "Key milestones in our evolution",
    "about.journey.2009": "Company Founded",
    "about.journey.2009.desc": "Started with a small workshop and a big dream to transform modern living.",
    "about.journey.2012": "First Showroom",
    "about.journey.2012.desc": "Opened our flagship showroom in downtown, showcasing our unique designs.",
    "about.journey.2015": "International Expansion",
    "about.journey.2015.desc": "Expanded to serve customers across 20 countries worldwide.",
    "about.journey.2018": "3D Technology Launch",
    "about.journey.2018.desc": "Introduced cutting-edge 3D visualization and AR technology.",
    "about.journey.2021": "Sustainability Initiative",
    "about.journey.2021.desc": "Launched our comprehensive sustainability program and eco-friendly product line.",
    "about.journey.2025": "Future Vision",
    "about.journey.2025.desc": "Leading the industry with smart furniture and AI-powered design solutions.",
    "about.cta.title": "Ready to Transform Your Space?",
    "about.cta.subtitle": "Join thousands of satisfied customers who have transformed their homes with LUXE furniture.",
    "about.cta.explore": "Explore Collection",
    "about.cta.contact": "Contact Us",

    // Contact Page
    "contact.title": "Contact",
    "contact.title.bold": "Us",
    "contact.subtitle":
      "We'd love to hear from you. Get in touch with our team for any questions, support, or design consultations.",
    "contact.visit": "Visit Our Showroom",
    "contact.visit.address1": "123 Design Street",
    "contact.visit.address2": "New York, NY 10001",
    "contact.visit.address3": "United States",
    "contact.call": "Call Us",
    "contact.call.phone1": "+1 (555) 123-4567",
    "contact.call.phone2": "+1 (555) 123-4568",
    "contact.call.hours": "Mon-Fri 9AM-6PM EST",
    "contact.email": "Email Us",
    "contact.email.hello": "hello@luxefurniture.com",
    "contact.email.support": "support@luxefurniture.com",
    "contact.email.sales": "sales@luxefurniture.com",
    "contact.hours": "Business Hours",
    "contact.hours.weekday": "Monday - Friday: 9AM - 6PM",
    "contact.hours.saturday": "Saturday: 10AM - 4PM",
    "contact.hours.sunday": "Sunday: Closed",
    "contact.form.title": "Send us a Message",
    "contact.form.name": "Full Name",
    "contact.form.name.placeholder": "Your full name",
    "contact.form.email": "Email Address",
    "contact.form.email.placeholder": "your@email.com",
    "contact.form.phone": "Phone Number",
    "contact.form.phone.placeholder": "+1 (555) 123-4567",
    "contact.form.department": "Department",
    "contact.form.department.general": "General Inquiry",
    "contact.form.department.sales": "Sales & Orders",
    "contact.form.department.support": "Customer Support",
    "contact.form.department.design": "Design Consultation",
    "contact.form.department.partnership": "Partnership",
    "contact.form.subject": "Subject",
    "contact.form.subject.placeholder": "What's this about?",
    "contact.form.message": "Message",
    "contact.form.message.placeholder": "Tell us more about your inquiry...",
    "contact.form.send": "Send Message",
    "contact.form.sending": "Sending...",
    "contact.quickcontact.call": "Call Now",
    "contact.quickcontact.chat": "Live Chat",
    "contact.quickcontact.chat.available": "Available 24/7",
    "contact.faq.title": "Need Quick Answers?",
    "contact.faq.subtitle": "Check out our frequently asked questions for instant answers to common inquiries.",
    "contact.faq.visit": "Visit FAQ",
    "contact.locations.title": "Our",
    "contact.locations.title.bold": "Locations",
    "contact.locations.subtitle": "Visit our showrooms worldwide to experience LUXE furniture in person",
    "contact.locations.newyork": "New York",
    "contact.locations.newyork.address": "123 Design Street, NY 10001",
    "contact.locations.newyork.phone": "+1 (555) 123-4567",
    "contact.locations.newyork.hours": "Mon-Sat: 9AM-7PM",
    "contact.locations.losangeles": "Los Angeles",
    "contact.locations.losangeles.address": "456 Modern Ave, CA 90210",
    "contact.locations.losangeles.phone": "+1 (555) 987-6543",
    "contact.locations.losangeles.hours": "Mon-Sat: 10AM-8PM",
    "contact.locations.london": "London",
    "contact.locations.london.address": "789 Luxury Lane, SW1A 1AA",
    "contact.locations.london.phone": "+44 20 7123 4567",
    "contact.locations.london.hours": "Mon-Sat: 10AM-6PM",

    // Auth Pages
    "auth.signin.title": "Welcome Back",
    "auth.signin.subtitle": "Sign in to your LUXE account",
    "auth.signin.email": "Email Address",
    "auth.signin.email.placeholder": "Enter your email",
    "auth.signin.password": "Password",
    "auth.signin.password.placeholder": "Enter your password",
    "auth.signin.remember": "Remember me",
    "auth.signin.forgot": "Forgot password?",
    "auth.signin.button": "Sign In",
    "auth.signin.signing": "Signing in...",
    "auth.signin.google": "Continue with Google",
    "auth.signin.noaccount": "Don't have an account?",
    "auth.signin.signup": "Sign up",

    "auth.signup.title": "Join LUXE",
    "auth.signup.subtitle": "Create your account to get started",
    "auth.signup.fullname": "Full Name",
    "auth.signup.fullname.placeholder": "Enter your full name",
    "auth.signup.email": "Email Address",
    "auth.signup.email.placeholder": "Enter your email",
    "auth.signup.password": "Password",
    "auth.signup.password.placeholder": "Create a password",
    "auth.signup.confirm": "Confirm Password",
    "auth.signup.confirm.placeholder": "Confirm your password",
    "auth.signup.password.weak": "Weak",
    "auth.signup.password.medium": "Medium",
    "auth.signup.password.strong": "Strong",
    "auth.signup.password.chars": "At least 8 characters",
    "auth.signup.password.uppercase": "One uppercase letter",
    "auth.signup.password.number": "One number",
    "auth.signup.password.nomatch": "Passwords don't match",
    "auth.signup.terms": "I agree to the",
    "auth.signup.termslink": "Terms of Service",
    "auth.signup.privacy": "Privacy Policy",
    "auth.signup.button": "Create Account",
    "auth.signup.creating": "Creating account...",
    "auth.signup.google": "Continue with Google",
    "auth.signup.hasaccount": "Already have an account?",
    "auth.signup.signin": "Sign in",

    // Footer
    "footer.newsletter.title": "Transform Your Space",
    "footer.newsletter.subtitle": "Get exclusive access to new collections, design tips, and special offers",
    "footer.newsletter.placeholder": "Enter your email address",
    "footer.newsletter.subscribe": "Subscribe",
    "footer.features.global": "Global Shipping",
    "footer.features.warranty": "Lifetime Warranty",
    "footer.features.delivery": "Fast Delivery",
    "footer.features.love": "Made with Love",
    "footer.products": "Products",
    "footer.products.bedrooms": "BedRooms",
    "footer.products.sofa": "Sofa & L-Shape",
    "footer.products.kitchens": "Kitchens",
    "footer.products.dining": "Dining Tables",
    "footer.products.chandeliers": "Chandeliers",
    "footer.services": "Services",
    "footer.services.3d": "3D Design",
    "footer.services.custom": "Custom Furniture",
    "footer.services.interior": "Interior Design",
    "footer.services.delivery": "Delivery & Setup",
    "footer.services.warranty": "Warranty",
    "footer.company": "Company",
    "footer.company.about": "About Us",
    "footer.company.story": "Our Story",
    "footer.company.careers": "Careers",
    "footer.company.press": "Press",
    "footer.company.contact": "Contact",
    "footer.support": "Support",
    "footer.support.help": "Help Center",
    "footer.support.returns": "Returns",
    "footer.support.shipping": "Shipping Info",
    "footer.support.size": "Size Guide",
    "footer.support.care": "Care Instructions",
    "footer.description":
      "Crafting extraordinary furniture experiences that blend innovation, sustainability, and timeless design for the modern world.",
    "footer.copyright": " 2025 LUXE Furniture. Crafted with",
    "footer.copyright.modern": "for modern living.",
    "footer.privacy": "Privacy Policy",
    "footer.terms": "Terms of Service",
    "footer.cookies": "Cookie Policy",

    // Common
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.success": "Success",
    "common.back": "Back to Home",
    "common.addtocart": "Add to Cart",
    "common.viewall": "View All",
    "common.learnmore": "Learn More",
    "common.readmore": "Read More",
    "common.required": "Required",
    "common.optional": "Optional",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.view": "View",
    "common.close": "Close",
    "common.open": "Open",
    "common.next": "Next",
    "common.previous": "Previous",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.sort": "Sort",
    "common.clear": "Clear",
    "common.apply": "Apply",
    "common.reset": "Reset",
    "love.title": "Products you loved",
    "love.title.bold": "Wishlist",
    "love.subtitle": "All products you have added to your wishlist.",
    "love.empty": "You haven't loved any products yet.",
    "love.error": "An error occurred while loading your wishlist.",
    "love.login_prompt_title": "Please Sign In",
    "love.login_prompt_subtitle": "Sign in to view your wishlist.",
    "orders.title": "Orders",
    "orders.subtitle": "Your recent orders",
    "orders.orderId": "Order #",
    "orders.status": "Status",
    "orders.status.pending": "Pending",
    "orders.error": "Error loading orders",
    "orders.total": "Total",
    "orders.items": "Items",
    "orders.payment": "Payment",
    "orders.cancel": "Cancel",
    "orders.delete": "Delete",
    "orders.products": "Products",
    "orders.empty": " there is no orders yet",
    "wishlist": "Wishlist",
    "stock.in_stock": "In Stock",
    "stock.out_of_stock": "Out of Stock",
    "featured.badge": "Featured",
  },
  ar: {
    "product": {
  "new": "جديد",
  "off": "خصم",
  "featured": "مميز",
  "reviews": "تقييمات",
  "views": "مشاهدات",
  "save": "وفر",
  "inStock": "متوفر بالمخزون",
  "available": "متاح",
  "outOfStock": "نفدت الكمية",
  "quantity": "الكمية",
  "addToCart": "أضف إلى السلة",
  "buyNow": "اشترِ الآن",
  "trust": {
    "securePayment": "دفع آمن",
    "freeShipping": "شحن مجاني",
    "easyReturns": "إرجاع سهل",
    "qualityGuarantee": "ضمان الجودة"
  },
  "tabs": {
    "description": "الوصف",
    "specifications": "المواصفات",
    "shipping": "الشحن والإرجاع",
    "reviews": "التقييمات"
  },
  "careInstructions": "تعليمات العناية",
  "specs": {
    "weight": "الوزن",
    "dimensions": "الأبعاد",
    "material": "الخامة",
    "color": "اللون",
    "warranty": "الضمان",
    "additional": "مواصفات إضافية"
  },
  "shippingInfo": {
    "freeTitle": "شحن مجاني",
    "freeDesc": "للطلبات التي تزيد عن 50 دولارًا",
    "fastTitle": "توصيل سريع",
    "fastDesc": "خلال 2-3 أيام عمل",
    "returnsTitle": "إرجاع سهل",
    "returnsDesc": "سياسة إرجاع خلال 30 يومًا"
  },
  "reviewsInfo": {
    "noReviews": "لا توجد تقييمات بعد",
    "beFirst": "كن أول من يراجع هذا المنتج",
    "writeReview": "اكتب مراجعة"
  }
},
    // Navigation
    "nav.home": "الرئيسية",
    "nav.about": "من نحن",
    "nav.contact": "اتصل بنا",
    "nav.categories": "الفئات",
    "nav.projects": "المشاريع",
    "nav.signin": "تسجيل الدخول",
    "nav.signup": "إنشاء حساب",
    "nav.profile": "الملف الشخصي",
    "nav.orders": "الطلبات",
    "nav.signout": "تسجيل الخروج",

    // Hero Section
    "hero.title": "إعادة تعريف",
    "hero.title.bold": "الحياة العصرية",
    "hero.subtitle": "اكتشف الأثاث الذي يحول المساحات إلى تجارب",
    "hero.explore": "استكشف المجموعة",
    "hero.view3d": "عرض التصاميم ثلاثية الأبعاد",

    // Featured Products
    "featured.title": "المنتجات",
    "featured.title.bold": "المميزة",
    "featured.subtitle": "اكتشف قطعنا الأكثر شعبية، المختارة بعناية للحياة العصرية",
    "featured.loading": "جاري تحميل قطعنا الأكثر شعبية...",
    "featured.error": "غير قادر على تحميل المنتجات في الوقت الحالي",
    "featured.tryagain": "حاول مرة أخرى",
    "featured.comingsoon": "قريباً",
    "featured.newcollection": "مجموعة جديدة",
    "featured.instock": "متوفر",
    "featured.outofstock": "غير متوفر",

    // Projects Page
    "projects.title": "مشاريعنا",
    "projects.title.bold": "المختارة",
    "projects.subtitle": "  مجموعة مختارة من المشاريع الرائعة التي تبرز خبرتنا في تصميم الأثاث والتصور ثلاثي الأبعاد",
    "projects.learnmore": "اعرف المزيد",

    // Categories
    "categories.title": "الفئات",
    "categories.title.bold": "التي لدينا",
    "categories.subtitle": "استكشف مجموعتنا الشاملة من الأثاث وحلول المنزل",
    "categories.loading": "جاري تحميل مجموعتنا الشاملة...",
    "categories.items": "عنصر",
    "categories.configure": "تكوين اتصال قاعدة البيانات",

    // New Bedrooms Section
    "newbedrooms.title": "غرف النوم",
    "newbedrooms.title.bold": "الجديدة",
    "newbedrooms.subtitle":
      "اختبر المزيج المثالي من الراحة والأناقة مع مجموعة غرف النوم الجديدة. كل قطعة مصممة لخلق ملاذ من الراحة والاسترخاء.",
    "newbedrooms.feature1": "مواد فاخرة وحرفية عالية",
    "newbedrooms.feature2": "تصاميم وتشطيبات قابلة للتخصيص",
    "newbedrooms.feature3": "خيارات مستدامة وصديقة للبيئة",
    "newbedrooms.explore": "استكشف غرف النوم",

    // Who We Are Section
    "whoweare.title": "من",
    "whoweare.title.bold": "نحن",
    "whoweare.subtitle": "قصة من الشغف والابتكار والتفاني في صنع أثاث استثنائي يحول الطريقة التي يعيش ويعمل بها الناس.",
    "whoweare.mission": "مهمتنا",
    "whoweare.mission.p1":
      "نؤمن أن الأثاث الرائع يجب أن يكون أكثر من مجرد وظيفي - يجب أن يلهم ويريح ويعكس الشخصية الفريدة لكل مساحة يسكنها.",
    "whoweare.mission.p2":
      "من خلال التصميم المبتكر والممارسات المستدامة والتكنولوجيا المتطورة، نحن نشكل مستقبل الحياة العصرية، قطعة واحدة في كل مرة.",

    // Models & Videos Section
    "modelsvideos.title": "شاهد أثاثنا",
    "modelsvideos.title.bold": "في العمل",
    "modelsvideos.subtitle": "شاهد العملاء الحقيقيين يحولون مساحاتهم بمجموعات الأثاث الخاصة بنا",
    "modelsvideos.viewall": "عرض جميع الفيديوهات",

    // Customer Feedback Section
    "feedback.title": "ما يقوله",
    "feedback.title.bold": "عملاؤنا",
    "feedback.subtitle": "تعليقات حقيقية من عملاء حقيقيين حولوا مساحاتهم بأثاثنا",

    // Warranty Section
    "warranty.title": "وعدنا",
    "warranty.title.bold": "",
    "warranty.subtitle": "نقف وراء كل قطعة ننشئها بضمانات شاملة وخدمة استثنائية",
    "warranty.lifetime": "ضمان مدى الحياة",
    "warranty.lifetime.desc": "تغطية شاملة لجميع المكونات الهيكلية وعيوب الصناعة",
    "warranty.delivery": "توصيل مجاني",
    "warranty.delivery.desc": "خدمة توصيل وتركيب مجانية مع القفازات البيضاء لجميع الطلبات",
    "warranty.support": "دعم 24/7",
    "warranty.support.desc": "خدمة عملاء ودعم فني على مدار الساعة كلما احتجت إليه",
    "warranty.quality": "ضمان الجودة",
    "warranty.quality.desc": "ضمان الرضا لمدة 30 يوماً مع إرجاع وتبديل بدون متاعب",

    // About Page
    "about.title": "حول",
    "about.title.bold": "جلوري هوم ",
    "about.subtitle": "صناعة تجارب أثاث استثنائية تحول الطريقة التي يعيش بها الناس ويعملون ويتواصلون مع مساحاتهم.",
    "about.stats.experience": "سنة خبرة",
    "about.stats.customers": "عميل سعيد",
    "about.stats.designs": "تصميم فريد",
    "about.stats.countries": "دولة نخدمها",
    "about.story.title": "دعنا نخبرك ب",
    "about.story.title.bold": "قصتنا",
    "about.story.p1":
      "تأسست  جلوري هوم عام ٢٠١٧",
    "about.story.p2":"نحن مصنع منتجات الأثاث والحرف الخشبية منذ أكثر من ٦ سنوات، نخدم الأفراد والمؤسسات الذين يبحثون عن الجودة والالتزام والسرعة والدقة.",
    "about.story.p3":"بصفتنا مصنع أثاث ومكتب تصميم داخلي، نمتلك خبرة واسعة تُمكّننا من تحويل التوقعات إلى واقع وتقديم حلول حصرية تُلبي جميع الاحتياجات. تبدأ رحلتنا بالتصميم، وتنتهي بتصنيع أثاث منزلي وتجاري وأثاث لمشاريع العقود، كما يُمكننا تنفيذ أي نموذج ثلاثي الأبعاد وتحويله إلى واقع",
    "about.story.sustainable": "مواد مستدامة",
    "about.story.warranty": "ضمان مدى الحياة",
    "about.story.shipping": "شحن لأي مكان",
    "about.values.title": "دعنا نخبرك ب ",
    "about.values.title.bold": "قيمنا",
    "about.values.subtitle": "المبادئ التي توجه كل ما نقوم به",
    "about.values.passion": "الشغف بالتصميم",
    "about.values.passion.desc": "كل قطعة ننشئها مليئة بالشغف والاهتمام بالتفاصيل، مما يضمن جودة وجمال استثنائيين.",
    "about.values.sustainability": "الاستدامة",
    "about.values.sustainability.desc":
      "نحن ملتزمون بالممارسات الصديقة للبيئة، باستخدام مواد مستدامة وعمليات تصنيع مسؤولة.",
    "about.values.excellence": "التميز",
    "about.values.excellence.desc": "نسعى للتميز في كل جانب من جوانب أعمالنا، من التصميم إلى خدمة العملاء.",
    "about.values.innovation": "الابتكار",
    "about.values.innovation.desc": "نتبنى التكنولوجيا المتطورة ونهج التصميم المبتكر لإنشاء أثاث للمستقبل.",
    "about.team.title": "تعرف على",
    "about.team.title.bold": "فريقنا",
    "about.team.subtitle": "الأفراد المتحمسون وراء نجاح لوكس",
    "about.team.sarah": "مع أكثر من 20 عاماً في تصميم الأثاث، أسست سارة لوكس برؤية لثورة في مساحات المعيشة العصرية.",
    "about.team.michael": "يحول مايكل مفاهيم التصميم المبتكرة إلى حقيقة، مزج الوظيفة مع الجاذبية الجمالية في كل قطعة.",
    "about.team.emily": "تقود إيميلي مبادرات الاستدامة لدينا، مما يضمن أن منتجاتنا جميلة ومسؤولة بيئياً.",
    "about.team.david": "يشرف ديفيد على التصور ثلاثي الأبعاد وتقنية الواقع المعزز، جالباً مستقبل تسوق الأثاث لعملائنا.",
    "about.journey.title": "عن",
    "about.journey.title.bold": "رحلتنا",
    "about.journey.subtitle": "المعالم الرئيسية في تطورنا",
    "about.journey.2009": "تأسيس الشركة",
    "about.journey.2009.desc": "بدأنا بورشة صغيرة وحلم كبير لتحويل الحياة العصرية.",
    "about.journey.2012": "أول معرض",
    "about.journey.2012.desc": "افتتحنا معرضنا الرئيسي في وسط المدينة، عارضين تصاميمنا الفريدة.",
    "about.journey.2015": "التوسع الدولي",
    "about.journey.2015.desc": "توسعنا لخدمة العملاء في 20 دولة حول العالم.",
    "about.journey.2018": "إطلاق تقنية ثلاثية الأبعاد",
    "about.journey.2018.desc": "قدمنا التصور ثلاثي الأبعاد المتطور وتقنية الواقع المعزز.",
    "about.journey.2021": "مبادرة الاستدامة",
    "about.journey.2021.desc": "أطلقنا برنامج الاستدامة الشامل وخط المنتجات الصديق للبيئة.",
    "about.journey.2025": "رؤية المستقبل",
    "about.journey.2025.desc": "نقود الصناعة بالأثاث الذكي وحلول التصميم المدعومة بالذكاء الاصطناعي.",
    "about.cta.title": "هل أنت مستعد لتحويل مساحتك؟",
    "about.cta.subtitle": "انضم إلى آلاف العملاء الراضين الذين حولوا منازلهم بأثاث لوكس.",
    "about.cta.explore": "استكشف المجموعة",
    "about.cta.contact": "اتصل بنا",

    // Contact Page
    "contact.title": "اتصل",
    "contact.title.bold": "بنا",
    "contact.subtitle": "نحب أن نسمع منك. تواصل مع فريقنا لأي أسئلة أو دعم أو استشارات تصميم.",
    "contact.visit": "زر معرضنا",
    "contact.visit.address1": "123 شارع التصميم",
    "contact.visit.address2": "نيويورك، نيويورك 10001",
    "contact.visit.address3": "الولايات المتحدة",
    "contact.call": "اتصل بنا",
    "contact.call.phone1": "+1 (555) 123-4567",
    "contact.call.phone2": "+1 (555) 123-4568",
    "contact.call.hours": "الإثنين-الجمعة 9ص-6م بتوقيت شرق أمريكا",
    "contact.email": "راسلنا",
    "contact.email.hello": "hello@luxefurniture.com",
    "contact.email.support": "support@luxefurniture.com",
    "contact.email.sales": "sales@luxefurniture.com",
    "contact.hours": "ساعات العمل",
    "contact.hours.weekday": "الإثنين - الجمعة: 9ص - 6م",
    "contact.hours.saturday": "السبت: 10ص - 4م",
    "contact.hours.sunday": "الأحد: مغلق",
    "contact.form.title": "أرسل لنا رسالة",
    "contact.form.name": "الاسم الكامل",
    "contact.form.name.placeholder": "اسمك الكامل",
    "contact.form.email": "عنوان البريد الإلكتروني",
    "contact.form.email.placeholder": "your@email.com",
    "contact.form.phone": "رقم الهاتف",
    "contact.form.phone.placeholder": "+1 (555) 123-4567",
    "contact.form.department": "القسم",
    "contact.form.department.general": "استفسار عام",
    "contact.form.department.sales": "المبيعات والطلبات",
    "contact.form.department.support": "دعم العملاء",
    "contact.form.department.design": "استشارة تصميم",
    "contact.form.department.partnership": "شراكة",
    "contact.form.subject": "الموضوع",
    "contact.form.subject.placeholder": "ما هو موضوع رسالتك؟",
    "contact.form.message": "الرسالة",
    "contact.form.message.placeholder": "أخبرنا المزيد عن استفسارك...",
    "contact.form.send": "إرسال الرسالة",
    "contact.form.sending": "جاري الإرسال...",
    "contact.quickcontact.call": "اتصل الآن",
    "contact.quickcontact.chat": "محادثة مباشرة",
    "contact.quickcontact.chat.available": "متاح 24/7",
    "contact.faq.title": "تحتاج إجابات سريعة؟",
    "contact.faq.subtitle": "تحقق من الأسئلة الشائعة للحصول على إجابات فورية للاستفسارات الشائعة.",
    "contact.faq.visit": "زيارة الأسئلة الشائعة",
    "contact.locations.title": "مواقعنا",
    "contact.locations.title.bold": "",
    "contact.locations.subtitle": "زر معارضنا حول العالم لتجربة أثاث لوكس شخصياً",
    "contact.locations.newyork": "نيويورك",
    "contact.locations.newyork.address": "123 شارع التصميم، نيويورك 10001",
    "contact.locations.newyork.phone": "+1 (555) 123-4567",
    "contact.locations.newyork.hours": "الإثنين-السبت: 9ص-7م",
    "contact.locations.losangeles": "لوس أنجلوس",
    "contact.locations.losangeles.address": "456 شارع العصري، كاليفورنيا 90210",
    "contact.locations.losangeles.phone": "+1 (555) 987-6543",
    "contact.locations.losangeles.hours": "الإثنين-السبت: 10ص-8م",
    "contact.locations.london": "لندن",
    "contact.locations.london.address": "789 طريق الفخامة، SW1A 1AA",
    "contact.locations.london.phone": "+44 20 7123 4567",
    "contact.locations.london.hours": "الإثنين-السبت: 10ص-6م",

    // Auth Pages
    "auth.signin.title": "مرحباً بعودتك",
    "auth.signin.subtitle": "سجل الدخول إلى حساب لوكس الخاص بك",
    "auth.signin.email": "عنوان البريد الإلكتروني",
    "auth.signin.email.placeholder": "أدخل بريدك الإلكتروني",
    "auth.signin.password": "كلمة المرور",
    "auth.signin.password.placeholder": "أدخل كلمة المرور",
    "auth.signin.remember": "تذكرني",
    "auth.signin.forgot": "نسيت كلمة المرور؟",
    "auth.signin.button": "تسجيل الدخول",
    "auth.signin.signing": "جاري تسجيل الدخول...",
    "auth.signin.google": "المتابعة مع جوجل",
    "auth.signin.noaccount": "ليس لديك حساب؟",
    "auth.signin.signup": "إنشاء حساب",

    "auth.signup.title": "انضم إلى لوكس",
    "auth.signup.subtitle": "أنشئ حسابك للبدء",
    "auth.signup.fullname": "الاسم الكامل",
    "auth.signup.fullname.placeholder": "أدخل اسمك الكامل",
    "auth.signup.email": "عنوان البريد الإلكتروني",
    "auth.signup.email.placeholder": "أدخل بريدك الإلكتروني",
    "auth.signup.password": "كلمة المرور",
    "auth.signup.password.placeholder": "أنشئ كلمة مرور",
    "auth.signup.confirm": "تأكيد كلمة المرور",
    "auth.signup.confirm.placeholder": "أكد كلمة المرور",
    "auth.signup.password.weak": "ضعيفة",
    "auth.signup.password.medium": "متوسطة",
    "auth.signup.password.strong": "قوية",
    "auth.signup.password.chars": "على الأقل 8 أحرف",
    "auth.signup.password.uppercase": "حرف كبير واحد",
    "auth.signup.password.number": "رقم واحد",
    "auth.signup.password.nomatch": "كلمات المرور غير متطابقة",
    "auth.signup.terms": "أوافق على",
    "auth.signup.termslink": "شروط الخدمة",
    "auth.signup.privacy": "سياسة الخصوصية",
    "auth.signup.button": "إنشاء حساب",
    "auth.signup.creating": "جاري إنشاء الحساب...",
    "auth.signup.google": "المتابعة مع جوجل",
    "auth.signup.hasaccount": "لديك حساب بالفعل؟",
    "auth.signup.signin": "تسجيل الدخول",

    // Footer
    "footer.newsletter.title": "حول مساحتك",
    "footer.newsletter.subtitle": "احصل على وصول حصري للمجموعات الجديدة ونصائح التصميم والعروض الخاصة",
    "footer.newsletter.placeholder": "أدخل عنوان بريدك الإلكتروني",
    "footer.newsletter.subscribe": "اشترك",
    "footer.features.global": "شحن عالمي",
    "footer.features.warranty": "ضمان مدى الحياة",
    "footer.features.delivery": "توصيل سريع",
    "footer.features.love": "صنع بحب",
    "footer.products": "المنتجات",
    "footer.products.bedrooms": "غرف النوم",
    "footer.products.sofa": "الكنب والأشكال L",
    "footer.products.kitchens": "المطابخ",
    "footer.products.dining": "طاولات الطعام",
    "footer.products.chandeliers": "الثريات",
    "footer.services": "الخدمات",
    "footer.services.3d": "التصميم ثلاثي الأبعاد",
    "footer.services.custom": "أثاث مخصص",
    "footer.services.interior": "التصميم الداخلي",
    "footer.services.delivery": "التوصيل والتركيب",
    "footer.services.warranty": "الضمان",
    "footer.company": "الشركة",
    "footer.company.about": "من نحن",
    "footer.company.story": "قصتنا",
    "footer.company.careers": "الوظائف",
    "footer.company.press": "الصحافة",
    "footer.company.contact": "اتصل بنا",
    "footer.support": "الدعم",
    "footer.support.help": "مركز المساعدة",
    "footer.support.returns": "المرتجعات",
    "footer.support.shipping": "معلومات الشحن",
    "footer.support.size": "دليل الأحجام",
    "footer.support.care": "تعليمات العناية",
    "footer.description": "صناعة تجارب أثاث استثنائية تمزج بين الابتكار والاستدامة والتصميم الخالد للعالم العصري.",
    "footer.copyright": " 2025 أثاث لوكس. صُنع بـ",
    "footer.copyright.modern": "للحياة العصرية.",
    "footer.privacy": "سياسة الخصوصية",
    "footer.terms": "شروط الخدمة",
    "footer.cookies": "سياسة ملفات تعريف الارتباط",

    // Common
    "common.loading": "جاري التحميل...",
    "common.error": "خطأ",
    "common.success": "نجح",
    "common.back": "العودة للرئيسية",
    "common.addtocart": "أضف للسلة",
    "common.viewall": "عرض الكل",
    "common.learnmore": "اعرف المزيد",
    "common.readmore": "اقرأ المزيد",
    "common.required": "مطلوب",
    "common.optional": "اختياري",
    "common.save": "حفظ",
    "common.cancel": "إلغاء",
    "common.delete": "حذف",
    "common.edit": "تعديل",
    "common.view": "عرض",
    "common.close": "إغلاق",
    "common.open": "فتح",
    "common.next": "التالي",
    "common.previous": "السابق",
    "common.search": "بحث",
    "common.filter": "تصفية",
    "common.sort": "ترتيب",
    "common.clear": "مسح",
    "common.apply": "تطبيق",
    "common.reset": "إعادة تعيين",
    "love.title": "المنتجات التي احببتها",
    "love.title.bold": "قائمة المفضلة",
    "love.subtitle": "جميع المنتجات التي أضفتها إلى قائمتك المفضلة.",
    "love.empty": "لم تضف أي منتجات إلى قائمتك المفضلة بعد.",
    "love.error": "حدث خطأ أثناء تحميل قائمة المفضلة.",
    "love.login_prompt_title": "يرجى تسجيل الدخول",
    "love.login_prompt_subtitle": "تسجيل الدخول لعرض قائمة المفضلة.",
    "orders.title": "الطلبات",
    "orders.subtitle": "الطلبات الأخيرة",
    "orders.orderId": "طلب رقم",
    "orders.status": "الحالة",
    "orders.status.pending": "قيد الانتظار",
    "orders.error": "خطأ في تحميل الطلبات",
    "orders.total": "الإجمالي",
    "orders.items": "العناصر",
    "orders.payment": "الدفع",
    "orders.cancel": "إلغاء",
    "orders.delete": "حذف",
    "orders.products": "المنتجات",
    "orders.empty": "لايوجد طلبات بعد ",
    "wishlist": "قائمة المفضلة",
    "stock.out_of_stock": "نفدت الكمية",
    "featured.badge": "مميز",
    "stock.in_stock": "متوفر بالمخزون",
  },
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "ar")) {
      setLanguage(savedLanguage)
    }
  }, [])

  useEffect(() => {
    // Save language to localStorage and update document direction
    localStorage.setItem("language", language)
    document.documentElement.lang = language
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr"

    // Update body class for RTL styling
    if (language === "ar") {
      document.body.classList.add("rtl")
    } else {
      document.body.classList.remove("rtl")
    }
  }, [language])

  const t = (key: string): string => {
    const translation = translations[language][key as keyof (typeof translations)[typeof language]];
    if (!translation) {
      console.warn(`Missing translation key: ${key}`);
      return key; // Return the key itself if translation is missing
    }
    if (typeof translation === 'object') {
      console.warn(`Translation key '${key}' resolved to an object, not a string.`);
      return key;
    }
    return translation;
  }

  const isRTL = language === "ar"

  return <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
