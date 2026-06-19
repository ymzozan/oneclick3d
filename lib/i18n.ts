/**
 * Lightweight client-side localisation for the studio UI.
 *
 * Covers eight of the world's most widely spoken languages. Each locale carries
 * a flag and a native label for the switcher; changing the flag switches the
 * interface language.
 */

import type { StageId } from "@/lib/pipeline";

export type Locale = "en" | "zh" | "hi" | "es" | "ar" | "fr" | "ru" | "tr";

export interface LocaleMeta {
  code: Locale;
  label: string;
  flag: string;
  rtl?: boolean;
}

export const LOCALES: LocaleMeta[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "hi", label: "हिन्दी", flag: "🇮🇳" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "ar", label: "العربية", flag: "🇸🇦", rtl: true },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "tr", label: "Türkçe", flag: "🇹🇷" },
];

type WorkStage = Exclude<StageId, "reference">;

export interface Dict {
  tagline: string;
  heroTitle: string;
  heroSubtitle: string;
  promptPlaceholder: string;
  attachImage: string;
  generate: string;
  generating: string;
  refAttached: string;
  remove: string;
  backToWorkspace: string; // contains {n}
  projects: string;
  newProject: string;
  detectSeats: string;
  analysing: string;
  exportLabel: string;
  approve: string;
  regenerate: string;
  finished: string;
  navStudio: string;
  navPricing: string;
  signIn: string;
  startCreating: string;
  parametricNote: string;
  unavailableNote: string;
  stages: Record<WorkStage, { label: string; desc: string }>;
}

