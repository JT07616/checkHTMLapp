import express from "express";
import cors from "cors";
import urlsRoutes from "./routes/urls.js";
import checksRoutes from "./routes/checks.js";

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3000;

//Početna ruta
app.get("/", (req, res) => {
  res.send("CheckHTML backend running");
});

// Rute
app.use("/urls", urlsRoutes);
app.use("/checks", checksRoutes);

//Pokretanje poslužitelja
app.listen(PORT, (error) => {
  if (error) {
    console.error(`Greška prilikom pokretanja poslužitelja: ${error.message}`);
  } else {
    console.log(`Server je pokrenut na http://localhost:${PORT}`);
  }
});
