import test from "node:test";
import assert from "node:assert/strict";
import {
  SCRIPT_URL,
  dataAnggota,
  COASTAL_CONFETTI_COLORS,
  getFeedbackEffect,
  getInitials,
  getOfficerIdCode,
  formatTanggalIndonesia,
  formatJamDigital,
  validateAndBuildPayload,
} from "./attendanceLogic";

test("dataAnggota and SCRIPT_URL preserve exact backend contract", () => {
  assert.ok(SCRIPT_URL.startsWith("https://script.google.com/macros/s/"));
  assert.deepEqual(dataAnggota["Grup A"], ["Bang Jeje", "Rian", "Dika", "Fajar"]);
  assert.deepEqual(dataAnggota["Grup B"], ["Ilham", "Reza", "Budi", "Wahyu Pulo"]);
});

test("getInitials computes 2-letter initials accurately", () => {
  assert.equal(getInitials(""), "AP");
  assert.equal(getInitials("Bang Jeje"), "BJ");
  assert.equal(getInitials("Wahyu Pulo"), "WP");
  assert.equal(getInitials("Rian"), "RI");
  assert.equal(getInitials("Dika"), "DI");
});

test("getOfficerIdCode produces deterministic badge IDs", () => {
  assert.equal(getOfficerIdCode("", ""), "POSKO-MERAK-00");
  assert.equal(getOfficerIdCode("Grup A", "Bang Jeje"), "AP-GA-202601");
  assert.equal(getOfficerIdCode("Grup B", "Wahyu Pulo"), "AP-GB-202604");
});

test("formatTanggalIndonesia and formatJamDigital format dates cleanly", () => {
  const sample = new Date(2026, 10, 3, 7, 58, 55); // Nov 3, 2026 07:58:55
  assert.equal(formatTanggalIndonesia(sample), "Selasa, 3 Nov 2026");
  assert.equal(formatJamDigital(sample), "07:58:55");
});

test("validateAndBuildPayload validates inputs and constructs exact JSON structure", () => {
  const missing = validateAndBuildPayload("", "");
  assert.equal(missing.valid, false);

  const valid = validateAndBuildPayload("Grup A", "Bang Jeje");
  assert.equal(valid.valid, true);
  if (valid.valid) {
    assert.deepEqual(valid.payload, {
      tipe: "absensi",
      grup: "Grup A",
      nama: "Bang Jeje",
    });
  }
});

test("getFeedbackEffect returns confetti and card animation config for attendance outcomes", () => {
  assert.ok(COASTAL_CONFETTI_COLORS.includes("#0D9488"));
  assert.ok(COASTAL_CONFETTI_COLORS.includes("#FF6B4A"));

  const successEffect = getFeedbackEffect("berhasil");
  assert.equal(successEffect.triggerConfetti, true);
  assert.equal(successEffect.cardAnimationClass, "animate-card-success");
  assert.ok(successEffect.confettiParticleCount >= 50);

  const alreadyEffect = getFeedbackEffect("sudah_absen");
  assert.equal(alreadyEffect.triggerConfetti, true);
  assert.equal(alreadyEffect.cardAnimationClass, "animate-card-pulse");

  const validationEffect = getFeedbackEffect("validasi_gagal");
  assert.equal(validationEffect.triggerConfetti, false);
  assert.equal(validationEffect.cardAnimationClass, "animate-card-shake");
});
