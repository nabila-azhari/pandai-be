import { Router } from "express";
import v1Routes from "./v1";

const router = Router();

// TERUSKAN SEMUA REQUEST KE v1
router.use(v1Routes);

export default router;
