import type { ArtistProfile, BloggerProfile, VenueProfile } from "@/types/api";

export const PLANNER_STORAGE_KEY = "eventhub_planner_plan";

export type PlannerStep = 1 | 2 | 3 | 4 | 5 | 6;

export type EventTypeId =
  | "wedding"
  | "birthday"
  | "corporate"
  | "graduation"
  | "business"
  | "other";

export type ServiceFetchType = "venue" | "artist" | "blogger";

export interface PlannerServiceDef {
  id: string;
  icon: string;
  label: string;
  fetchType: ServiceFetchType;
  categoryTypes?: string[];
  categoryKeywords?: string[];
  bloggerCategory?: string;
}

export const EVENT_TYPES: { id: EventTypeId; icon: string; label: string; description: string }[] = [
  { id: "wedding", icon: "💍", label: "To'y marosimi", description: "Unutilmas kun uchun mukammal reja" },
  { id: "birthday", icon: "🎂", label: "Tug'ilgan kun", description: "Shirin xotiralar uchun" },
  { id: "corporate", icon: "🏢", label: "Korporativ tadbir", description: "Jamoa va hamkorlar uchun" },
  { id: "graduation", icon: "🎓", label: "Graduation / Bitiruv", description: "Bitiruvchilarni tantanali kutib oling" },
  { id: "business", icon: "💼", label: "Biznes anjuman", description: "Professional muhit" },
  { id: "other", icon: "🎉", label: "Boshqa tadbir", description: "Har qanday maxsus tadbir" },
];

export const UZBEKISTAN_CITIES = [
  "Toshkent shahri",
  "Toshkent viloyati",
  "Samarqand",
  "Buxoro",
  "Andijon",
  "Farg'ona",
  "Namangan",
  "Qashqadaryo",
  "Surxondaryo",
  "Navoiy",
  "Jizzax",
  "Sirdaryo",
  "Xorazm",
  "Qoraqalpog'iston",
];

export const PLANNER_SERVICES: PlannerServiceDef[] = [
  { id: "venue", icon: "🏛️", label: "Toyxona/Restoran", fetchType: "venue" },
  { id: "singer", icon: "🎤", label: "Xonanda/Artist", fetchType: "artist", categoryTypes: ["ARTIST"], categoryKeywords: ["xonanda", "artist", "dj", "musiq"] },
  { id: "host", icon: "🎙️", label: "Boshlovchi (Toastmaster)", fetchType: "artist", categoryTypes: ["HOST"], categoryKeywords: ["boshlovchi", "host", "toast"] },
  { id: "photo", icon: "📸", label: "Fotograf", fetchType: "artist", categoryTypes: ["PHOTOGRAPHER"], categoryKeywords: ["foto", "photo"] },
  { id: "video", icon: "🎥", label: "Videograf", fetchType: "artist", categoryTypes: ["VIDEOGRAPHER"], categoryKeywords: ["video", "kino"] },
  { id: "dj", icon: "🎧", label: "DJ/Musiqachi", fetchType: "artist", categoryTypes: ["ARTIST", "TECHNICIAN"], categoryKeywords: ["dj", "musiq"] },
  { id: "dancer", icon: "💃", label: "Raqqosa", fetchType: "artist", categoryKeywords: ["raqs", "dancer"] },
  { id: "animator", icon: "🎪", label: "Animator", fetchType: "artist", categoryKeywords: ["animator"] },
  { id: "sound", icon: "🔊", label: "Ovoz texniki", fetchType: "artist", categoryTypes: ["TECHNICIAN"], categoryKeywords: ["ovoz", "sound"] },
  { id: "light", icon: "💡", label: "Yorug'lik texniki", fetchType: "artist", categoryTypes: ["TECHNICIAN"], categoryKeywords: ["yorug", "light"] },
  { id: "cake", icon: "🎂", label: "Tort", fetchType: "artist", categoryKeywords: ["tort", "cake"] },
  { id: "decor", icon: "💐", label: "Guldasta/Bezak", fetchType: "artist", categoryKeywords: ["gul", "bezak", "decor"] },
  { id: "blogger", icon: "📱", label: "Blogger/Reklama", fetchType: "blogger", bloggerCategory: "reklama" },
];

