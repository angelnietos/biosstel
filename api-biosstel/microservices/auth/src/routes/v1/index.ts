import { Router } from "express";
import endpoints from "./endpoints";

const router: Router = Router();
router.use("/auth", endpoints);
export default router;
