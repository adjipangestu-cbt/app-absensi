export const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyYxo6zvlorHVrQks7NfvCsN9WVOqtNVZskbIlnFYTqXC9pOAVtEJmi4tDBBf5Bhw_0/exec";

export const dataAnggota: Record<string, string[]> = {
  "Grup A": ["Bang Jeje", "Rian", "Dika", "Fajar"],
  "Grup B": ["Ilham", "Reza", "Budi", "Wahyu Pulo"],
};

export const COASTAL_CONFETTI_COLORS = [
  "#0D9488", // Lagoon Teal
  "#FF6B4A", // Sunset Coral
  "#CCFBF1", // Cyan Shallow
  "#14B8A6", // Tropical Teal
  "#F59E0B", // Sun Gold
];

export interface AttendancePayload {
  tipe: "absensi";
  grup: string;
  nama: string;
}

export interface FeedbackEffectConfig {
  cardAnimationClass: "animate-card-success" | "animate-card-shake" | "animate-card-pulse";
  triggerConfetti: boolean;
  confettiParticleCount: number;
  vibratePattern: number[];
}

export function getFeedbackEffect(
  outcome: "berhasil" | "sudah_absen" | "validasi_gagal" | "error_jaringan"
): FeedbackEffectConfig {
  switch (outcome) {
    case "berhasil":
      return {
        cardAnimationClass: "animate-card-success",
        triggerConfetti: true,
        confettiParticleCount: 85,
        vibratePattern: [60, 40, 100],
      };
    case "sudah_absen":
      return {
        cardAnimationClass: "animate-card-pulse",
        triggerConfetti: true,
        confettiParticleCount: 35,
        vibratePattern: [40, 30, 40],
      };
    case "validasi_gagal":
    case "error_jaringan":
      return {
        cardAnimationClass: "animate-card-shake",
        triggerConfetti: false,
        confettiParticleCount: 0,
        vibratePattern: [80, 50, 80],
      };
  }
}

export function getInitials(nama: string): string {
  const cleaned = (nama || "").trim();
  if (!cleaned) return "AP";
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function getOfficerIdCode(grup: string, nama: string): string {
  if (!grup || !nama) return "POSKO-MERAK-00";
  const members = dataAnggota[grup] || [];
  const idx = members.indexOf(nama);
  const groupCode = grup === "Grup A" ? "GA" : grup === "Grup B" ? "GB" : "GP";
  const num = idx >= 0 ? String(idx + 1).padStart(2, "0") : "01";
  return `AP-${groupCode}-2026${num}`;
}

export function formatTanggalIndonesia(date: Date): string {
  const hariList = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
  ];
  const bulanList = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];
  const hari = hariList[date.getDay()];
  const tgl = date.getDate();
  const bln = bulanList[date.getMonth()];
  const thn = date.getFullYear();
  return `${hari}, ${tgl} ${bln} ${thn}`;
}

export function formatJamDigital(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export function validateAndBuildPayload(
  grupTerpilih: string,
  nama: string
): { valid: true; payload: AttendancePayload } | { valid: false; error: string } {
  if (!grupTerpilih || !nama) {
    return {
      valid: false,
      error: "Pilih Grup dan Nama terlebih dahulu!",
    };
  }
  const validMembers = dataAnggota[grupTerpilih];
  if (!validMembers || !validMembers.includes(nama)) {
    return {
      valid: false,
      error: "Petugas tidak terdaftar pada grup yang dipilih.",
    };
  }
  return {
    valid: true,
    payload: {
      tipe: "absensi",
      grup: grupTerpilih,
      nama,
    },
  };
}
