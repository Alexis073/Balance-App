import { Request, Response } from "express";
import { db } from "../config/db";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre, empresa_id } = req.body;

    const query = await db.query(
      "INSERT INTO empleados (nombre, empresa_id) VALUES ($1, $2) RETURNING *",
      [nombre, empresa_id]
    );

    if (query.rowCount === 0) {
      res.status(500).json({ message: "No se pudo crear el usuario." });
      return;
    }

    const newUser = query.rows[0];

    res
      .status(200)
      .json({ message: "Usuario creado correctamente.", user: newUser });
  } catch (error) {
    console.error("Error al crear el usuario:", error);
    res.status(500).json({ message: "Error al crear el usuario" });
  }
};
