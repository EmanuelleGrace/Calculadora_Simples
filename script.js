// Seleção dos elementos
const display = /** @type {HTMLInputElement} */ (document.getElementById("displayInput"));
const displayHistorico = document.createElement('div');
displayHistorico.id = 'displayHistorico';
displayHistorico.className = 'historico';

// Adiciona o histórico ao display se o elemento pai existir
const displayContainer = document.getElementById('display');
if (displayContainer) {
    displayContainer.prepend(displayHistorico);
}

const botaoIgual = document.querySelectorAll(".igual");
const botaoPonto = document.querySelector(".ponto");
const botoesNumeros = document.querySelectorAll(".num");
const botoesOperadores = document.querySelectorAll(".operador");
const botaoLimpa = document.querySelectorAll(".limpa");

// Verifica se os elementos foram encontrados
if (!display) {
    console.error("Elemento do display não encontrado!");
}

// Variáveis globais
let operacaoAtual = ""; // O que está sendo executado no momento
let operador = null; // Operadores (+, -, *, /, %)
let valorAnterior = ""; // O que foi calculado antes
let calculando = false; // Para verificar se está executando alguma operação na calculadora
let historico = []; // Histórico de operações
let temResultado = false; // Indica se acabou de calcular um resultado

// Funções

/**
 * Atualiza o valor mostrado no display da calculadora e o histórico
 */
function atualizaDisplay() {
    if (display) {
        display.value = operacaoAtual || '0';
    }
    
    // Atualiza o histórico no display
    if (displayHistorico) {
        if (valorAnterior && operador) {
            displayHistorico.textContent = `${valorAnterior} ${operador}`;
        } else {
            displayHistorico.textContent = '';
        }
    }
}


/**
 * Reseta a operação que estiver ocorrendo na calculadora e limpa o display
 */
function limpaOperacao() {
    operacaoAtual = "";
    operador = null;
    valorAnterior = "";
    calculando = false;
    temResultado = false;
    atualizaDisplay();
    
    // Adiciona efeito visual de feedback
    if (display) {
        display.classList.add('limpo');
        setTimeout(() => {
            display.classList.remove('limpo');
        }, 150);
    }
}

/**
 * Insere um número no display e prepara para a próxima operação
 * @param {Event} evento - O evento de clique do botão
 */
function insereNumero(evento) {
    // Garante que o evento tenha um target válido e que seja um elemento HTML
    const target = evento.target;
    if (!target || !(target instanceof HTMLElement)) return;
    
    const numero = target.textContent;
    if (numero === null) return;
    
    // Se acabou de calcular um resultado, limpa tudo ao inserir novo número
    if (temResultado) {
        limpaOperacao();
        temResultado = false;
    }
    
    if (calculando) {
        operacaoAtual = numero;
        calculando = false;
    } else {
        // Limita o tamanho do número para evitar overflow
        if (operacaoAtual.length < 12) {
            operacaoAtual += numero;
        }
    }
    
    // Adiciona efeito visual de feedback
    target.classList.add('ativo');
    setTimeout(() => {
        target.classList.remove('ativo');
    }, 150);
    
    atualizaDisplay();
}

/**
 * Insere um ponto decimal se ainda não existir um na operação atual
 */
function inserePonto() {
    // Se acabou de calcular um resultado, limpa tudo ao inserir ponto
    if (temResultado) {
        limpaOperacao();
        operacaoAtual = "0";
        temResultado = false;
    }
    
    // Se a operação atual estiver vazia, adiciona um zero antes do ponto
    if (operacaoAtual === "" || operacaoAtual === " ") {
        operacaoAtual = "0";
    }
    
    // Verifica se já existe um ponto na operação atual
    if (operacaoAtual.indexOf(".") === -1) {
        operacaoAtual += ".";
    }
    
    // Adiciona efeito visual de feedback
    if (botaoPonto && botaoPonto instanceof HTMLElement) {
        botaoPonto.classList.add('ativo');
        setTimeout(() => {
            botaoPonto.classList.remove('ativo');
        }, 150);
    }
    
    atualizaDisplay();
}

/**
 * Insere um operador e realiza cálculos em cadeia quando necessário
 * @param {Event} evento - O evento de clique do botão
 */
