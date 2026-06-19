/**
 * Localised copy for the marketing surfaces (landing and pricing pages).
 *
 * Kept separate from the studio dictionary so the longer-form copy does not
 * crowd the interface strings. Tier feature bullets remain in English for now.
 */

import type { Locale } from "@/lib/i18n";

export interface MarketingDict {
  badge: string;
  heroTitle: string;
  howTitle: string;
  steps: { title: string; body: string }[];
  features: { title: string; body: string }[];
  ctaTitle: string;
  ctaSubtitle: string;
  // Pricing
  pricingTitle: string;
  pricingSubtitle: string;
  monthly: string;
  yearly: string;
  perMonth: string;
  popular: string;
  custom: string;
  creditsPerMonth: string; // contains {n}
  customVolume: string;
  billingNote: string;
  ctaStartFree: string;
  ctaGetStarted: string;
  ctaContact: string;
}

export const MARKETING: Record<Locale, MarketingDict> = {
  en: {
    badge: "For jewelers & digital artists",
    heroTitle: "From a single idea to casting-ready jewelry",
    howTitle: "How it works",
    steps: [
      { title: "Describe or upload", body: "Start from a text prompt or a reference image — a sketch, a photo, an idea." },
      { title: "Approve or regenerate", body: "Review each result. Keep what you like, regenerate what you don't, one step at a time." },
      { title: "Export for production", body: "Take the finished piece into ZBrush, MatrixGold or casting as GLB, STL or OBJ." },
    ],
    features: [
      { title: "Image & text to 3D", body: "Turn a reference image or a description into a 3D model." },
      { title: "Stone seat mapping", body: "Locate gemstone seats for flush and pavé setting work." },
      { title: "Production-ready exports", body: "GLB, STL and OBJ for every tool in your bench." },
      { title: "Eight languages", body: "A studio that speaks your makers' language." },
    ],
    ctaTitle: "Start with 100 free credits",
    ctaSubtitle: "No card required.",
    pricingTitle: "Pricing",
    pricingSubtitle: "Start free. Upgrade when you are ready to produce.",
    monthly: "Monthly",
    yearly: "Yearly",
    perMonth: "/ mo",
    popular: "Popular",
    custom: "Custom",
    creditsPerMonth: "{n} credits / month",
    customVolume: "Custom volume",
    billingNote: "Prices shown for planning. Checkout is coming soon.",
    ctaStartFree: "Start free",
    ctaGetStarted: "Get started",
    ctaContact: "Contact us",
  },
  tr: {
    badge: "Kuyumcular ve dijital sanatçılar için",
    heroTitle: "Tek bir fikirden döküme hazır takıya",
    howTitle: "Nasıl çalışır",
    steps: [
      { title: "Tarif et ya da yükle", body: "Bir metinle ya da referans görselle başla — bir eskiz, bir fotoğraf, bir fikir." },
      { title: "Beğen ya da yeniden üret", body: "Her sonucu incele. Beğendiğini sakla, beğenmediğini yeniden üret; adım adım." },
      { title: "Üretim için dışa aktar", body: "Bitmiş parçayı GLB, STL ya da OBJ olarak ZBrush, MatrixGold veya döküme taşı." },
    ],
    features: [
      { title: "Görsel ve metinden 3D", body: "Referans görseli ya da tarifi 3D modele dönüştür." },
      { title: "Taş yuvası haritalama", body: "Gizli ve pavé mıhlama için taş yuvalarını belirle." },
      { title: "Üretime hazır çıktılar", body: "Tezgahındaki her araç için GLB, STL ve OBJ." },
      { title: "Sekiz dil", body: "Ustaların dilini konuşan bir stüdyo." },
    ],
    ctaTitle: "100 ücretsiz krediyle başla",
    ctaSubtitle: "Kart gerekmez.",
    pricingTitle: "Fiyatlandırma",
    pricingSubtitle: "Ücretsiz başla. Üretmeye hazır olunca yükselt.",
    monthly: "Aylık",
    yearly: "Yıllık",
    perMonth: "/ ay",
    popular: "Popüler",
    custom: "Özel",
    creditsPerMonth: "ayda {n} kredi",
    customVolume: "Özel hacim",
    billingNote: "Fiyatlar planlama içindir. Ödeme yakında.",
    ctaStartFree: "Ücretsiz başla",
    ctaGetStarted: "Başla",
    ctaContact: "Bize ulaşın",
  },
  es: {
    badge: "Para joyeros y artistas digitales",
    heroTitle: "De una sola idea a una joya lista para fundir",
    howTitle: "Cómo funciona",
    steps: [
      { title: "Describe o sube", body: "Empieza con un texto o una imagen de referencia — un boceto, una foto, una idea." },
      { title: "Aprueba o regenera", body: "Revisa cada resultado. Conserva lo que te gusta, regenera lo demás, paso a paso." },
      { title: "Exporta para producción", body: "Lleva la pieza terminada a ZBrush, MatrixGold o fundición en GLB, STL u OBJ." },
    ],
    features: [
      { title: "Imagen y texto a 3D", body: "Convierte una imagen o una descripción en un modelo 3D." },
      { title: "Mapa de engastes", body: "Localiza engastes para engaste invisible y pavé." },
      { title: "Exportaciones listas", body: "GLB, STL y OBJ para cada herramienta de tu taller." },
      { title: "Ocho idiomas", body: "Un estudio que habla el idioma de tus artesanos." },
    ],
    ctaTitle: "Empieza con 100 créditos gratis",
    ctaSubtitle: "Sin tarjeta.",
    pricingTitle: "Precios",
    pricingSubtitle: "Empieza gratis. Mejora cuando estés listo para producir.",
    monthly: "Mensual",
    yearly: "Anual",
    perMonth: "/ mes",
    popular: "Popular",
    custom: "Personalizado",
    creditsPerMonth: "{n} créditos / mes",
    customVolume: "Volumen personalizado",
    billingNote: "Precios orientativos. El pago llegará pronto.",
    ctaStartFree: "Empezar gratis",
    ctaGetStarted: "Comenzar",
    ctaContact: "Contáctanos",
  },
  ru: {
    badge: "Для ювелиров и цифровых художников",
    heroTitle: "От одной идеи до украшения, готового к литью",
    howTitle: "Как это работает",
    steps: [
      { title: "Опишите или загрузите", body: "Начните с текста или референса — эскиза, фото, идеи." },
      { title: "Примите или пересоздайте", body: "Просматривайте каждый результат. Оставляйте нужное, остальное пересоздавайте — шаг за шагом." },
      { title: "Экспорт для производства", body: "Перенесите готовое изделие в ZBrush, MatrixGold или литьё в GLB, STL или OBJ." },
    ],
    features: [
      { title: "Изображение и текст в 3D", body: "Превратите референс или описание в 3D-модель." },
      { title: "Разметка посадок камней", body: "Найдите посадки для невидимой и паве закрепки." },
      { title: "Готовые экспорты", body: "GLB, STL и OBJ для любого инструмента." },
      { title: "Восемь языков", body: "Студия на языке ваших мастеров." },
    ],
    ctaTitle: "Начните со 100 бесплатных кредитов",
    ctaSubtitle: "Без карты.",
    pricingTitle: "Цены",
    pricingSubtitle: "Начните бесплатно. Перейдите на платный план, когда будете готовы.",
    monthly: "Помесячно",
    yearly: "Ежегодно",
    perMonth: "/ мес",
    popular: "Популярный",
    custom: "Индивидуально",
    creditsPerMonth: "{n} кредитов / месяц",
    customVolume: "Индивидуальный объём",
    billingNote: "Цены для планирования. Оплата скоро.",
    ctaStartFree: "Начать бесплатно",
    ctaGetStarted: "Начать",
    ctaContact: "Связаться",
  },
  zh: {
    badge: "为珠宝匠与数字艺术家打造",
    heroTitle: "从一个想法到可铸造的珠宝",
    howTitle: "工作流程",
    steps: [
      { title: "描述或上传", body: "从文字或参考图像开始 — 草图、照片或一个想法。" },
      { title: "满意或重新生成", body: "查看每个结果。保留满意的，重新生成其余的，逐步完成。" },
      { title: "导出用于生产", body: "将成品以 GLB、STL 或 OBJ 带入 ZBrush、MatrixGold 或铸造。" },
    ],
    features: [
      { title: "图像与文字转 3D", body: "将参考图像或描述转化为 3D 模型。" },
      { title: "宝石镶口标注", body: "为隐藏镶嵌与密钉定位宝石镶口。" },
      { title: "可用于生产的导出", body: "适配每件工具的 GLB、STL 与 OBJ。" },
      { title: "八种语言", body: "一个讲你工匠语言的工作室。" },
    ],
    ctaTitle: "用 100 个免费积分开始",
    ctaSubtitle: "无需信用卡。",
    pricingTitle: "价格",
    pricingSubtitle: "免费开始，准备生产时再升级。",
    monthly: "按月",
    yearly: "按年",
    perMonth: "/ 月",
    popular: "热门",
    custom: "定制",
    creditsPerMonth: "每月 {n} 积分",
    customVolume: "定制额度",
    billingNote: "价格仅供参考，结账功能即将上线。",
    ctaStartFree: "免费开始",
    ctaGetStarted: "开始使用",
    ctaContact: "联系我们",
  },
  hi: {
    badge: "ज्वैलर्स और डिजिटल कलाकारों के लिए",
    heroTitle: "एक विचार से ढलाई-तैयार आभूषण तक",
    howTitle: "यह कैसे काम करता है",
    steps: [
      { title: "वर्णन करें या अपलोड करें", body: "एक टेक्स्ट या संदर्भ छवि से शुरू करें — एक स्केच, फोटो या विचार।" },
      { title: "स्वीकारें या फिर बनाएं", body: "हर परिणाम देखें। पसंद आया रखें, बाकी फिर से बनाएं — कदम दर कदम।" },
      { title: "उत्पादन के लिए निर्यात करें", body: "तैयार टुकड़े को GLB, STL या OBJ में ZBrush, MatrixGold या ढलाई में ले जाएं।" },
    ],
    features: [
      { title: "छवि और टेक्स्ट से 3D", body: "संदर्भ छवि या विवरण को 3D मॉडल में बदलें।" },
      { title: "रत्न स्थान मानचित्रण", body: "छिपी और पावे जड़ाई के लिए रत्न स्थान खोजें।" },
      { title: "उत्पादन-तैयार निर्यात", body: "हर उपकरण के लिए GLB, STL और OBJ।" },
      { title: "आठ भाषाएं", body: "एक स्टूडियो जो आपके कारीगरों की भाषा बोलता है।" },
    ],
    ctaTitle: "100 मुफ्त क्रेडिट के साथ शुरू करें",
    ctaSubtitle: "कार्ड की जरूरत नहीं।",
    pricingTitle: "मूल्य",
    pricingSubtitle: "मुफ्त शुरू करें। उत्पादन के लिए तैयार होने पर अपग्रेड करें।",
    monthly: "मासिक",
    yearly: "वार्षिक",
    perMonth: "/ माह",
    popular: "लोकप्रिय",
    custom: "कस्टम",
    creditsPerMonth: "{n} क्रेडिट / माह",
    customVolume: "कस्टम वॉल्यूम",
    billingNote: "मूल्य योजना के लिए। चेकआउट जल्द आ रहा है।",
    ctaStartFree: "मुफ्त शुरू करें",
    ctaGetStarted: "शुरू करें",
    ctaContact: "संपर्क करें",
  },
  ar: {
    badge: "لصُنّاع المجوهرات والفنانين الرقميين",
    heroTitle: "من فكرة واحدة إلى مجوهرات جاهزة للسبك",
    howTitle: "كيف يعمل",
    steps: [
      { title: "صِف أو ارفع", body: "ابدأ من نص أو صورة مرجعية — رسم، صورة، أو فكرة." },
      { title: "اقبل أو أعد الإنشاء", body: "راجع كل نتيجة. احتفظ بما يعجبك وأعد إنشاء الباقي خطوة بخطوة." },
      { title: "صدّر للإنتاج", body: "انقل القطعة النهائية إلى ZBrush أو MatrixGold أو السبك بصيغة GLB أو STL أو OBJ." },
    ],
    features: [
      { title: "من الصورة والنص إلى ثلاثي الأبعاد", body: "حوّل صورة مرجعية أو وصفًا إلى نموذج ثلاثي الأبعاد." },
      { title: "تحديد مواضع الأحجار", body: "حدد مواضع الأحجار للترصيع الخفي والبافيه." },
      { title: "تصديرات جاهزة للإنتاج", body: "GLB وSTL وOBJ لكل أداة على طاولتك." },
      { title: "ثماني لغات", body: "استوديو يتحدث لغة صُنّاعك." },
    ],
    ctaTitle: "ابدأ بـ 100 رصيد مجاني",
    ctaSubtitle: "دون بطاقة.",
    pricingTitle: "الأسعار",
    pricingSubtitle: "ابدأ مجانًا. ارتقِ عندما تكون جاهزًا للإنتاج.",
    monthly: "شهري",
    yearly: "سنوي",
    perMonth: "/ شهر",
    popular: "الأكثر شيوعًا",
    custom: "مخصص",
    creditsPerMonth: "{n} رصيد / شهر",
    customVolume: "حجم مخصص",
    billingNote: "الأسعار للتخطيط. الدفع قريبًا.",
    ctaStartFree: "ابدأ مجانًا",
    ctaGetStarted: "ابدأ",
    ctaContact: "تواصل معنا",
  },
  fr: {
    badge: "Pour joailliers et artistes numériques",
    heroTitle: "D'une seule idée au bijou prêt à couler",
    howTitle: "Comment ça marche",
    steps: [
      { title: "Décrivez ou importez", body: "Partez d'un texte ou d'une image de référence — un croquis, une photo, une idée." },
      { title: "Approuvez ou régénérez", body: "Examinez chaque résultat. Gardez ce que vous aimez, régénérez le reste, étape par étape." },
      { title: "Exportez pour la production", body: "Emmenez la pièce finie dans ZBrush, MatrixGold ou la fonte en GLB, STL ou OBJ." },
    ],
    features: [
      { title: "Image et texte en 3D", body: "Transformez une image ou une description en modèle 3D." },
      { title: "Cartographie des serties", body: "Localisez les serties pour le sertissage invisible et pavé." },
      { title: "Exports prêts à produire", body: "GLB, STL et OBJ pour chaque outil de votre établi." },
      { title: "Huit langues", body: "Un studio qui parle la langue de vos artisans." },
    ],
    ctaTitle: "Commencez avec 100 crédits gratuits",
    ctaSubtitle: "Sans carte.",
    pricingTitle: "Tarifs",
    pricingSubtitle: "Commencez gratuitement. Passez à un forfait quand vous êtes prêt.",
    monthly: "Mensuel",
    yearly: "Annuel",
    perMonth: "/ mois",
    popular: "Populaire",
    custom: "Sur mesure",
    creditsPerMonth: "{n} crédits / mois",
    customVolume: "Volume sur mesure",
    billingNote: "Prix indicatifs. Le paiement arrive bientôt.",
    ctaStartFree: "Commencer gratuitement",
    ctaGetStarted: "Commencer",
    ctaContact: "Nous contacter",
  },
};
