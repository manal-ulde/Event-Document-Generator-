export type ClubOption = {
  id: string;
  name: string;
  acronym: string;
  colorClass: string;
  hex: string;
};

export const CLUBS: ClubOption[] = [
  { id: "csi", name: "Computer Society of India", acronym: "CSI", colorClass: "bg-primary", hex: "#7c3aed" },
  { id: "ieee", name: "Institute of Electrical and Electronics Engineers", acronym: "IEEE", colorClass: "bg-secondary", hex: "#f97316" },
  { id: "gdsc", name: "Google Developer Student Clubs", acronym: "GDSC", colorClass: "bg-accent", hex: "#0f9d58" },
  { id: "tapas", name: "TAPAS", acronym: "TAPAS", colorClass: "bg-primary", hex: "#2563eb" },
  { id: "nss", name: "National Service Scheme", acronym: "NSS", colorClass: "bg-secondary", hex: "#dc2626" },
  { id: "icell", name: "I-CELL", acronym: "I-CELL", colorClass: "bg-accent", hex: "#0f766e" },
];

export const COLLEGE_BRAND = {
  name: "Pimpri Chinchwad College of Engineering",
  address: "Sector 26, Pradhikaran, Nigdi, Pune 411044",
  acronym: "PCCOE",
  hex: "#111827",
};

export const getClubById = (id: string) => CLUBS.find((club) => club.id === id) ?? CLUBS[0];
