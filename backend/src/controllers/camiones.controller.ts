import { Request, Response } from "express";
import { db } from "../config/db";
import { setDefaultHighWaterMark } from "stream";

export const getAllCamiones = async (req: Request, res: Response) => {
  try {
    const results = await db.query("SELECT * FROM camiones");

    if (results.rowCount === 0) {
      res.status(500).json({ message: "No hay camiones." });
      return;
    }

    res.status(200).json(results.rows);
  } catch (error) {}
};

const camionExistente = async (id: number): Promise<boolean> => {
  try {
    const result = await db.query("SELECT FROM camiones WHERE id = $1", [id]);

    if (result.rowCount === 0) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
};

export const addCamion = async (req: Request, res: Response) => {
  try {
    const { matricula, modelo } = req.body;

    const results = await db.query(
      "INSERT INTO camiones (matricula, modelo) VALUES ($1, $2) RETURNING *",
      [matricula, modelo]
    );

    if (results.rowCount === 0) {
      res.status(500).json({ message: "Error al agregar camion." });
      return;
    }

    res.status(200).json({
      message: "Camion agregado correctamente.",
      camion: results.rows[0],
    });
  } catch (error) {}
};

export const upgradeCamion = async (req: Request, res: Response) => {
  try {
    const idCamion = req.params.id;
    const { matricula, modelo } = req.body;

    const camion = camionExistente(Number(idCamion));

    if (!camion) {
      res.status(500).json({ message: "Camion no encontrado." });
      return;
    }

    let query;
    if (matricula && modelo) {
      query = await db.query(
        "UPDATE camiones SET matricula = $1, modelo = $2 WHERE id = $3 RETURNING *",
        [matricula, modelo, idCamion]
      );
    } else if (matricula) {
      query = await db.query(
        "UPDATE camiones SET matricula = $1 WHERE id = $2 RETURNING *",
        [matricula, idCamion]
      );
    } else if (modelo) {
      query = await db.query(
        "UPDATE camiones SET modelo = $1 WHERE id = $2 RETURNING *",
        [modelo, idCamion]
      );
    }

    if (!query?.rows[0]) {
      res
        .status(500)
        .json({ message: "Error al actualziar datos del camion." });
      return;
    }

    res.status(200).json({
      message: "Camion actualizado correctamente",
      camion: query?.rows[0],
    });
  } catch (error) {
    console.error("Error al actualizar el camion:", error);
    res.status(500).json({ message: "Error en el servidor." });
  }
};

export const deleteCamion = async (req: Request, res: Response) => {
  try {
    const idCamion = req.params.id;

    const camion = camionExistente(Number(idCamion));

    if (!camion) {
      res.status(500).json({ message: "Camion no encontrado" });
      return;
    }

    await db.query("DELETE FROM camiones WHERE id = $1", [idCamion]);

    res.status(200).json({
      message: "Camion eliminado correctamente.",
    });
  } catch (error) {
    console.log("Error al eliminar el camion.", error);
    res.status(500).json({ message: "Ocurrio un error en el servidor." });
  }
};
