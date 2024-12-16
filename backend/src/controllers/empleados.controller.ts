import { Request, Response } from "express";
import { db } from "../config/db";

export const getAllempleados = async (req: Request, res: Response) => {
  try {
    const results = await db.query("SELECT * FROM empleados");

    if (results.rows.length === 0) {
      res.status(400).json({ message: "No existen empleados." });
      return;
    }

    res.status(200).json(results.rows);
  } catch (error) {}
};

export const empleadoExistente = async (id: number): Promise<boolean> => {
  try {
    const results = await db.query("SELECT FROM empleados WHERE id = $1", [id]);

    if (results.rowCount === 0) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
};

export const upgradeEmpleadoById = async (req: Request, res: Response) => {
  try {
    const idUser = req.params.id;
    const { nombre, rol } = req.body;

    const user = empleadoExistente(Number(idUser));

    if (!user) {
      res.status(500).json({ message: "Usuario no encontrado." });
      return;
    }

    let query;
    if (nombre && rol) {
      query = await db.query(
        "UPDATE empleados SET nombre = $1, rol = $2 WHERE id = $3 RETURNING *",
        [nombre, rol, idUser]
      );
    } else if (nombre) {
      query = await db.query(
        "UPDATE empleados SET nombre = $1 WHERE id = $2 RETURNING *",
        [nombre, idUser]
      );
    } else if (rol) {
      query = await db.query(
        "UPDATE empleados SET rol = $1 WHERE id = $2 RETURNING *",
        [rol, idUser]
      );
    }

    const userActualizado = query?.rows[0];

    if (!userActualizado) {
      res.status(500).json({ message: "Error al actualizar el usuario." });
      return;
    }

    res
      .status(200)
      .json({ message: "Usuario actualizado.", user: userActualizado });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ message: "Error en el servidor." });
  }
};

export const deleteEmpleado = async (req: Request, res: Response) => {
  try {
    const idUser = req.params.id;

    const user = empleadoExistente(Number(idUser));

    if (!user) {
      res.status(500).json({ message: "Usuario no encontrado." });
      return;
    }

    await db.query("DELETE FROM empleados WHERE id = $1", [idUser]);

    res.status(200).json({
      message: "Usuario eliminado correctamente.",
    });
  } catch (error) {
    console.log("Error al eliminar el usuario:", error);
    res.status(500).json({ message: "Error en el servidor." });
  }
};
