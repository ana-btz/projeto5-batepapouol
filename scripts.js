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
