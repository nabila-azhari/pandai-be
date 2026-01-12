import db from "../../config/firebase.config";
import { MATERI_BAB } from "./constant";
import { NAMA_SISWA } from "./namasiswa";
import bcrypt from "bcrypt";

export async function seedSiswa() {
  const batch = db.batch();
  const usersRef = db.collection("users");

  NAMA_SISWA.forEach((nama, index) => {
    const docRef = usersRef.doc();

    const nis = `2024${String(index + 1).padStart(2, "0")}`;

    batch.set(docRef, {
      fullname: nama,
      email: `siswa${index + 1}@mail.com`, // 🔑 EMAIL LOGIN
      password: bcrypt.hashSync("password123", 10), // 🔑 PASSWORD LOGIN
      nis,
      nisn: `00999${index + 1}`,
      role: "siswa",
      dataNilai: MATERI_BAB.map((bab) => ({
        bab: bab.bab,
        materi: bab.materi,
        nilaiQuiz: null,
        nilaiMinigame: null,
        nilaiTotal: 0,
      })),
      totalNilaiSemuaSemester: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  await batch.commit();
}
