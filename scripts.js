// PARA ENTRAR NA SALA

// para entrar na sala deve-se enviar ao servidor o nome do usuario
let nome = {};

function enviaNome() {
    // prompt que pergunta e armazena o nome do usuario:
    nome = { name: prompt("Como você gostaria de ser chamado?") };
    console.log(nome);

    // Após inserção do nome, este deve ser enviado para o servidor pra cadastrar o usuário

    // requisicao post para enviar o nome ao servidor:
    const request = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", nome);
    request.then(tratarSucesso); // se sucesso --> entrar na sala
    request.catch(tratarErro);
}
enviaNome();
atualizaNome();

// O servidor pode responder com status 400 se já houver um usuário online com esse nome
// Se for o caso, a aplicação deve pedir um novo nome até que o servidor responda com status 200

function tratarErro(erro) {
    const statusCode = erro.response.status;
    console.log(statusCode);

    if (statusCode === 400) {
        alert("Desculpe, mas esse nome já está em uso =/");
        enviaNome();
    }
}

function tratarSucesso(resposta) {
    alert(`Bem-vindo(a) ${nome.name} :)`);
    const statusCode = resposta.status;
    console.log(statusCode);
}

// PARA MANTER CONEXAO

// Enquanto o usuário estiver na sala, a cada 5 segundos o site deve avisar ao servidor que o usuário
// ainda está presente, ou senão será considerado que "Saiu da sala"
function reEnviaNome() {
    axios.post("https://mock-api.driven.com.br/api/v6/uol/status", nome);
    console.log("o nome chegou");
}

function atualizaNome() {
    setInterval(reEnviaNome, 5000);
}

// PARA BUSCAR MENSAGENS DO SERVIDOR

function buscaMensagens() {
    // requisicao get para buscar mensagens do servidor
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promise.then(processarResposta);
}

buscaMensagens();

function processarResposta(resposta) {
    console.log("Os dados do servidor chegaram");
    console.log(resposta);
    console.log(resposta.data);

    const dadosMensagens = resposta.data;

    renderizarMensagens(dadosMensagens);
}

function renderizarMensagens(dadosMensagens) {
    const elemento_ul = document.querySelector("ul");
    console.log(elemento_ul);

    elemento_ul.innerHTML = "";

    for (let i = 0; i < dadosMensagens.length; i++) {
        const hora = dadosMensagens[i].time,
            usuario = dadosMensagens[i].from,
            destinatario = dadosMensagens[i].to,
            texto = dadosMensagens[i].text;

        let mensagem = "";

        if (dadosMensagens[i].type === "status") {
            mensagem = `
                <li class="mensagens status">
                    <span class="hora-da-postagem">${hora}</span>
                    <span class="user">${usuario}</span>
                    <span class="mensagem">${texto}</span>
                </li>
            `
            elemento_ul.innerHTML += mensagem;

            const elemento_li = document.querySelector("li");
            elemento_li.scrollIntoView(false);
        }

        if (dadosMensagens[i].type === "message") {
            mensagem = `
                <li class="mensagens normal">
                    <span class="hora-da-postagem">${hora}</span>
                    <span class="user">${usuario}</span>
                    <span class="mensagem">para</span>
                    <span class="user">${destinatario}:</span>
                    <span class="mensagem">${texto}</span>
                </li>
            `
            elemento_ul.innerHTML += mensagem;

            const elemento_li = document.querySelector("li");
            elemento_li.scrollIntoView(false);
        }

        if ((dadosMensagens[i].type === "private_message") && (dadosMensagens[i].destinatario === nome.name)) {
            mensagem = `
                <li class="mensagens reservada">
                    <span class="hora-da-postagem">${hora}</span>
                    <span class="user">${usuario}</span>
                    <span class="mensagem">reservadamente para</span>
                    <span class="user">${destinatario}:</span>
                    <span class="mensagem">${texto}</span>
                </li>
            `
            elemento_ul.innerHTML += mensagem;

            const elemento_li = document.querySelector("li");
            elemento_li.scrollIntoView(false);
        }
    }

    setInterval(buscaMensagens, 3000);
    // A cada 3 segundos o site deve recarregar as mensagens do servidor para manter sempre atualizado
}

// Ao enviar uma mensagem, esta deve ser enviada para o servidor
// Caso o servidor responda com sucesso, você deve obter novamente as mensagens do servidor e atualizar o chat
// Caso o servidor responda com erro, significa que esse usuário não está mais na sala e a página deve ser atualizada
// (e com isso voltando pra etapa de pedir o nome). Dica: experimente usar window.location.reload()

function enviaMensagem() {
    const userInput = document.querySelector("input").value;
    const infoUsuario = {
        from: nome.name,
        to: "Todos",
        text: userInput,
        type: "message"
    }
    const requisicao = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", infoUsuario);
    // requisicao.then(mostraMensagem);
    requisicao.catch(atualizaPagina);
}

function atualizaPagina() {
    window.location.reload();
}
