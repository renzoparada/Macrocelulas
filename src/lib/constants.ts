// ============================================================================
// Catálogos y constantes del dominio — Macro Santidad CRM
// ============================================================================

export const PROCESS_STAGES: { key: string; name: string; order: number; description: string }[] = [
  { key: "ACEPTO_JESUS", name: "Aceptó a Jesús", order: 1, description: "Momento en que la persona aceptó a Jesús como su Salvador." },
  { key: "PRIMERA_CELULA", name: "Primera vez en Célula", order: 2, description: "Primera vez que asiste a una célula." },
  { key: "NUEVO_MIEMBRO", name: "Nuevo Miembro", order: 3, description: "Persona integrada como miembro de una célula." },
  { key: "PRE_ENCUENTRO", name: "Pre-Encuentro", order: 4, description: "Cursando las 4 clases de Pre-Encuentro." },
  { key: "ENCUENTRO", name: "Encuentro", order: 5, description: "Participó en su Encuentro." },
  { key: "POST_ENCUENTRO", name: "Post-Encuentro", order: 6, description: "Cursando las 4 clases de Post-Encuentro." },
  { key: "BAUTISMO", name: "Bautismo", order: 7, description: "Persona bautizada en agua." },
  { key: "INTEGRACION_IGLESIA", name: "Integración a la Iglesia", order: 8, description: "Integrado a la congregación local." },
  { key: "DISCIPULADO", name: "Discipulado", order: 9, description: "En proceso activo de discipulado." },
  { key: "ENTRENAMIENTO", name: "Entrenamiento", order: 10, description: "En formación y capacitación." },
  { key: "LIDER_EN_FORMACION", name: "Líder en Formación", order: 11, description: "Preparándose para liderar una célula." },
  { key: "CO_LIDER", name: "Co-Líder", order: 12, description: "Sirviendo como co-líder de una célula." },
  { key: "LIDER", name: "Líder", order: 13, description: "Liderando su propia célula." },
  { key: "MULTIPLICACION", name: "Multiplicación", order: 14, description: "Formando nuevos líderes y multiplicando." },
  { key: "ENVIO", name: "Envío", order: 15, description: "Enviado a servir, liderar o abrir nuevas células." },
];

export const PRAYER_CATEGORIES = [
  "Familia",
  "Matrimonio",
  "Hijos",
  "Salud",
  "Trabajo",
  "Finanzas",
  "Estudios",
  "Dirección",
  "Propósito",
  "Vida espiritual",
  "Liderazgo",
  "Relaciones",
  "Restauración",
  "Necesidad personal",
  "Evangelización",
  "Protección",
  "Gratitud",
  "Otro",
];

export const CHALLENGE_CATEGORIES = [
  "Personal",
  "Familiar",
  "Matrimonio",
  "Hijos",
  "Trabajo",
  "Finanzas",
  "Emocional",
  "Espiritual",
  "Relaciones",
  "Liderazgo",
  "Hábitos",
  "Otro",
];

export const GOAL_CATEGORIES = [
  "Espiritual",
  "Familiar",
  "Personal",
  "Profesional",
  "Financiera",
  "Liderazgo",
  "Servicio",
  "Educación",
  "Salud",
  "Otra",
];

export const HOW_ARRIVED_OPTIONS: { value: string; label: string }[] = [
  { value: "INVITACION_PERSONAL", label: "Invitación personal" },
  { value: "INVITACION_MIEMBRO", label: "Invitación de miembro" },
  { value: "INVITACION_LIDER", label: "Invitación de líder" },
  { value: "IGLESIA", label: "Iglesia" },
  { value: "EVENTO", label: "Evento" },
  { value: "CONGRESO", label: "Congreso" },
  { value: "ENCUENTRO", label: "Encuentro" },
  { value: "REDES_SOCIALES", label: "Redes sociales" },
  { value: "CAMPANA", label: "Campaña" },
  { value: "OTRO", label: "Otro" },
];

export const EVENT_TYPES = [
  "Cosecha",
  "Ayuno",
  "Evangelismo",
  "Liberación",
  "Sanidad interior",
  "Escuela de liderazgo",
  "Capacitación",
  "Conferencia",
  "Vigilia",
  "Jornada de oración",
  "Actividad social",
  "Actividad familiar",
  "Servicio comunitario",
];

export const RETREAT_TYPES = [
  "Encuentro",
  "Re-Encuentro",
  "Encuentro de Rescate",
  "Retiro de Liderazgo",
  "Retiro de Matrimonios",
  "Retiro Familiar",
  "Otro",
];

