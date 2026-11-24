const lista = document.querySelector('#mensagens');
const formulario = document.querySelector('#formulario');
const aviso = document.querySelector('#aviso');
const conexao = document.querySelector('#conexao');
const enviar = document.querySelector('#enviar');
const nome = document.querySelector('#usuario');
const texto = document.querySelector('#texto');

async function atualizarMensagens() {
  try {
    const resposta = await fetch('/mensagens', { cache: 'no-store' });
    if (!resposta.ok) throw new Error('Não foi possível carregar mensagens.');
    const mensagens = await resposta.json();
    lista.replaceChildren();
    for (const mensagem of mensagens) {
      const li = document.createElement('li');
      const meta = document.createElement('div');
      meta.className = 'meta';
      const usuario = document.createElement('strong');
      usuario.textContent = mensagem.usuario;
      const hora = document.createElement('time');
      hora.textContent = mensagem.data ? new Date(mensagem.data).toLocaleString('pt-BR') : '';
      meta.append(usuario, hora);
      const conteudo = document.createElement('div');
      conteudo.className = 'texto';
      conteudo.textContent = mensagem.texto;
      li.append(meta, conteudo);
      lista.append(li);
    }
    conexao.textContent = `Online • ${mensagens.length} mensagens`;
  } catch (erro) {
    conexao.textContent = 'Conexão indisponível';
    aviso.textContent = erro.message;
  }
}
formulario.addEventListener('submit', async evento => {
  evento.preventDefault();
  enviar.disabled = true;
  try {
    const resposta = await fetch('/mensagens', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario: nome.value, texto: texto.value })});
    const dados = await resposta.json();
    if (!resposta.ok) throw new Error(dados.erro ?? 'Falha ao enviar.');
    texto.value = '';
    aviso.textContent = 'Mensagem enviada!';
    await atualizarMensagens();
  } catch (erro) { aviso.textContent = erro.message; }
  finally { enviar.disabled = false; }
});
await atualizarMensagens();
setInterval(atualizarMensagens, 3000);

// =========================================================================
// SELEÇÃO DE ELEMENTOS DA TELA
// =========================================================================
const lista = document.querySelector("#lista");
const aviso = document.querySelector("#aviso");

const form = document.querySelector("#form") || document.querySelector("#formulario");

// =========================================================================
// BUSCAR MENSAGENS E LISTAR NO MEIO DA TELA
// =========================================================================
async function carregarMensagens() {
  try {
    const resposta = await fetch("/mensagens");
    if (!resposta.ok) throw new Error("Falha ao carregar mensagens");
    
    const mensagens = await resposta.json();

    lista.replaceChildren();

    if (mensagens.length === 0) {
      const itemVazio = document.createElement("li");
      itemVazio.textContent = "Nenhuma mensagem enviada ainda. Seja o primeiro!";
      itemVazio.style.textAlign = "center";
      itemVazio.style.color = "#888";
      lista.append(itemVazio);
      return;
    }

    for (const mensagem of mensagens) {
      const item = document.createElement("li");

      const autor = document.createElement("strong");
      autor.textContent = mensagem.usuario + ": ";

      const texto = document.createTextNode(mensagem.texto);

      item.append(autor, texto);

      lista.append(item);
    }
  } catch (erro) {
    aviso.textContent = erro.message;
  }
}

// =========================================================================
// ENVIO DO FORMULÁRIO PARA O SERVIDOR
// =========================================================================
form.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  try {
    const campoUsuario = document.querySelector("#usuario");
    const campoTexto = document.querySelector("#texto");

    const usuario = campoUsuario.value;
    const texto = campoTexto.value;

    const resposta = await fetch("/mensagens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, texto })
    });

    const dados = await resposta.json();
    if (!resposta.ok) throw new Error(dados.erro ?? "Erro ao enviar");

    campoTexto.value = "";
    aviso.textContent = "Mensagem enviada com sucesso!";

    await carregarMensagens();
  } catch (erro) {
    aviso.textContent = erro.message;
  }
});

carregarMensagens();

setInterval(carregarMensagens, 3000);