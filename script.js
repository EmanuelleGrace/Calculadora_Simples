// Seleção dos elementos
const display = document.getElementById("displayInput")
const botaoIgual = document.querySelectorAll(".igual")
const botaoPonto = document.querySelector(".ponto")
const botoesNumeros = document.querySelectorAll(".num")
const botoesOperadoes = document.querySelectorAll(".operador")
const botaoLimpa = document.querySelectorAll(".limpa")





//Variaveis globais
let operacaoAtual = ""; // Oque está sendo executado no momento
let operador = null; // Operadores (=, -, /, ., %)
let valorAnterior = ""; //Oque foi calculado antes
let calculando = false; // Para vê se está executando alguma operação na calculadora
let add = null //(, )

//Funções
//Essa função vai atualizar o display sempre que ela for chamada
function atualizaDisplay () {
    display.value = operacaoAtual
}


//Essa função vai resetar a operação que estiver ocorrendo na calculadora e limpar o display

function LimpaOperacao() {
        operacaoAtual = " ", operador = null, valorAnterior = 0, calculando = false;
        console.log("Operação resetada!")
        atualizaDisplay()
}

//Essa função vai inserir um número e tornar a variavel calculando = false para que possa ser incluido o operador e dar seguimento na operação

function insereNumero(evento)  {
        if (calculando) {
        operacaoAtual = eveneto.target.textContent;
        calculando = false;
    } else {
        operacaoAtual += evento.target.textContent;
    }

    atualizaDisplay();
}

//Essa função vai consultar se existe algum ponto "." na operação e caso não tenha irá adicionar um e atualizar o display

function inserePonto (){
    if(operacaoAtual.indexOf(".") === -1){ //indexOf vai procurar se tem algo com um "." na string 
        operacaoAtual += "."
    }
    atualizaDisplay ()
}

//Essa função vai fazer algumas verificações na operação e inserir os operadores e em seguinda tornar a variavel calculando = false para que possa ser incluido o proximo numero e a operação continue  

function insereOperador(evento) {
        if (operacaoAtual !== "") { //verifica se a operação atual é diferente de vazia
            if(!calculando){ //verifica se o calculando é false
                if(operador !== null){ //verifica se o operador não é null
                    calcula()

                }
                valorAnterior = operacaoAtual
                operacaoAtual = " "
                calculando = false
                atualizaDisplay()
                
        }
        operador = evento.target.textContent
    
    } 
}


//Essa função vai pegar os dados fornecidos nas varivaeis globais e transformarlos no tipo de dado numero para que possam ser calculados de acordo com cada variação de operador

function calcula() {
    
    let resultado = null;
    const operandoAnterior = parseFloat(valorAnterior)   //Numero salvo na memoria -- todos esses dados pegos de input vem como texto então usamos loat para converter para numero e preservar numero apos a virgula
    const operandoAtual = parseFloat(operacaoAtual)
    

    switch(operador){
        case "+": 
        resultado = eval(operandoAnterior + operandoAtual)
        break
        case "-":
        resultado = eval(operandoAnterior - operandoAtual)
        break
        case "*": 
        resultado = eval(operandoAnterior * operandoAtual)
        break
        case "/": 
        resultado = eval(operandoAnterior / operandoAtual)
        break
        case "%": 
        resultado = eval(operandoAnterior * operandoAtual) / 100
        break

    }
    operacaoAtual = resultado.toString()
    valorAnterior = operacaoAtual
    calculando = true       
    atualizaDisplay()
console.log(operandoAnterior, operacaoAtual, operador)
}



//Eventos 

//Esses eventos irão permitir a adição de função em cada botão criado 

botoesNumeros.forEach(botao => {
    botao.addEventListener("click", insereNumero)  
});

botaoPonto.addEventListener("click", inserePonto)


botoesOperadoes.forEach(botao => {
    botao.addEventListener("click", insereOperador)
})

botaoIgual.forEach(botao => {
botao.addEventListener("click", calcula)
})

botaoLimpa.forEach(botao => {
    botao.addEventListener("click", LimpaOperacao)
})