export const TASK_TYPES: { value: string; label: string }[] = [
  { value: "LLAMAR", label: "Llamar" },
  { value: "WHATSAPP", label: "WhatsApp" },
  { value: "VISITAR", label: "Visitar" },
  { value: "INVITAR", label: "Invitar" },
  { value: "SEGUIMIENTO", label: "Seguimiento" },
  { value: "DISCIPULADO", label: "Discipulado" },
  { value: "INVITAR_ENCUENTRO", label: "Invitar a Encuentro" },
  { value: "CONTACTAR_FAMILIAR", label: "Contactar familiar" },
];

export const DISCIPLESHIP_TOOLS: { category: string; name: string }[] = [
  // Vida espiritual
  { category: "Vida Espiritual", name: "Devocional personal" },
  { category: "Vida Espiritual", name: "Lectura bíblica" },
  { category: "Vida Espiritual", name: "Plan de lectura bíblica" },
  { category: "Vida Espiritual", name: "Estudio bíblico" },
  { category: "Vida Espiritual", name: "Meditación de la Palabra" },
  { category: "Vida Espiritual", name: "Memorización de versículos" },
  { category: "Vida Espiritual", name: "Tiempo de oración" },
  { category: "Vida Espiritual", name: "Diario espiritual" },
  { category: "Vida Espiritual", name: "Diario de gratitud" },
  { category: "Vida Espiritual", name: "Alabanza y adoración" },
  { category: "Vida Espiritual", name: "Reflexión espiritual" },
  // Oración
  { category: "Oración", name: "Lista de oración" },
  { category: "Oración", name: "Diario de oración" },
  { category: "Oración", name: "Intercesión" },
  { category: "Oración", name: "Oración por familia" },
  { category: "Oración", name: "Oración por necesidades" },
  { category: "Oración", name: "Oración de agradecimiento" },
  { category: "Oración", name: "Oración de dirección" },
  { category: "Oración", name: "Oración por propósito" },
  { category: "Oración", name: "Ayuno y oración" },
  // Discipulado
  { category: "Discipulado", name: "Plan de discipulado" },
  { category: "Discipulado", name: "Seguimiento personal" },
  { category: "Discipulado", name: "Rendición de cuentas" },
  { category: "Discipulado", name: "Pareja de discipulado" },
  { category: "Discipulado", name: "Mentoría" },
  { category: "Discipulado", name: "Conversación de crecimiento" },
  { category: "Discipulado", name: "Plan de acción" },
  { category: "Discipulado", name: "Seguimiento de compromisos" },
  // Crecimiento personal
  { category: "Crecimiento Personal", name: "Identificación de fortalezas" },
  { category: "Crecimiento Personal", name: "Identificación de talentos" },
  { category: "Crecimiento Personal", name: "Identificación de dones" },
  { category: "Crecimiento Personal", name: "Definición de propósito" },
  { category: "Crecimiento Personal", name: "Definición de metas" },
  { category: "Crecimiento Personal", name: "Plan de vida" },
  { category: "Crecimiento Personal", name: "Visión personal" },
  { category: "Crecimiento Personal", name: "Sueños y proyectos" },
  { category: "Crecimiento Personal", name: "Plan de hábitos" },
  { category: "Crecimiento Personal", name: "Administración del tiempo" },
  { category: "Crecimiento Personal", name: "Administración financiera" },
  { category: "Crecimiento Personal", name: "Comunicación efectiva" },
  { category: "Crecimiento Personal", name: "Resolución de conflictos" },
  { category: "Crecimiento Personal", name: "Restauración de relaciones" },
  { category: "Crecimiento Personal", name: "Perdón" },
  { category: "Crecimiento Personal", name: "Gratitud" },
  // Familia
  { category: "Familia", name: "Tiempo de calidad familiar" },
  { category: "Familia", name: "Oración familiar" },
  { category: "Familia", name: "Devocional familiar" },
  { category: "Familia", name: "Comunicación matrimonial" },
  { category: "Familia", name: "Restauración matrimonial" },
  { category: "Familia", name: "Plan familiar" },
  { category: "Familia", name: "Proyecto familiar" },
  // Liderazgo
  { category: "Liderazgo", name: "Desarrollo de liderazgo" },
  { category: "Liderazgo", name: "Formación de líder" },
  { category: "Liderazgo", name: "Liderazgo servicial" },
  { category: "Liderazgo", name: "Delegación" },
  { category: "Liderazgo", name: "Formación de discípulos" },
  { category: "Liderazgo", name: "Formación de nuevos líderes" },
  { category: "Liderazgo", name: "Multiplicación" },
  { category: "Liderazgo", name: "Preparación para liderar célula" },
  { category: "Liderazgo", name: "Evaluación de liderazgo" },
  { category: "Liderazgo", name: "Plan de desarrollo de líder" },
  // Servicio
  { category: "Servicio", name: "Identificación de dones" },
  { category: "Servicio", name: "Identificación de área de servicio" },
  { category: "Servicio", name: "Integración a ministerio" },
  { category: "Servicio", name: "Servicio en célula" },
  { category: "Servicio", name: "Evangelismo" },
  { category: "Servicio", name: "Misiones" },
  { category: "Servicio", name: "Servicio comunitario" },
  { category: "Servicio", name: "Liderazgo de equipos" },
];

