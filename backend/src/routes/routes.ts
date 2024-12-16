import { Router } from "express";
import usersRouter from "./empleados.routes";
import authRouter from "./auth.routes";
import camionesRouter from "./camiones.routes";

const router = Router();

router.get("", (_req, res) => {
  res.send("Ruta default");
});

// ROUTES
router.use("/auth", authRouter);
router.use("/empleados", usersRouter);
router.use("/camiones", camionesRouter);

export default router;
