"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
const alphabet = "abcdefghijklmnopqrstuvwxyz";
function cifrar(text, deslocamento) {
    return text
        .toLowerCase()
        .split("")
        .map((ch) => {
        if (ch === " ")
            return " ";
        const index = alphabet.indexOf(ch);
        if (index === -1)
            return ch;
        return alphabet[(index + deslocamento) % alphabet.length];
    })
        .join("");
}
function decifrar(text, deslocamento) {
    return text
        .toLowerCase()
        .split("")
        .map((ch) => {
        if (ch === " ")
            return " ";
        const index = alphabet.indexOf(ch);
        if (index === -1)
            return ch;
        return alphabet[(index - deslocamento + alphabet.length) % alphabet.length];
    })
        .join("");
}
app.post("/cifrar", (req, res) => {
    const { textoClaro, deslocamento } = req.body;
    if (!textoClaro || typeof deslocamento !== "number") {
        return res.status(400).json({ error: "Requisição inválida" });
    }
    const textoCifrado = cifrar(textoClaro, deslocamento);
    return res.json({ textoCifrado });
});
app.post("/decifrar", (req, res) => {
    const { textoCifrado, deslocamento } = req.body;
    if (!textoCifrado || typeof deslocamento !== "number") {
        return res.status(400).json({ error: "Requisição inválida" });
    }
    const textoClaro = decifrar(textoCifrado, deslocamento);
    return res.json({ textoClaro });
});
app.post("/decifrarForcaBruta", (req, res) => {
    const { textoCifrado } = req.body;
    if (!textoCifrado) {
        return res.status(400).json({ error: "Requisição inválida" });
    }
    const tentativas = [];
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
