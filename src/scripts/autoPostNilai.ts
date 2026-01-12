import SiswaService from "../controllers/siswa/service";
import { MATERI_BAB } from "../controllers/siswa/constant";

function randomNilai(min = 60, max = 100) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function autoPostNilaiAllBab() {
  const siswaNis = Array.from(
    { length: 30 },
    (_, i) => `2024${String(i + 1).padStart(2, "0")}`
  );

  console.log("Mulai input nilai SEMUA BAB...");

  for (const nis of siswaNis) {
    for (const bab of MATERI_BAB) {
      // quiz
      await SiswaService.storeNilai(nis, bab.bab, randomNilai(), "quiz");

      // minigame
      await SiswaService.storeNilai(nis, bab.bab, randomNilai(), "minigame");
    }

    console.log(`✅ Semua nilai diinput untuk NIS ${nis}`);
  }

  console.log("🎉 SEMUA NILAI SEMUA BAB BERHASIL DIINPUT");
}

autoPostNilaiAllBab()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
