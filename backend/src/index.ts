import app from "./app";
import dotenv from "dotenv";
import { db } from "./config/db";

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    const result = await db.query("SELECT NOW()");
    console.log("Database connected at:", result.rows[0].now);

    console.log("Starting server...");
    app.listen(PORT, () => {
      console.log(
        `Servidor corriendo en el puerto ${PORT}, http://localhost:${PORT}/api`
      );
    });
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

startServer();
