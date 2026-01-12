import { Request, Response } from "express";
import asyncHandler from "../../modules/AsyncHandler";
import siswaService from "./service";

export const getDaftarSiswa = asyncHandler(
  async (_: Request, res: Response) => {
    const result = await siswaService.getAll();
    res.status(result.statusCode).json(result);
  }
);

export const getDetailSiswa = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await siswaService.getDetailByNis(req.query.nis as string);
    res.status(result.statusCode).json(result);
  }
);

export const regisNilaiQuiz = asyncHandler(
  async (req: Request, res: Response) => {
    const { nis, bab, nilai } = req.query;
    const result = await siswaService.storeNilai(
      nis as string,
      Number(bab),
      Number(nilai),
      "quiz"
    );
    res.status(result.statusCode).json(result);
  }
);

export const regisNilaiMinigame = asyncHandler(
  async (req: Request, res: Response) => {
    const { nis, bab, nilai } = req.query;
    const result = await siswaService.storeNilai(
      nis as string,
      Number(bab),
      Number(nilai),
      "minigame"
    );
    res.status(result.statusCode).json(result);
  }
);

export const getNilaiSiswa = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await siswaService.getNilai(
      req.query.bab ? Number(req.query.bab) : undefined
    );
    res.status(result.statusCode).json(result);
  }
);

export const mustEvaluate = asyncHandler(async (_: Request, res: Response) => {
  const result = await siswaService.mustEvaluate();
  res.status(result.statusCode).json(result);
});
