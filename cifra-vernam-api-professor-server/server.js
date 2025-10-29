import express from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { cifrarVernam, decifrarVernam } from "./vernam.js";

const app = express();
app.use(express.json());

// Load external YAML Swagger specification
const swaggerDocument = YAML.load("./cifra-vernam-api-spec.yaml");

// Swagger UI endpoint
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Cifrar endpoint
app.post("/cifrar", (req, res) => {
  const { textoClaro, chave } = req.body;
  if (!textoClaro || !chave) {
    return res.status(400).json({ error: "Parâmetros ausentes" });
  }

  try {
    const textoCifrado = cifrarVernam(textoClaro, chave);
    res.json({ textoCifrado });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Decifrar endpoint
app.post("/decifrar", (req, res) => {
  const { textoCifrado, chave } = req.body;
  if (!textoCifrado || !chave) {
    return res.status(400).json({ error: "Parâmetros ausentes" });
  }

  try {
    const textoClaro = decifrarVernam(textoCifrado, chave);
    res.json({ textoClaro });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

const PORT = 3000;
//OLDapp.listen(PORT, () => console.log(`✅ Servidor rodando em http://localhost:${PORT}/docs`));
const HOST = "0.0.0.0";
app.listen(PORT, HOST, () =>
  console.log(`✅ Servidor rodando em http://${HOST}:${PORT}/docs`)
);