export const BUDGET_PRESETS = [
  { label: "5 mln", value: 5_000_000 },
  { label: "10 mln", value: 10_000_000 },
  { label: "20 mln", value: 20_000_000 },
  { label: "50 mln", value: 50_000_000 },
  { label: "100 mln+", value: 100_000_000 },
];

export type SelectedPlanItem =
  | {
      key: string;
      serviceId: string;
      serviceLabel: string;
      type: "venue";
      profile: VenueProfile;
      price: number;
    }
  | {
      key: string;
      serviceId: string;
      serviceLabel: string;
      type: "artist";
      profile: ArtistProfile;
      price: number;
    }
  | {
      key: string;
      serviceId: string;
      serviceLabel: string;
      type: "blogger";
      profile: BloggerProfile;
      price: number;
      contentFormat?: string;
    };

export interface EventPlan {
  eventType: EventTypeId | "";
  city: string;
  services: string[];
  budget: number;
  eventDate: string;
  guestCount: number;
  selected: SelectedPlanItem[];
  updatedAt: string;
}

export const emptyPlan = (): EventPlan => ({
  eventType: "",
  city: "",
  services: [],
  budget: 0,
  eventDate: "",
  guestCount: 50,
  selected: [],
  updatedAt: new Date().toISOString(),
});

export function loadPlan(): EventPlan | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PLANNER_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as EventPlan;
  } catch {
    return null;
  }
}

export function savePlan(plan: EventPlan) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PLANNER_STORAGE_KEY, JSON.stringify({ ...plan, updatedAt: new Date().toISOString() }));
}

export function estimateVenuePrice(venue: VenueProfile, hours = 5): number {
  return Math.round(Number(venue.pricePerHour) * hours);
}

export function estimateArtistPrice(artist: ArtistProfile): number {
  if (artist.pricePerEvent && artist.pricePerEvent > 0) return Math.round(artist.pricePerEvent);
  if (artist.pricePerHour && artist.pricePerHour > 0) return Math.round(artist.pricePerHour * 3);
  return 0;
}

export function estimateBloggerPrice(blogger: BloggerProfile): number {
  if (!blogger.contentFormats?.length) return 0;
  return Math.min(...blogger.contentFormats.map((f) => f.price));
}

export function planTotal(plan: EventPlan): number {
  return plan.selected.reduce((s, i) => s + i.price, 0);
}

export interface AdvanceLine {
  item: SelectedPlanItem;
  percent: number;
  amount: number;
}

export function advancePercentForItem(item: SelectedPlanItem): number {
  const p =
    item.type === "venue"
      ? item.profile.advancePaymentPercent
      : item.type === "artist"
        ? item.profile.advancePaymentPercent
        : item.profile.advancePaymentPercent;
  return p != null && p > 0 && p <= 100 ? p : 30;
}

export function advanceAmount(price: number, percent: number): number {
  return Math.round((price * percent) / 100);
}

export function displayNameForItem(item: SelectedPlanItem): string {
  if (item.type === "venue") return item.profile.name;
  if (item.type === "artist") return item.profile.fullName;
  return item.profile.fullName;
}

export interface SavedPlanPayload {
  services: string[];
  selected: Array<{
    key: string;
    serviceId: string;
    serviceLabel: string;
    type: "venue" | "artist" | "blogger";
    profileId: string;
    price: number;
    contentFormat?: string;
  }>;
}

export function serializePlanForApi(plan: EventPlan): string {
  const payload: SavedPlanPayload = {
    services: plan.services,
    selected: plan.selected.map((s) => ({
      key: s.key,
      serviceId: s.serviceId,
      serviceLabel: s.serviceLabel,
      type: s.type,
      profileId: s.profile.id,
      price: s.price,
      contentFormat: s.type === "blogger" ? s.contentFormat : undefined,
    })),
  };
  return JSON.stringify(payload);
}
