export type ClubOption = {
  id: string;
  name: string;
  acronym: string;
  colorClass: string;
  hex: string;
  logoPath: string;
};

export const CLUBS: ClubOption[] = [
  { id: "csi", name: "Computer Society of India", acronym: "CSI", colorClass: "bg-primary", hex: "#7c3aed", logoPath: "/logos/clubs/csi.png" },
  { id: "ieee", name: "Institute of Electrical and Electronics Engineers", acronym: "IEEE", colorClass: "bg-secondary", hex: "#f97316", logoPath: "/logos/clubs/ieee.png" },
  { id: "gdsc", name: "Google Developer Student Clubs", acronym: "GDSC", colorClass: "bg-accent", hex: "#0f9d58", logoPath: "/logos/clubs/gdsc.png" },
  { id: "tapas", name: "TAPAS", acronym: "TAPAS", colorClass: "bg-primary", hex: "#2563eb", logoPath: "/logos/clubs/tapas.png" },
  { id: "nss", name: "National Service Scheme", acronym: "NSS", colorClass: "bg-secondary", hex: "#dc2626", logoPath: "/logos/clubs/nss.png" },
  { id: "icell", name: "I-CELL", acronym: "I-CELL", colorClass: "bg-accent", hex: "#0f766e", logoPath: "/logos/clubs/icell.png" },
];

export const COLLEGE_BRAND = {
  name: "Pillai College of Engineering",
  address: "",
  acronym: "PCE",
  hex: "#111827",
  logoPath: "/logos/college/pce.png",
};

export const getClubById = (id: string) => CLUBS.find((club) => club.id === id) ?? CLUBS[0];
