function textToBinary(text) {
  return text
    .split("")
    .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
    .join("");
}

function binaryToText(binary) {
  const bytes = binary.match(/.{1,8}/g);
  return bytes.map((b) => String.fromCharCode(parseInt(b, 2))).join("");
}

export function cifrarVernam(textoClaro, chave) {
  if (chave.length < textoClaro.length)
    throw new Error("A chave deve ter pelo menos o mesmo tamanho que o texto claro.");

  let binTexto = textToBinary(textoClaro);
  let binChave = textToBinary(chave.slice(0, textoClaro.length));

  let resultado = "";
  for (let i = 0; i < binTexto.length; i++) {
    resultado += binTexto[i] === binChave[i] ? "0" : "1";
  }

  return resultado;
}

export function decifrarVernam(textoCifrado, chave) {
  const binChave = textToBinary(chave).slice(0, textoCifrado.length);

  let resultado = "";
  for (let i = 0; i < textoCifrado.length; i++) {
    resultado += textoCifrado[i] === binChave[i] ? "0" : "1";
  }

  return binaryToText(resultado);
}
