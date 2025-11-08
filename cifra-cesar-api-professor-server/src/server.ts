import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const alphabet = "abcdefghijklmnopqrstuvwxyz";

function cifrar(text: string, deslocamento: number): string {
  return text
    .toLowerCase()
    .split("")
    .map((ch) => {
      if (ch === " ") return " ";
      const index = alphabet.indexOf(ch);
      if (index === -1) return ch;
      return alphabet[(index + deslocamento) % alphabet.length];
    })
    .join("");
}

function decifrar(text: string, deslocamento: number): string {
  return text
    .toLowerCase()
    .split("")
    .map((ch) => {
      if (ch === " ") return " ";
      const index = alphabet.indexOf(ch);
      if (index === -1) return ch;
      return alphabet[(index - deslocamento + alphabet.length) % alphabet.length];
    })
    .join("");
}

app.post("/cifrar", (req: Request, res: Response) => {
  const { textoClaro, deslocamento } = req.body;

  if (!textoClaro || typeof deslocamento !== "number") {
    return res.status(400).json({ error: "Requisição inválida" });
  }

  const textoCifrado = cifrar(textoClaro, deslocamento);
  return res.json({ textoCifrado });
});

app.post("/decifrar", (req: Request, res: Response) => {
  const { textoCifrado, deslocamento } = req.body;

  if (!textoCifrado || typeof deslocamento !== "number") {
    return res.status(400).json({ error: "Requisição inválida" });
  }

  const textoClaro = decifrar(textoCifrado, deslocamento);
  return res.json({ textoClaro });
});

app.post("/decifrarForcaBruta", (req: Request, res: Response) => {
  const { textoCifrado } = req.body;

  if (!textoCifrado) {
    return res.status(400).json({ error: "Requisição inválida" });
  }

  const tentativas: { deslocamento: number; textoClaro: string }[] = [];
  for (let i = 1; i < alphabet.length; i++) {
    tentativas.push({
      deslocamento: i,
      textoClaro: decifrar(textoCifrado, i),
    });
  }

  return res.json({
    textoClaro: tentativas[0].textoClaro,
    tentativas,
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Mock Cifra de César API running at http://localhost:${PORT}`);
});