export type NavItem = {
  label: string;
  href: string;
  icon: string;
  pillar?: "GANAR" | "CONSOLIDAR" | "ENTRENAR" | "ENVIAR";
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/", icon: "LayoutDashboard" },
  { label: "Personas", href: "/personas", icon: "Users", pillar: "GANAR" },
  { label: "Familias", href: "/familias", icon: "Home" },
  { label: "Células", href: "/celulas", icon: "CircleDot" },
  { label: "Líderes", href: "/lideres", icon: "Crown" },
  { label: "Embudo / Proceso", href: "/proceso", icon: "Filter" },
  { label: "Asistencia", href: "/asistencia", icon: "CalendarCheck", pillar: "CONSOLIDAR" },
  { label: "Discipulado", href: "/discipulado", icon: "BookOpen", pillar: "ENTRENAR" },
  { label: "Motivos de Oración", href: "/oracion", icon: "HandHeart" },
  { label: "Pre-Encuentro", href: "/pre-encuentro", icon: "ListChecks", pillar: "CONSOLIDAR" },
  { label: "Encuentros", href: "/encuentros", icon: "Sparkles", pillar: "CONSOLIDAR" },
  { label: "Post-Encuentro", href: "/post-encuentro", icon: "ListChecks", pillar: "CONSOLIDAR" },
  { label: "Bautismos", href: "/bautismos", icon: "Droplet", pillar: "CONSOLIDAR" },
  { label: "Iglesia", href: "/iglesia", icon: "Church" },
  { label: "Retiros", href: "/retiros", icon: "Tent" },
  { label: "Congresos", href: "/congresos", icon: "Presentation" },
  { label: "Eventos", href: "/eventos", icon: "PartyPopper" },
  { label: "Metas y Sueños", href: "/metas-suenos", icon: "Target" },
  { label: "Testimonios", href: "/testimonios", icon: "Quote" },
  { label: "Liderazgo", href: "/liderazgo", icon: "Award", pillar: "ENVIAR" },
  { label: "Multiplicación", href: "/multiplicacion", icon: "GitBranch", pillar: "ENVIAR" },
  { label: "Informes", href: "/informes", icon: "FileBarChart" },
  { label: "Reportes", href: "/reportes", icon: "FileText" },
  { label: "Notificaciones", href: "/notificaciones", icon: "Bell" },
  { label: "Configuración", href: "/configuracion", icon: "Settings" },
  { label: "Usuarios y permisos", href: "/usuarios", icon: "ShieldCheck" },
  { label: "Auditoría", href: "/auditoria", icon: "History" },
];

export const PILLARS: { key: "GANAR" | "CONSOLIDAR" | "ENTRENAR" | "ENVIAR"; title: string; subtitle: string; href: string }[] = [
  { key: "GANAR", title: "GANAR", subtitle: "Nuevos · Invitados · Cosechas", href: "/dashboard/ganar" },
  { key: "CONSOLIDAR", title: "CONSOLIDAR", subtitle: "Asistencia · Encuentro · Bautismo", href: "/dashboard/consolidar" },
  { key: "ENTRENAR", title: "ENTRENAR", subtitle: "Discipulado · Formación · Liderazgo", href: "/dashboard/entrenar" },
  { key: "ENVIAR", title: "ENVIAR", subtitle: "Multiplicación · Nuevos líderes · Nuevas células", href: "/dashboard/enviar" },
];

export const ENCOUNTER_REQUIREMENTS = {
  minMonths: 3,
  minPreEncounterClasses: 4,
  minAttendancePercent: 70,
};