function insereOperador(evento) {
    // Garante que o evento tenha um target válido e que seja um elemento HTML
    const target = evento.target;
    if (!target || !(target instanceof HTMLElement)) return;
    
    const op = target.textContent;
    if (op === null) return;
    
    // Adiciona efeito visual de feedback
    target.classList.add('ativo');
    setTimeout(() => {
        target.classList.remove('ativo');
    }, 150);
    
    // Se acabou de calcular um resultado, usa o resultado para a próxima operação
    if (temResultado) {
        temResultado = false;
    }
    
    // Só insere operador se houver um número para operar
    if (operacaoAtual !== "" && operacaoAtual !== " ") {
        // Se já estiver calculando com um operador anterior, realiza o cálculo primeiro
        if (operador !== null && !calculando) {
            calcula(false); // Não finaliza a operação, continua a cadeia
        }
        
        // Guarda o valor atual e prepara para o próximo número
        valorAnterior = operacaoAtual;
        operacaoAtual = "";
        calculando = false;
        
        // Define o novo operador
        operador = op;
    } else if (valorAnterior !== "" && valorAnterior !== " ") {
        // Permite trocar o operador se já tiver um valor anterior
        operador = op;
    } else if (operacaoAtual === "" && op === "-") {
        // Permite números negativos
        operacaoAtual = "-";
    }
    
    atualizaDisplay();
}


/**
 * Realiza o cálculo com base no operador e nos valores fornecidos
 * @param {boolean} finalizar - Se true, finaliza a operação e marca como resultado
 */
function calcula(finalizar = true) {
    // Só calcula se tiver todos os valores necessários
    if (operacaoAtual === "" || valorAnterior === "" || operador === null) {
        return;
    }
    
    let resultado = null;
    const operandoAnterior = parseFloat(valorAnterior);
    const operandoAtual = parseFloat(operacaoAtual);
    
    // Verifica se os operandos são números válidos
    if (isNaN(operandoAnterior) || isNaN(operandoAtual)) {
        operacaoAtual = "Erro";
        atualizaDisplay();
        return;
    }
    
    // Formata a operação para o histórico
    const operacaoFormatada = `${valorAnterior} ${operador} ${operacaoAtual}`;
    
    // Realiza o cálculo baseado no operador
    switch(operador) {
        case "+": 
            resultado = operandoAnterior + operandoAtual;
            break;
        case "-":
            resultado = operandoAnterior - operandoAtual;
            break;
        case "*": 
            resultado = operandoAnterior * operandoAtual;
            break;
        case "/": 
            // Verifica divisão por zero
            if (operandoAtual === 0) {
                operacaoAtual = "Erro";
                atualizaDisplay();
                return;
            }
            resultado = operandoAnterior / operandoAtual;
            break;
        case "%": 
            resultado = (operandoAnterior * operandoAtual) / 100;
            break;
        default:
            return;
    }
    
    // Formata o resultado para evitar números muito longos
    if (resultado.toString().length > 10) {
        resultado = parseFloat(resultado.toFixed(8));
    }
    
    // Adiciona a operação ao histórico se for finalizada
    if (finalizar && historico.length < 10) { // Limita o histórico a 10 itens
        historico.push({
            operacao: operacaoFormatada,
            resultado: resultado.toString()
        });
        // Atualiza a exibição do histórico imediatamente
        atualizaHistorico();
    }
    
    // Adiciona efeito visual de feedback se for finalizada
    if (finalizar && botaoIgual.length > 0) {
        const botao = botaoIgual[0];
        if (botao instanceof HTMLElement) {
            botao.classList.add('ativo');
            setTimeout(() => {
                botao.classList.remove('ativo');
            }, 150);
        }
    }
    
    operacaoAtual = resultado.toString();
    valorAnterior = operacaoAtual;
    calculando = true;
    temResultado = finalizar; // Marca como resultado apenas se for finalizada
    atualizaDisplay();
}



/**
 * Função auxiliar para criar um evento sintético para simulação de cliques
 * @param {string} valor - O valor a ser inserido
 * @returns {Event} Um evento sintético com as propriedades necessárias
 */
function criarEventoSintetico(valor) {
    // Cria um elemento temporário para usar como target
    const elemento = document.createElement('button');
    elemento.textContent = valor;
    
    // Cria um evento de mouse básico
    const evento = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
    });
    
    // Define o target do evento como o elemento criado
    Object.defineProperty(evento, 'target', {
        writable: false,
        value: elemento
    });
    
    return evento;
}

