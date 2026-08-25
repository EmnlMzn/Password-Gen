const campoSenha = document.querySelector('#campo-senha');
const quantidadeCaracteres = document.querySelector('#quantidade-caracteres');
const botaoDiminuir = document.querySelector('#diminuir-caracteres');
const botaoAumentar = document.querySelector('#aumentar-caracteres');
const nivelForca = document.querySelector('#nivel-forca');
const textoForca = document.querySelector('#texto-forca');
const opcoesCaracteristicas = document.querySelectorAll('.checkbox-caracteristica');

const TAMANHO_MINIMO = 4;
const TAMANHO_MAXIMO = 32;
const conjuntos = {
    maiusculas: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    minusculas: 'abcdefghijklmnopqrstuvwxyz',
    numeros: '0123456789',
    simbolos: '!@#$%&*+-_=.?',
};

let tamanhoSenha = 12;

function numeroAleatorio(maximo) {
    if (window.crypto && window.crypto.getRandomValues) {
        const limiteSeguro = Math.floor(0x100000000 / maximo) * maximo;
        const valores = new Uint32Array(1);
        let valor;

        do {
            window.crypto.getRandomValues(valores);
            valor = valores[0];
        } while (valor >= limiteSeguro);

        return valor % maximo;
    }

    return Math.floor(Math.random() * maximo);
}

function escolherCaracter(conjunto) {
    return conjunto[numeroAleatorio(conjunto.length)];
}

function embaralhar(lista) {
    for (let indice = lista.length - 1; indice > 0; indice -= 1) {
        const indiceAleatorio = numeroAleatorio(indice + 1);
        [lista[indice], lista[indiceAleatorio]] = [lista[indiceAleatorio], lista[indice]];
    }

    return lista;
}

function obterOpcoesSelecionadas() {
    return [...opcoesCaracteristicas]
        .filter((opcao) => opcao.checked)
        .map((opcao) => opcao.id);
}

function definirForca(numeroDeOpcoes, tamanho) {
    const pontos = numeroDeOpcoes + (tamanho >= 20 ? 1 : 0) + (tamanho >= 28 ? 1 : 0);

    if (pontos <= 2) {
        return {
            nome: 'Fraca',
            largura: '33.333%',
            cor: '#ef1834',
        };
    }

    if (pontos <= 4) {
        return {
            nome: 'Média',
            largura: '66.666%',
            cor: '#f5a623',
        };
    }

    return {
        nome: 'Forte',
        largura: '100%',
        cor: '#21c77a',
    };
}

function atualizarForca(numeroDeOpcoes, tamanho) {
    const forca = definirForca(numeroDeOpcoes, tamanho);

    nivelForca.style.width = forca.largura;
    nivelForca.style.backgroundColor = forca.cor;
    textoForca.textContent = forca.nome;
    textoForca.style.color = forca.cor;
    campoSenha.setAttribute('aria-label', `Senha gerada. Força ${forca.nome}`);
}

function gerarSenha() {
    const opcoesSelecionadas = obterOpcoesSelecionadas();

    if (opcoesSelecionadas.length === 0) {
        campoSenha.value = 'Selecione uma opção';
        campoSenha.classList.add('campo-invalido');
        nivelForca.style.width = '0';
        textoForca.textContent = '—';
        textoForca.style.color = '#ffffff';
        return;
    }

    campoSenha.classList.remove('campo-invalido');

    const caracteresDisponiveis = opcoesSelecionadas
        .map((opcao) => conjuntos[opcao])
        .join('');

    const senha = opcoesSelecionadas.map((opcao) => escolherCaracter(conjuntos[opcao]));

    while (senha.length < tamanhoSenha) {
        senha.push(escolherCaracter(caracteresDisponiveis));
    }

    campoSenha.value = embaralhar(senha).join('');
    atualizarForca(opcoesSelecionadas.length, tamanhoSenha);
}

function atualizarQuantidade(novaQuantidade) {
    tamanhoSenha = Math.min(TAMANHO_MAXIMO, Math.max(TAMANHO_MINIMO, novaQuantidade));
    quantidadeCaracteres.textContent = tamanhoSenha;
    botaoDiminuir.disabled = tamanhoSenha <= TAMANHO_MINIMO;
    botaoAumentar.disabled = tamanhoSenha >= TAMANHO_MAXIMO;
    gerarSenha();
}

botaoDiminuir.addEventListener('click', () => {
    atualizarQuantidade(tamanhoSenha - 1);
});

botaoAumentar.addEventListener('click', () => {
    atualizarQuantidade(tamanhoSenha + 1);
});

opcoesCaracteristicas.forEach((opcao) => {
    opcao.addEventListener('change', gerarSenha);
});

campoSenha.addEventListener('click', () => {
    if (!campoSenha.classList.contains('campo-invalido')) {
        campoSenha.select();
    }
});

atualizarQuantidade(tamanhoSenha);
