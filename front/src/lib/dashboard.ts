import type { UserRole } from "@/types/auth";

export const ROLE_LABELS: Record<UserRole, string> = {
  CLIENT: "Mijoz", ARTIST: "San'atkor", VENUE: "Toyxona", BUSINESS: "Biznes", BLOGGER: "Blogger", ADMIN: "Admin",
};

export function getDashboardPathForRole(role: UserRole): string {
  const paths: Record<UserRole, string> = {
    CLIENT: "/dashboard/client", ARTIST: "/dashboard/artist", VENUE: "/dashboard/venue",
    BUSINESS: "/dashboard/business", BLOGGER: "/dashboard/blogger", ADMIN: "/dashboard/admin",
  };
  return paths[role];
}

export interface NavItem {
  label: string;
  href: string;
}

export const CLIENT_NAV: NavItem[] = [
  { label: "Bosh sahifa", href: "/dashboard/client" },
  { label: "Toyxonalar", href: "/dashboard/client/venues" },
  { label: "San'atkorlar", href: "/dashboard/client/artists" },
  { label: "Bloggerlar", href: "/dashboard/client/bloggers" },
  { label: "Rejalarim", href: "/dashboard/client/plans" },
  { label: "Bronlarim", href: "/dashboard/client/bookings" },
];

export const ARTIST_NAV: NavItem[] = [
  { label: "Bosh sahifa", href: "/dashboard/artist" },
  { label: "Profilim", href: "/dashboard/artist/profile" },
  { label: "Buyurtmalar", href: "/dashboard/artist/bookings" },
  { label: "Barter", href: "/dashboard/artist/barter" },
];

export const VENUE_NAV: NavItem[] = [
  { label: "Bosh sahifa", href: "/dashboard/venue" },
  { label: "Profilim", href: "/dashboard/venue/profile" },
  { label: "Bronlar", href: "/dashboard/venue/bookings" },
  { label: "Daromad", href: "/dashboard/venue/earnings" },
];

export const BLOGGER_NAV: NavItem[] = [
  { label: "Bosh sahifa", href: "/dashboard/blogger" },
  { label: "Profilim", href: "/dashboard/blogger/profile" },
  { label: "Buyurtmalar", href: "/dashboard/blogger/bookings" },
  { label: "Barter", href: "/dashboard/blogger/barter" },
];

export const BUSINESS_NAV: NavItem[] = [
  { label: "Bosh sahifa", href: "/dashboard/business" },
  { label: "Takliflarim", href: "/dashboard/business/offers" },
  { label: "So'rovlar", href: "/dashboard/business/requests" },
];

export const ADMIN_NAV: NavItem[] = [
  { label: "Foydalanuvchilar", href: "/dashboard/admin/users" },
  { label: "Kategoriyalar", href: "/dashboard/admin/categories" },
  { label: "Statistika", href: "/dashboard/admin/stats" },
];
