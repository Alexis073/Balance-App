import { Router } from "express";
import {
  getAllCamiones,
  addCamion,
  upgradeCamion,
  deleteCamion,
} from "../controllers/camiones.controller";

const camionesRouter = Router();

camionesRouter.get("/", getAllCamiones);
camionesRouter.post("/", addCamion);
camionesRouter.put("/:id", upgradeCamion);
camionesRouter.delete("/:id", deleteCamion);

export default camionesRouter;