export const TRANSLATIONS: Record<Locale, Dict> = {
  en: {
    tagline: "Image to casting-ready jewelry",
    heroTitle: "Create jewelry from a single idea",
    heroSubtitle:
      "Describe the piece or drop a reference image. OneClick3D builds the model, maps the stone seats and prepares it for casting.",
    promptPlaceholder: "Describe the piece you want to create…",
    attachImage: "Attach image",
    generate: "Generate",
    generating: "Generating…",
    refAttached: "Reference image attached",
    remove: "Remove",
    backToWorkspace: "Back to workspace ({n})",
    projects: "Projects",
    newProject: "New",
    detectSeats: "Detect stone seats",
    analysing: "Analysing…",
    exportLabel: "Export",
    approve: "Looks good — continue",
    regenerate: "Regenerate",
    finished: "Completed",
    navStudio: "Studio",
    navPricing: "Pricing",
    signIn: "Sign in",
    startCreating: "Start creating",
    parametricNote: "Showing a parametric preview — deploy the inference service for a photoreal mesh.",
    unavailableNote: "Inference service unavailable — showing a parametric preview.",
    stages: {
      generate: { label: "Generate 3D", desc: "Turn the reference into a base 3D mesh." },
      preview: { label: "Preview", desc: "Inspect the generated model in the browser." },
      "stone-seats": { label: "Stone Seats", desc: "Map gemstone seats for flush setting work." },
      sculpt: { label: "Sculpt", desc: "Export for organic, high-detail sculpting." },
      cad: { label: "CAD", desc: "Refine settings and mountings parametrically." },
      sprue: { label: "Sprueing", desc: "Lay out casting channels ready for production." },
    },
  },
  tr: {
    tagline: "Görselden döküme hazır takıya",
    heroTitle: "Tek bir fikirden takı yaratın",
    heroSubtitle:
      "Parçayı tarif edin ya da bir referans görsel yükleyin. OneClick3D modeli oluşturur, taş yuvalarını çıkarır ve dökümе hazırlar.",
    promptPlaceholder: "Oluşturmak istediğiniz parçayı tarif edin…",
    attachImage: "Görsel ekle",
    generate: "Oluştur",
    generating: "Oluşturuluyor…",
    refAttached: "Referans görsel eklendi",
    remove: "Kaldır",
    backToWorkspace: "Çalışma alanına dön ({n})",
    projects: "Projeler",
    newProject: "Yeni",
    detectSeats: "Taş yuvalarını tespit et",
    analysing: "Analiz ediliyor…",
    exportLabel: "Dışa aktar",
    approve: "Beğendim, devam et",
    regenerate: "Yeniden üret",
    finished: "Tamamlandı",
    navStudio: "Stüdyo",
    navPricing: "Fiyatlandırma",
    signIn: "Giriş yap",
    startCreating: "Üretmeye başla",
    parametricNote: "Parametrik önizleme gösteriliyor — fotogerçekçi mesh için inference servisini yayına alın.",
    unavailableNote: "Inference servisi kullanılamıyor — parametrik önizleme gösteriliyor.",
    stages: {
      generate: { label: "3D Oluştur", desc: "Referansı taban 3D mesh'e dönüştürün." },
      preview: { label: "Önizleme", desc: "Oluşturulan modeli tarayıcıda inceleyin." },
      "stone-seats": { label: "Taş Yuvaları", desc: "Gizli mıhlama için taş yuvalarını çıkarın." },
      sculpt: { label: "Heykeltıraşlık", desc: "Organik, detaylı işçilik için dışa aktarın." },
      cad: { label: "CAD", desc: "Montür ve yuvaları parametrik düzenleyin." },
      sprue: { label: "Koçanlama", desc: "Döküm kanallarını üretime hazır yerleştirin." },
    },
  },
  es: {
    tagline: "De la imagen a la joya lista para fundir",
    heroTitle: "Crea joyería a partir de una sola idea",
    heroSubtitle:
      "Describe la pieza o sube una imagen de referencia. OneClick3D construye el modelo, mapea los engastes y la prepara para fundición.",
    promptPlaceholder: "Describe la pieza que quieres crear…",
    attachImage: "Adjuntar imagen",
    generate: "Generar",
    generating: "Generando…",
    refAttached: "Imagen de referencia adjunta",
    remove: "Quitar",
    backToWorkspace: "Volver al espacio ({n})",
    projects: "Proyectos",
    newProject: "Nuevo",
    detectSeats: "Detectar engastes",
    analysing: "Analizando…",
    exportLabel: "Exportar",
    approve: "Me gusta — continuar",
    regenerate: "Regenerar",
    finished: "Completado",
    navStudio: "Estudio",
    navPricing: "Precios",
    signIn: "Iniciar sesión",
    startCreating: "Empezar a crear",
    parametricNote: "Mostrando una vista paramétrica — despliega el servicio de inferencia para una malla fotorrealista.",
    unavailableNote: "Servicio de inferencia no disponible — mostrando vista paramétrica.",
    stages: {
      generate: { label: "Generar 3D", desc: "Convierte la referencia en una malla 3D base." },
      preview: { label: "Vista previa", desc: "Inspecciona el modelo en el navegador." },
      "stone-seats": { label: "Engastes", desc: "Mapea los engastes para engaste invisible." },
      sculpt: { label: "Escultura", desc: "Exporta para escultura orgánica y detallada." },
      cad: { label: "CAD", desc: "Refina engastes y monturas paramétricamente." },
      sprue: { label: "Bebederos", desc: "Dispón los canales de fundición para producción." },
    },
  },
  ru: {
    tagline: "От изображения к готовому к литью украшению",
    heroTitle: "Создавайте украшения из одной идеи",
    heroSubtitle:
      "Опишите изделие или загрузите референс. OneClick3D строит модель, размечает посадочные места камней и готовит к литью.",
    promptPlaceholder: "Опишите изделие, которое хотите создать…",
    attachImage: "Прикрепить изображение",
    generate: "Создать",
    generating: "Создание…",
    refAttached: "Референс прикреплён",
    remove: "Убрать",
    backToWorkspace: "К рабочей области ({n})",
    projects: "Проекты",
    newProject: "Новый",
    detectSeats: "Определить посадки камней",
    analysing: "Анализ…",
    exportLabel: "Экспорт",
    approve: "Нравится — продолжить",
    regenerate: "Сгенерировать заново",
    finished: "Завершено",
    navStudio: "Студия",
    navPricing: "Цены",
    signIn: "Войти",
    startCreating: "Начать создавать",
    parametricNote: "Показана параметрическая модель — разверните сервис инференса для фотореалистичной сетки.",
    unavailableNote: "Сервис инференса недоступен — показана параметрическая модель.",
    stages: {
      generate: { label: "Создать 3D", desc: "Преобразуйте референс в базовую 3D-сетку." },
      preview: { label: "Просмотр", desc: "Изучите модель в браузере." },
      "stone-seats": { label: "Посадки камней", desc: "Разметка посадок для невидимой закрепки." },
      sculpt: { label: "Скульптинг", desc: "Экспорт для органичной детальной лепки." },
      cad: { label: "CAD", desc: "Параметрически доработайте оправы." },
      sprue: { label: "Литники", desc: "Разместите литниковые каналы для литья." },
    },
  },
  zh: {
    tagline: "从图像到可铸造的珠宝",
    heroTitle: "用一个想法创造珠宝",
    heroSubtitle:
      "描述作品或上传参考图像。OneClick3D 构建模型、标注宝石镶口并为铸造做好准备。",
    promptPlaceholder: "描述你想创作的作品…",
    attachImage: "添加图像",
    generate: "生成",
    generating: "生成中…",
    refAttached: "已添加参考图像",
    remove: "移除",
    backToWorkspace: "返回工作区 ({n})",
    projects: "项目",
    newProject: "新建",
    detectSeats: "检测宝石镶口",
    analysing: "分析中…",
    exportLabel: "导出",
    approve: "满意 — 继续",
    regenerate: "重新生成",
    finished: "已完成",
    navStudio: "工作室",
    navPricing: "价格",
    signIn: "登录",
    startCreating: "开始创作",
    parametricNote: "显示参数化预览 — 部署推理服务以获得逼真网格。",
    unavailableNote: "推理服务不可用 — 显示参数化预览。",
    stages: {
      generate: { label: "生成 3D", desc: "将参考转换为基础 3D 网格。" },
      preview: { label: "预览", desc: "在浏览器中查看生成的模型。" },
      "stone-seats": { label: "宝石镶口", desc: "为隐藏镶嵌标注宝石镶口。" },
      sculpt: { label: "雕刻", desc: "导出用于有机高细节雕刻。" },
      cad: { label: "CAD", desc: "参数化优化镶口与底座。" },
      sprue: { label: "浇道", desc: "布置铸造浇道以备生产。" },
    },
  },
  hi: {
    tagline: "छवि से ढलाई-तैयार आभूषण तक",
    heroTitle: "एक विचार से आभूषण बनाएं",
    heroSubtitle:
      "टुकड़े का वर्णन करें या एक संदर्भ छवि अपलोड करें। OneClick3D मॉडल बनाता है, रत्न स्थान चिह्नित करता है और ढलाई के लिए तैयार करता है।",
    promptPlaceholder: "जो टुकड़ा बनाना चाहते हैं उसका वर्णन करें…",
    attachImage: "छवि जोड़ें",
    generate: "बनाएं",
    generating: "बन रहा है…",
    refAttached: "संदर्भ छवि जोड़ी गई",
    remove: "हटाएं",
    backToWorkspace: "कार्यक्षेत्र पर लौटें ({n})",
    projects: "परियोजनाएं",
    newProject: "नया",
    detectSeats: "रत्न स्थान पहचानें",
    analysing: "विश्लेषण हो रहा है…",
    exportLabel: "निर्यात",
    approve: "पसंद आया — जारी रखें",
    regenerate: "फिर से बनाएं",
    finished: "पूर्ण",
    navStudio: "स्टूडियो",
    navPricing: "मूल्य",
    signIn: "साइन इन",
    startCreating: "बनाना शुरू करें",
    parametricNote: "पैरामीट्रिक पूर्वावलोकन दिखाया जा रहा है — फोटोरियल मेश के लिए इन्फरेंस सेवा तैनात करें।",
    unavailableNote: "इन्फरेंस सेवा उपलब्ध नहीं — पैरामीट्रिक पूर्वावलोकन दिखाया जा रहा है।",
    stages: {
      generate: { label: "3D बनाएं", desc: "संदर्भ को आधार 3D मेश में बदलें।" },
      preview: { label: "पूर्वावलोकन", desc: "मॉडल को ब्राउज़र में देखें।" },
      "stone-seats": { label: "रत्न स्थान", desc: "छिपी जड़ाई के लिए रत्न स्थान चिह्नित करें।" },
      sculpt: { label: "मूर्तिकला", desc: "जैविक, बारीक काम के लिए निर्यात करें।" },
      cad: { label: "CAD", desc: "सेटिंग और माउंटिंग को पैरामीट्रिक रूप से सुधारें।" },
      sprue: { label: "स्प्रू", desc: "उत्पादन के लिए ढलाई चैनल लगाएं।" },
    },
  },
  ar: {
    tagline: "من الصورة إلى مجوهرات جاهزة للسبك",
    heroTitle: "اصنع المجوهرات من فكرة واحدة",
    heroSubtitle:
      "صِف القطعة أو ارفع صورة مرجعية. يبني OneClick3D النموذج ويحدد مواضع الأحجار ويجهزها للسبك.",
    promptPlaceholder: "صِف القطعة التي تريد إنشاءها…",
    attachImage: "إرفاق صورة",
    generate: "إنشاء",
    generating: "جارٍ الإنشاء…",
    refAttached: "تم إرفاق صورة مرجعية",
    remove: "إزالة",
    backToWorkspace: "العودة إلى مساحة العمل ({n})",
    projects: "المشاريع",
    newProject: "جديد",
    detectSeats: "كشف مواضع الأحجار",
    analysing: "جارٍ التحليل…",
    exportLabel: "تصدير",
    approve: "أعجبني — متابعة",
    regenerate: "إعادة الإنشاء",
    finished: "اكتمل",
    navStudio: "الاستوديو",
    navPricing: "الأسعار",
    signIn: "تسجيل الدخول",
    startCreating: "ابدأ الإبداع",
    parametricNote: "عرض معاينة بارامترية — انشر خدمة الاستدلال للحصول على شبكة واقعية.",
    unavailableNote: "خدمة الاستدلال غير متاحة — عرض معاينة بارامترية.",
    stages: {
      generate: { label: "إنشاء ثلاثي الأبعاد", desc: "حوّل المرجع إلى شبكة ثلاثية الأبعاد أساسية." },
      preview: { label: "معاينة", desc: "افحص النموذج في المتصفح." },
      "stone-seats": { label: "مواضع الأحجار", desc: "حدد مواضع الأحجار للترصيع الخفي." },
      sculpt: { label: "نحت", desc: "صدّر للنحت العضوي عالي التفاصيل." },
      cad: { label: "CAD", desc: "حسّن المرصّعات والقواعد بشكل بارامتري." },
      sprue: { label: "قنوات السبك", desc: "رتّب قنوات السبك جاهزة للإنتاج." },
    },
  },
  fr: {
    tagline: "De l'image au bijou prêt à couler",
    heroTitle: "Créez des bijoux à partir d'une seule idée",
    heroSubtitle:
      "Décrivez la pièce ou déposez une image de référence. OneClick3D construit le modèle, cartographie les serties et la prépare pour la fonte.",
    promptPlaceholder: "Décrivez la pièce que vous voulez créer…",
    attachImage: "Joindre une image",
    generate: "Générer",
    generating: "Génération…",
    refAttached: "Image de référence jointe",
    remove: "Retirer",
    backToWorkspace: "Retour à l'espace ({n})",
    projects: "Projets",
    newProject: "Nouveau",
    detectSeats: "Détecter les serties",
    analysing: "Analyse…",
    exportLabel: "Exporter",
    approve: "J'aime — continuer",
    regenerate: "Régénérer",
    finished: "Terminé",
    navStudio: "Studio",
    navPricing: "Tarifs",
    signIn: "Se connecter",
    startCreating: "Commencer à créer",
    parametricNote: "Aperçu paramétrique affiché — déployez le service d'inférence pour un maillage photoréaliste.",
    unavailableNote: "Service d'inférence indisponible — aperçu paramétrique affiché.",
    stages: {
      generate: { label: "Générer 3D", desc: "Transformez la référence en maillage 3D de base." },
      preview: { label: "Aperçu", desc: "Inspectez le modèle dans le navigateur." },
      "stone-seats": { label: "Serties", desc: "Cartographiez les serties pour le sertissage invisible." },
      sculpt: { label: "Sculpture", desc: "Exportez pour la sculpture organique détaillée." },
      cad: { label: "CAO", desc: "Affinez serties et montures de façon paramétrique." },
      sprue: { label: "Canaux", desc: "Disposez les canaux de coulée prêts à produire." },
    },
  },
};

export function format(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
}