// Adiciona suporte a teclado
document.addEventListener("keydown", function(evento) {
    // Números de 0-9
    if (/^[0-9]$/.test(evento.key)) {
        evento.preventDefault();
        insereNumero(criarEventoSintetico(evento.key));
    }
    
    // Operadores
    if (['+', '-', '*', '/', '%'].includes(evento.key)) {
        evento.preventDefault();
        insereOperador(criarEventoSintetico(evento.key));
    }
    
    // Ponto decimal
    if (evento.key === '.' || evento.key === ',') {
        evento.preventDefault();
        inserePonto();
    }
    
    // Enter ou = para calcular
    if (evento.key === 'Enter' || evento.key === '=') {
        evento.preventDefault();
        calcula(true);
        // Garante que o histórico seja atualizado
        atualizaHistorico();
    }
    
    // Escape, Delete ou Backspace para limpar
    if (evento.key === 'Escape' || evento.key === 'Delete' || evento.key === 'Backspace') {
        evento.preventDefault();
        limpaOperacao();
    }
});

// Eventos para os botões
if (botoesNumeros.length > 0) {
    botoesNumeros.forEach(botao => {
        botao.addEventListener("click", insereNumero);
    });
} else {
    console.error("Botões de números não encontrados!");
}

// Adiciona evento ao botão de ponto decimal se ele existir
if (botaoPonto) {
    botaoPonto.addEventListener("click", inserePonto);
} else {
    console.error("Botão de ponto decimal não encontrado!");
}

// Adiciona eventos aos botões de operadores
if (botoesOperadores.length > 0) {
    botoesOperadores.forEach(botao => {
        botao.addEventListener("click", insereOperador);
    });
} else {
    console.error("Botões de operadores não encontrados!");
}

// Adiciona eventos aos botões de igual
if (botaoIgual.length > 0) {
    botaoIgual.forEach(botao => {
        botao.addEventListener("click", () => {
            calcula(true);
            // Garante que o histórico seja atualizado
            atualizaHistorico();
        });
    });
} else {
    console.error("Botão de igual não encontrado!");
}

// Adiciona eventos aos botões de limpar
if (botaoLimpa.length > 0) {
    botaoLimpa.forEach(botao => {
        botao.addEventListener("click", limpaOperacao);
    });
} else {
    console.error("Botão de limpar não encontrado!");
}

// Adiciona funcionalidade ao histórico
const historicoLista = document.getElementById('historico-lista');
const limparHistoricoBtn = document.getElementById('limpar-historico');

/**
 * Atualiza a exibição do histórico na interface
 */
function atualizaHistorico() {
    if (!historicoLista) return;
    
    // Limpa o histórico atual
    historicoLista.innerHTML = '';
    
    // Se não houver itens no histórico, mostra uma mensagem
    if (historico.length === 0) {
        const mensagem = document.createElement('div');
        mensagem.className = 'historico-vazio';
        mensagem.textContent = 'Nenhum cálculo realizado ainda.';
        historicoLista.appendChild(mensagem);
        return;
    }
    
    // Adiciona cada item do histórico em ordem reversa (mais recente primeiro)
    historico.slice().reverse().forEach(item => {
        const historicoItem = document.createElement('div');
        historicoItem.className = 'historico-item';
        
        const operacao = document.createElement('div');
        operacao.className = 'historico-operacao';
        operacao.textContent = item.operacao;
        
        const resultado = document.createElement('div');
        resultado.className = 'historico-resultado';
        resultado.textContent = `= ${item.resultado}`;
        
        historicoItem.appendChild(operacao);
        historicoItem.appendChild(resultado);
        
        // Adiciona evento para clicar em um item do histórico e usá-lo
        historicoItem.addEventListener('click', () => {
            operacaoAtual = item.resultado;
            temResultado = true;
            atualizaDisplay();
        });
        
        historicoLista.appendChild(historicoItem);
    });
}

// Adiciona evento para limpar o histórico
if (limparHistoricoBtn) {
    limparHistoricoBtn.addEventListener('click', () => {
        historico = [];
        atualizaHistorico();
        
        // Efeito visual
        limparHistoricoBtn.classList.add('ativo');
        setTimeout(() => {
            limparHistoricoBtn.classList.remove('ativo');
        }, 150);
    });
}

// Inicializa o display e o histórico
atualizaDisplay();
atualizaHistorico();