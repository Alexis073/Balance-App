import { Router } from "express";
import {
  getAllempleados,
  upgradeEmpleadoById,
  deleteEmpleado,
} from "../controllers/empleados.controller";

const usersRouter = Router();

usersRouter.get("/", getAllempleados);
usersRouter.put("/:id", upgradeEmpleadoById);
usersRouter.delete("/:id", deleteEmpleado);

export default usersRouter;
