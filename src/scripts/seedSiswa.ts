import { seedSiswa } from "../controllers/siswa/seed";

seedSiswa()
  .then(() => {
    console.log("✅ Seed siswa BERHASIL");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Seed siswa GAGAL", err);
    process.exit(1);
  });
