// =====================================================
// PALÁCIO MENTAL
// SCRIPT PRINCIPAL
// =====================================================



// =====================================================
// INICIALIZAÇÃO DO APLICATIVO
// =====================================================

document.addEventListener("DOMContentLoaded", () => {


    // =====================================================
    // TELA 01 — PORTAL DE ENTRADA
    // =====================================================

    /*
       Elementos principais da Tela 01.

       FUTURAMENTE:
       - voz "Bem-vindo, Senhor Natan";
       - efeito de raio;
       - flash de ativação;
       - transição para Tela 02.
    */

    const portalScreen =
        document.getElementById("portalScreen");

    const btnPortalEntrada =
        document.getElementById("btnPortalEntrada");

    // =====================================================
    // TELA 01 — ÁUDIO DO PORTAL
    // =====================================================

    const somPortal =
        new Audio(
            "assets/sounds/portal-entrada.mp3"
        );


    /*
       VOLUME DO SOM:
    
       0.30 = baixo
       0.50 = médio
       0.70 = atual
       1.00 = máximo
    */


    // =====================================================
    // TELA 01 — VOZ DE BOAS-VINDAS
    // =====================================================

    // =====================================================
    // TELA 01 — VOZ DE BOAS-VINDAS
    // =====================================================

    function falarBoasVindas() {

        if (
            !("speechSynthesis" in window)
        ) {

            return;

        }


        const mensagem =
            new SpeechSynthesisUtterance(
                "Bem-vindo, Senhor!"
            );


        /*
           AJUSTES DA VOZ:
    
           rate:
           0.80 = mais lenta
           0.90 = natural e solene
           1.00 = normal
    
           pitch:
           0.80 = mais grave
           1.00 = normal
    
           volume:
           0.00 até 1.00
        */

        mensagem.rate =
            2.00;

        mensagem.pitch =
            0.10;

        mensagem.volume =
            0.85;


        window.speechSynthesis.cancel();


        setTimeout(() => {

            window.speechSynthesis.speak(
                mensagem
            );

        }, 150);

    }


    // =====================================================
    // TELA 01 — INICIAR BOAS-VINDAS
    // =====================================================

    setTimeout(() => {

        falarBoasVindas();

    }, 900);

    // =====================================================
    // ANIMAÇÃO INICIAL DA HOME
    // =====================================================

    const elementosAnimados =
        document.querySelectorAll(
            ".hero-card, .module-card, .stat-card"
        );


    elementosAnimados.forEach(
        (elemento, index) => {

            elemento.style.opacity =
                "0";

            elemento.style.transform =
                "translateY(24px)";


            setTimeout(() => {

                elemento.style.transition =
                    "opacity 600ms ease, transform 600ms ease";

                elemento.style.opacity =
                    "1";

                elemento.style.transform =
                    "translateY(0)";

            }, 120 * index);

        }
    );


    // =====================================================
    // PROGRESSO GERAL
    // =====================================================

    const progressoGeral =
        12;


    const textoProgresso =
        document.getElementById(
            "progressoGeral"
        );


    const barraProgresso =
        document.getElementById(
            "barraProgressoGeral"
        );


    if (textoProgresso) {

        textoProgresso.textContent =
            `${progressoGeral}%`;

    }


    if (barraProgresso) {

        setTimeout(() => {

            barraProgresso.style.width =
                `${progressoGeral}%`;

        }, 500);

    }


    // =====================================================
    // EFEITO DE CLIQUE
    // =====================================================

    const elementosClicaveis =
        document.querySelectorAll(
            ".module-card, .primary-button, .nav-item"
        );


    elementosClicaveis.forEach(
        (elemento) => {

            elemento.addEventListener(
                "pointerdown",
                () => {

                    elemento.style.transform =
                        "scale(0.97)";

                }
            );


            elemento.addEventListener(
                "pointerup",
                () => {

                    elemento.style.transform =
                        "";

                }
            );


            elemento.addEventListener(
                "pointerleave",
                () => {

                    elemento.style.transform =
                        "";

                }
            );

        }
    );


    // =====================================================
    // NAVEGAÇÃO — MEMÓRIA NUMÉRICA
    // =====================================================

    const btnMemoriaNumerica =
        document.getElementById(
            "btnMemoriaNumerica"
        );


    const btnVoltarHome =
        document.getElementById(
            "btnVoltarHome"
        );


    const btnIniciarAprendizado =
        document.getElementById(
            "btnIniciarAprendizado"
        );


    const btnDesafiarMemoria =
        document.getElementById(
            "btnDesafiarMemoria"
        );


    const btnVoltarDesafiar =
        document.getElementById(
            "btnVoltarDesafiar"
        );


    const btnTabelaMental =
        document.getElementById(
            "btnTabelaMental"
        );


    const btnVoltarTabelaMental =
        document.getElementById(
            "btnVoltarTabelaMental"
        );


    const mentalTableRangeOptions =
        document.querySelectorAll(
            ".mental-table-range-option"
        );


    // =====================================================
    // FIXAR
    // =====================================================

    const btnFixar =
        document.getElementById(
            "btnFixar"
        );


    const btnVoltarFixar =
        document.getElementById(
            "btnVoltarFixar"
        );


    const telaFixarMemoria =
        document.getElementById(
            "telaFixarMemoria"
        );


    // =====================================================
    // ELEMENTOS — TREINO FIXAR
    // =====================================================

    const fixarTrainingArea =
        document.getElementById(
            "fixarTrainingArea"
        );


    const fixarProgress =
        document.getElementById(
            "fixarProgress"
        );


    const fixarRangeAtual =
        document.getElementById(
            "fixarRangeAtual"
        );


    const btnFaixaFixar =
        document.getElementById(
            "btnFaixaFixar"
        );


    const fixarRangeSelector =
        document.getElementById(
            "fixarRangeSelector"
        );


    const fixarRangeOptions =
        document.querySelectorAll(
            ".fixar-range-option"
        );


    const fixarQuestion =
        document.getElementById(
            "fixarQuestion"
        );


    const fixarNumber =
        document.getElementById(
            "fixarNumber"
        );


    const fixarAnswer =
        document.getElementById(
            "fixarAnswer"
        );


    const fixarCode =
        document.getElementById(
            "fixarCode"
        );


    const fixarWord =
        document.getElementById(
            "fixarWord"
        );


    const fixarImageArea =
        document.getElementById(
            "fixarImageArea"
        );


    const fixarImage =
        document.getElementById(
            "fixarImage"
        );


    const btnRevelarFixar =
        document.getElementById(
            "btnRevelarFixar"
        );


    const fixarEvaluation =
        document.getElementById(
            "fixarEvaluation"
        );


    const btnNaoLembreiFixar =
        document.getElementById(
            "btnNaoLembreiFixar"
        );


    const btnLembreiFixar =
        document.getElementById(
            "btnLembreiFixar"
        );


    // =====================================================
    // ELEMENTOS — TREINO DESAFIAR
    // =====================================================

    const desafiarTrainingArea =
        document.getElementById(
            "desafiarTrainingArea"
        );


    const desafiarProgress =
        document.getElementById(
            "desafiarProgress"
        );


    const desafiarRangeAtual =
        document.getElementById(
            "desafiarRangeAtual"
        );


    const btnFaixaDesafiar =
        document.getElementById(
            "btnFaixaDesafiar"
        );


    const desafiarRangeSelector =
        document.getElementById(
            "desafiarRangeSelector"
        );


    const desafiarRangeOptions =
        document.querySelectorAll(
            ".desafiar-range-option"
        );


    const desafiarNumber =
        document.getElementById(
            "desafiarNumber"
        );


    const desafiarResposta =
        document.getElementById(
            "desafiarResposta"
        );


    const desafiarFeedback =
        document.getElementById(
            "desafiarFeedback"
        );


    const desafiarFeedbackStatus =
        document.getElementById(
            "desafiarFeedbackStatus"
        );


    const desafiarFeedbackResposta =
        document.getElementById(
            "desafiarFeedbackResposta"
        );


    const btnVerificarDesafio =
        document.getElementById(
            "btnVerificarDesafio"
        );


    const btnProximoDesafio =
        document.getElementById(
            "btnProximoDesafio"
        );


    // =====================================================
    // ELEMENTOS — RESULTADO DO DESAFIAR
    // =====================================================

    const desafiarResult =
        document.getElementById(
            "desafiarResult"
        );


    const desafiarResultMessage =
        document.getElementById(
            "desafiarResultMessage"
        );


    const desafiarResultAcertos =
        document.getElementById(
            "desafiarResultAcertos"
        );


    const desafiarResultErros =
        document.getElementById(
            "desafiarResultErros"
        );


    const desafiarResultPercentual =
        document.getElementById(
            "desafiarResultPercentual"
        );


    const desafiarResultWeak =
        document.getElementById(
            "desafiarResultWeak"
        );


    const desafiarResultWeakList =
        document.getElementById(
            "desafiarResultWeakList"
        );


    const btnRefazerDesafio =
        document.getElementById(
            "btnRefazerDesafio"
        );


    const btnFinalizarDesafio =
        document.getElementById(
            "btnFinalizarDesafio"
        );


    // =====================================================
    // ELEMENTOS — RESULTADO DO FIXAR
    // =====================================================

    const fixarResult =
        document.getElementById(
            "fixarResult"
        );


    const fixarResultMessage =
        document.getElementById(
            "fixarResultMessage"
        );


    const fixarResultAcertos =
        document.getElementById(
            "fixarResultAcertos"
        );


    const fixarResultErros =
        document.getElementById(
            "fixarResultErros"
        );


    const fixarResultWeak =
        document.getElementById(
            "fixarResultWeak"
        );


    const fixarResultWeakList =
        document.getElementById(
            "fixarResultWeakList"
        );


    const btnRevisarErrosFixar =
        document.getElementById(
            "btnRevisarErrosFixar"
        );


    const btnFinalizarFixar =
        document.getElementById(
            "btnFinalizarFixar"
        );


    const btnVoltarMemoria =
        document.getElementById(
            "btnVoltarMemoria"
        );


    const btnVoltarCentralMemoria =
        document.getElementById(
            "btnVoltarCentralMemoria"
        );


    const telaMemoriaNumerica =
        document.getElementById(
            "telaMemoriaNumerica"
        );


    const telaTabelaMental =
        document.getElementById(
            "telaTabelaMental"
        );


    const telaAprenderMemoria =
        document.getElementById(
            "telaAprenderMemoria"
        );


    const telaDesafiarMemoria =
        document.getElementById(
            "telaDesafiarMemoria"
        );


    const heroHome =
        document.querySelector(
            ".hero-card"
        );


    const modulosHome =
        document.querySelector(
            ".modules-section"
        );


    const resumoHome =
        document.querySelector(
            ".summary-section"
        );


    const btnComecarAprendizado =
        document.getElementById(
            "btnComecarAprendizado"
        );


    const memoryLearningStage =
        document.getElementById(
            "memoryLearningStage"
        );


    const learnContent =
        document.querySelector(
            ".learn-content"
        );


    const learningNumero =
        document.getElementById(
            "learningNumero"
        );


    const learningCodigo =
        document.getElementById(
            "learningCodigo"
        );


    const learningPalavra =
        document.getElementById(
            "learningPalavra"
        );


    const learningImagem =
        document.getElementById(
            "learningImagem"
        );


    const learningProgress =
        document.getElementById(
            "learningProgress"
        );


    const btnProximaMemoria =
        document.getElementById(
            "btnProximaMemoria"
        );


    const btnAbrirFaixasAprender =
        document.getElementById(
            "btnAbrirFaixasAprender"
        );


    const learningRangePanel =
        document.getElementById(
            "learningRangePanel"
        );


    const learningRangeAtual =
        document.getElementById(
            "learningRangeAtual"
        );


    const learningRangeOptions =
        document.querySelectorAll(
            ".learning-range-option"
        );


    // =====================================================
    // ABRIR MEMÓRIA NUMÉRICA
    // =====================================================

    function abrirMemoriaNumerica() {

        heroHome.hidden =
            true;

        modulosHome.hidden =
            true;

        resumoHome.hidden =
            true;


        telaAprenderMemoria.hidden =
            true;

        telaTabelaMental.hidden =
            true;

        telaFixarMemoria.hidden =
            true;

        telaDesafiarMemoria.hidden =
            true;

        telaMemoriaNumerica.hidden =
            false;


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }

    // =====================================================
    // ABRIR FIXAR
    // =====================================================

    function abrirFixarMemoria() {

        telaMemoriaNumerica.hidden =
            true;

        telaTabelaMental.hidden =
            true;

        telaAprenderMemoria.hidden =
            true;

        telaDesafiarMemoria.hidden =
            true;

        telaFixarMemoria.hidden =
            false;


        // =================================================
        // LIMPA QUALQUER REVISÃO ANTERIOR
        // =================================================

        limparRevisaoErrosFixar();


        // =================================================
        // LIMPA OS RESULTADOS DA RODADA ANTERIOR
        // =================================================

        fixarErrosRodada =
            [];

        fixarAcertosRodada =
            [];


        // =================================================
        // CARREGA A PRIMEIRA MEMÓRIA DA FAIXA ATUAL
        // =================================================

        carregarMemoriaFixar(
            fixarInicioAtual
        );


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }

    // =====================================================
    // ABRIR DESAFIAR
    // =====================================================

    function abrirDesafiarMemoria() {

        telaMemoriaNumerica.hidden =
            true;

        telaTabelaMental.hidden =
            true;

        telaAprenderMemoria.hidden =
            true;

        telaFixarMemoria.hidden =
            true;

        telaDesafiarMemoria.hidden =
            false;


        carregarMemoriaDesafiar(
            desafiarInicioAtual
        );


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }
    // =====================================================
    // ESTADO DO TREINO — FIXAR
    // =====================================================

    let fixarNumeroAtual =
        1;


    let fixarErrosRodada =
        [];


    let fixarAcertosRodada =
        [];


    // =====================================================
    // FAIXA ATUAL — FIXAR
    //
    // Inicialmente:
    // 01–10
    //
    // Depois poderá receber:
    // 11–20
    // 21–30
    // ...
    // 91–100
    // =====================================================

    let fixarInicioAtual =
        1;


    let fixarFimAtual =
        10;


    // =====================================================
    // ESTADO — REVISÃO DOS ERROS
    // =====================================================

    let fixarModoRevisao =
        false;


    let fixarFilaRevisao =
        [];


    let fixarIndiceRevisao =
        0;


    // =====================================================
    // ESTADO DO TREINO — DESAFIAR
    // =====================================================

    let desafiarNumeroAtual =
        1;


    // =====================================================
    // FAIXA ATUAL — DESAFIAR
    //
    // Inicialmente:
    // 01–10
    //
    // Depois poderá receber:
    // 11–20
    // 21–30
    // ...
    // 91–100
    // =====================================================

    let desafiarInicioAtual =
        1;


    let desafiarFimAtual =
        10;


    // =====================================================
    // RESULTADOS DA RODADA — DESAFIAR
    // =====================================================

    let desafiarAcertosRodada =
        [];


    let desafiarErrosRodada =
        [];


    // =====================================================
    // CARREGAR MEMÓRIA — FIXAR
    // =====================================================

    function carregarMemoriaFixar(
        numero
    ) {

        const memoria =
            bancoMemoria.find(
                item =>
                    Number(
                        item.numero
                    ) ===
                    Number(
                        numero
                    )
            );


        if (!memoria) {

            return;

        }


        // =================================================
        // GARANTE QUE O TREINO ESTEJA VISÍVEL
        // =================================================

        fixarTrainingArea.hidden =
            false;

        fixarResult.hidden =
            true;


        // =================================================
        // GUARDA QUAL MEMÓRIA ESTÁ SENDO TREINADA
        // =================================================

        fixarNumeroAtual =
            Number(
                memoria.numero
            );


        // =================================================
        // MOSTRA SOMENTE A PERGUNTA
        // =================================================

        fixarQuestion.hidden =
            false;

        fixarAnswer.hidden =
            true;

        fixarEvaluation.hidden =
            true;

        btnRevelarFixar.hidden =
            false;


        // =================================================
        // NÚMERO
        // =================================================

        fixarNumber.textContent =
            String(
                memoria.numero
            ).padStart(
                2,
                "0"
            );


        // =================================================
        // PROGRESSO
        //
        // Treino normal:
        // posição dentro da faixa
        //
        // Exemplo faixa 31–40:
        // memória 31 = 01 / 10
        // memória 35 = 05 / 10
        //
        // Revisão:
        // 01 / 03
        // =================================================

        if (
            fixarModoRevisao
        ) {

            const posicaoRevisao =
                fixarIndiceRevisao + 1;


            const totalRevisao =
                fixarFilaRevisao.length;


            fixarProgress.textContent =
                `${String(posicaoRevisao).padStart(2, "0")} / ${String(totalRevisao).padStart(2, "0")}`;

        } else {

            const posicaoNaFaixa =
                fixarNumeroAtual -
                fixarInicioAtual +
                1;


            const totalNaFaixa =
                fixarFimAtual -
                fixarInicioAtual +
                1;


            fixarProgress.textContent =
                `${String(posicaoNaFaixa).padStart(2, "0")} / ${String(totalNaFaixa).padStart(2, "0")}`;

        }

        // =================================================
        // FAIXA ATUAL
        // =================================================

        if (
            fixarModoRevisao
        ) {

            fixarRangeAtual.textContent =
                "ERROS";

        } else {

            fixarRangeAtual.textContent =
                `${String(fixarInicioAtual).padStart(2, "0")}–${String(fixarFimAtual).padStart(2, "0")}`;

        }


        // =================================================
        // PREPARA A RESPOSTA
        // =================================================

        fixarCode.textContent =
            memoria.codigo;

        fixarWord.textContent =
            memoria.palavra.toUpperCase();


        if (memoria.imagem) {

            fixarImage.src =
                memoria.imagem;

            fixarImage.alt =
                memoria.palavra;

            fixarImageArea.hidden =
                false;

        } else {

            fixarImage.removeAttribute(
                "src"
            );

            fixarImage.alt =
                "";

            fixarImageArea.hidden =
                true;

        }

    }


    // =====================================================
    // CARREGAR MEMÓRIA — DESAFIAR
    // =====================================================

    function carregarMemoriaDesafiar(
        numero
    ) {

        const memoria =
            bancoMemoria.find(
                item =>
                    Number(
                        item.numero
                    ) ===
                    Number(
                        numero
                    )
            );


        if (!memoria) {

            return;

        }


        // =================================================
        // GUARDA QUAL MEMÓRIA ESTÁ SENDO DESAFIADA
        // =================================================

        desafiarNumeroAtual =
            Number(
                memoria.numero
            );


        // =================================================
        // NÚMERO
        // =================================================

        desafiarNumber.textContent =
            String(
                memoria.numero
            ).padStart(
                2,
                "0"
            );


        // =================================================
        // PROGRESSO
        // =================================================

        const posicaoNaFaixa =
            desafiarNumeroAtual -
            desafiarInicioAtual +
            1;


        const totalNaFaixa =
            desafiarFimAtual -
            desafiarInicioAtual +
            1;


        desafiarProgress.textContent =
            `${String(posicaoNaFaixa).padStart(2, "0")} / ${String(totalNaFaixa).padStart(2, "0")}`;


        // =================================================
        // FAIXA ATUAL
        // =================================================

        desafiarRangeAtual.textContent =
            `${String(desafiarInicioAtual).padStart(2, "0")}–${String(desafiarFimAtual).padStart(2, "0")}`;


        // =================================================
        // LIMPA A RESPOSTA ANTERIOR
        // =================================================

        desafiarResposta.value =
            "";


        desafiarResposta.readOnly =
            false;


        desafiarFeedback.hidden =
            true;


        desafiarFeedbackStatus.textContent =
            "";


        desafiarFeedbackResposta.textContent =
            "";


        btnVerificarDesafio.hidden =
            false;


        btnProximoDesafio.hidden =
            true;

    }


    // =====================================================
    // VERIFICAR RESPOSTA — DESAFIAR
    // =====================================================

    function verificarRespostaDesafiar() {

        const memoria =
            bancoMemoria.find(
                item =>
                    Number(
                        item.numero
                    ) ===
                    Number(
                        desafiarNumeroAtual
                    )
            );


        if (!memoria) {

            return;

        }


        const respostaDigitada =
            desafiarResposta.value.trim();


        // =================================================
        // NÃO PERMITE RESPOSTA VAZIA
        // =================================================

        if (
            respostaDigitada ===
            ""
        ) {

            desafiarFeedback.hidden =
                false;


            desafiarFeedbackStatus.textContent =
                "DIGITE UMA RESPOSTA";


            desafiarFeedbackResposta.textContent =
                "Preencha o campo antes de verificar.";


            desafiarResposta.focus();


            return;

        }


        // =================================================
        // NORMALIZA AS PALAVRAS
        //
        // Ignora:
        // maiúsculas e minúsculas
        // acentos
        // espaços no início e no fim
        //
        // Exemplo:
        // "Água", "agua" e "AGUA"
        // serão consideradas equivalentes.
        // =================================================

        function normalizarResposta(
            valor
        ) {

            return String(
                valor
            )
                .trim()
                .toLocaleLowerCase(
                    "pt-BR"
                )
                .normalize(
                    "NFD"
                )
                .replace(
                    /[\u0300-\u036f]/g,
                    ""
                );

        }


        const respostaNormalizada =
            normalizarResposta(
                respostaDigitada
            );


        const palavraCorretaNormalizada =
            normalizarResposta(
                memoria.palavra
            );


        const acertou =
            respostaNormalizada ===
            palavraCorretaNormalizada;


        // =================================================
        // REGISTRA O RESULTADO DA MEMÓRIA
        //
        // Primeiro remove qualquer registro anterior
        // desse mesmo número para garantir que ele
        // apareça apenas uma vez na rodada.
        // =================================================

        desafiarAcertosRodada =
            desafiarAcertosRodada.filter(
                numero =>
                    Number(numero) !==
                    Number(
                        desafiarNumeroAtual
                    )
            );


        desafiarErrosRodada =
            desafiarErrosRodada.filter(
                numero =>
                    Number(numero) !==
                    Number(
                        desafiarNumeroAtual
                    )
            );


        if (
            acertou
        ) {

            desafiarAcertosRodada.push(
                desafiarNumeroAtual
            );

        } else {

            desafiarErrosRodada.push(
                desafiarNumeroAtual
            );

        }


        // =================================================
        // MOSTRA O RESULTADO
        // =================================================

        desafiarFeedback.hidden =
            false;


        if (
            acertou
        ) {

            desafiarFeedbackStatus.textContent =
                "CORRETO";


            desafiarFeedbackResposta.textContent =
                memoria.palavra.toUpperCase();

        } else {

            desafiarFeedbackStatus.textContent =
                "INCORRETO";


            desafiarFeedbackResposta.textContent =
                `Resposta correta: ${memoria.palavra.toUpperCase()}`;

        }


        // =================================================
        // BLOQUEIA NOVA EDIÇÃO DEPOIS DA VERIFICAÇÃO
        // =================================================

        desafiarResposta.readOnly =
            true;


        // =================================================
        // TROCA OS BOTÕES
        // =================================================

        btnVerificarDesafio.hidden =
            true;


        btnProximoDesafio.hidden =
            false;

    }

    // =====================================================
    // PRÓXIMO DESAFIO
    // =====================================================

    function proximoDesafio() {

        if (
            desafiarNumeroAtual <
            desafiarFimAtual
        ) {

            carregarMemoriaDesafiar(
                desafiarNumeroAtual + 1
            );


            return;

        }


        // =================================================
        // FIM DA RODADA
        // =================================================

        finalizarRodadaDesafiar();

    }


    // =====================================================
    // FINALIZAR RODADA — DESAFIAR
    // =====================================================

    function finalizarRodadaDesafiar() {

        // =================================================
        // ESCONDE O TREINO
        // =================================================

        desafiarTrainingArea.hidden =
            true;


        // =================================================
        // MOSTRA O RESULTADO
        // =================================================

        desafiarResult.hidden =
            false;


        // =================================================
        // TOTAL DE ACERTOS
        // =================================================

        desafiarResultAcertos.textContent =
            desafiarAcertosRodada.length;


        // =================================================
        // TOTAL DE ERROS
        // =================================================

        desafiarResultErros.textContent =
            desafiarErrosRodada.length;


        // =================================================
        // PERCENTUAL DE DOMÍNIO
        // =================================================

        const totalRespostas =
            desafiarAcertosRodada.length +
            desafiarErrosRodada.length;


        const percentual =
            totalRespostas > 0
                ? Math.round(
                    (
                        desafiarAcertosRodada.length /
                        totalRespostas
                    ) * 100
                )
                : 0;


        desafiarResultPercentual.textContent =
            `${percentual}%`;


        // =================================================
        // LIMPA A LISTA ANTERIOR
        // =================================================

        desafiarResultWeakList.innerHTML =
            "";


        // =================================================
        // SE NÃO HOUVE ERROS
        // =================================================

        if (
            desafiarErrosRodada.length ===
            0
        ) {

            desafiarResultMessage.textContent =
                "Excelente! Você dominou todas as associações desta rodada.";

            desafiarResultWeak.hidden =
                true;

        } else {

            desafiarResultMessage.textContent =
                "Algumas associações ainda precisam de reforço. Revise os números abaixo.";

            desafiarResultWeak.hidden =
                false;


            // =============================================
            // MONTA A LISTA DE MEMÓRIAS PARA REFORÇAR
            // =============================================

            desafiarErrosRodada.forEach(
                numero => {

                    const memoria =
                        bancoMemoria.find(
                            item =>
                                Number(
                                    item.numero
                                ) ===
                                Number(
                                    numero
                                )
                        );


                    if (!memoria) {

                        return;

                    }


                    const item =
                        document.createElement(
                            "div"
                        );


                    item.className =
                        "desafiar-result-weak-item";


                    item.innerHTML =
                        `
                            <span class="desafiar-result-weak-number">
                                ${String(memoria.numero).padStart(2, "0")}
                            </span>

                            <span class="desafiar-result-weak-code">
                                ${memoria.codigo}
                            </span>

                            <strong class="desafiar-result-weak-word">
                                ${memoria.palavra.toUpperCase()}
                            </strong>
                        `;


                    desafiarResultWeakList.appendChild(
                        item
                    );

                }
            );

        }


        // =================================================
        // VOLTA PARA O TOPO DO RESULTADO
        // =================================================

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    // =====================================================
    // REVELAR MEMÓRIA — FIXAR
    // =====================================================

    function revelarMemoriaFixar() {

        fixarQuestion.hidden =
            true;

        fixarAnswer.hidden =
            false;

        btnRevelarFixar.hidden =
            true;

        fixarEvaluation.hidden =
            false;

    }


    // =====================================================
    // PREPARAR REVISÃO DOS ERROS
    //
    // Copia os erros da rodada para uma fila separada.
    // Ainda não inicia o treino automaticamente.
    // =====================================================

    function prepararRevisaoErrosFixar() {

        if (
            fixarErrosRodada.length ===
            0
        ) {

            return false;

        }


        fixarFilaRevisao =
            [
                ...fixarErrosRodada
            ];


        fixarIndiceRevisao =
            0;


        fixarModoRevisao =
            true;


        return true;

    }

    // =====================================================
    // LIMPAR ESTADO DA REVISÃO
    // =====================================================

    function limparRevisaoErrosFixar() {

        fixarModoRevisao =
            false;


        fixarFilaRevisao =
            [];


        fixarIndiceRevisao =
            0;

    }


    // =====================================================
    // FINALIZAR RODADA — FIXAR
    // =====================================================

    function finalizarRodadaFixar() {

        // =================================================
        // ESCONDE O TREINO
        // =================================================

        fixarTrainingArea.hidden =
            true;


        // =================================================
        // MOSTRA O RESULTADO
        // =================================================

        fixarResult.hidden =
            false;


        // =================================================
        // TOTAL DE ACERTOS
        // =================================================

        fixarResultAcertos.textContent =
            fixarAcertosRodada.length;


        // =================================================
        // TOTAL DE MEMÓRIAS PARA REFORÇAR
        // =================================================

        fixarResultErros.textContent =
            fixarErrosRodada.length;


        // =================================================
        // LIMPA A LISTA ANTERIOR
        // =================================================

        fixarResultWeakList.innerHTML =
            "";


        // =================================================
        // SE NÃO HOUVE ERROS
        // =================================================

        if (
            fixarErrosRodada.length ===
            0
        ) {

            fixarResultMessage.textContent =
                "Excelente! Você recuperou todas as associações desta rodada.";

            fixarResultWeak.hidden =
                true;

            btnRevisarErrosFixar.hidden =
                true;

        } else {

            fixarResultMessage.textContent =
                "Algumas associações ainda precisam de reforço. Elas serão destacadas abaixo.";

            fixarResultWeak.hidden =
                false;

            btnRevisarErrosFixar.hidden =
                false;


            // =============================================
            // MONTA A LISTA DE MEMÓRIAS FRACAS
            // =============================================

            fixarErrosRodada.forEach(
                numero => {

                    const memoria =
                        bancoMemoria.find(
                            item =>
                                Number(
                                    item.numero
                                ) ===
                                Number(
                                    numero
                                )
                        );


                    if (!memoria) {

                        return;

                    }


                    const item =
                        document.createElement(
                            "div"
                        );


                    item.className =
                        "fixar-result-weak-item";


                    item.innerHTML =
                        `
                            <span class="fixar-result-weak-number">
                                ${String(memoria.numero).padStart(2, "0")}
                            </span>

                            <span class="fixar-result-weak-code">
                                ${memoria.codigo}
                            </span>

                            <strong class="fixar-result-weak-word">
                                ${memoria.palavra.toUpperCase()}
                            </strong>
                        `;


                    fixarResultWeakList.appendChild(
                        item
                    );

                }
            );

        }

        // =================================================
        // VOLTA PARA O TOPO DO RESULTADO
        // =================================================

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }
    // =====================================================
    // VOLTAR DO FIXAR PARA A CENTRAL
    // =====================================================

    function voltarDoFixar() {

        telaFixarMemoria.hidden =
            true;

        telaTabelaMental.hidden =
            true;

        telaAprenderMemoria.hidden =
            true;

        telaMemoriaNumerica.hidden =
            false;


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }
    // =====================================================
    // VOLTAR DO DESAFIAR PARA A CENTRAL
    // =====================================================

    function voltarDoDesafiar() {

        telaDesafiarMemoria.hidden =
            true;

        telaFixarMemoria.hidden =
            true;

        telaTabelaMental.hidden =
            true;

        telaAprenderMemoria.hidden =
            true;

        telaMemoriaNumerica.hidden =
            false;


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }
    // =====================================================
    // ABRIR TABELA MENTAL
    // =====================================================

    function abrirTabelaMental() {

        telaMemoriaNumerica.hidden =
            true;

        telaAprenderMemoria.hidden =
            true;

        telaTabelaMental.hidden =
            false;


        // Carrega inicialmente a faixa 01–10
        gerarTabelaMental(
            1,
            10
        );


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }

    // =====================================================
    // VOLTAR DA TABELA MENTAL
    // =====================================================

    function voltarDaTabelaMental() {

        telaTabelaMental.hidden =
            true;

        telaAprenderMemoria.hidden =
            true;

        telaMemoriaNumerica.hidden =
            false;


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }

    // =====================================================
    // GERAR TABELA MENTAL — QUALQUER FAIXA
    // =====================================================

    function gerarTabelaMental(
        inicio,
        fim
    ) {

        const mentalTableGrid =
            document.getElementById(
                "mentalTableGrid"
            );


        if (!mentalTableGrid) {

            return;

        }


        const memoriasDaFaixa =
            bancoMemoria.filter(
                memoria =>
                    memoria.numero >= inicio &&
                    memoria.numero <= fim
            );


        mentalTableGrid.innerHTML =
            "";


        memoriasDaFaixa.forEach(
            memoria => {

                const card =
                    document.createElement(
                        "button"
                    );


                card.type =
                    "button";


                card.className =
                    "mental-table-card";


                card.innerHTML = `
                    <span class="mental-table-number">
                        ${String(memoria.numero).padStart(2, "0")}
                    </span>

                    <span class="mental-table-code">
                        ${memoria.codigo}
                    </span>

                    <strong class="mental-table-word">
                        ${memoria.palavra}
                    </strong>
                `;


                // =================================================
                // ABRIR DETALHE DA MEMÓRIA
                // =================================================

                card.addEventListener(
                    "click",
                    () => {

                        const mentalDetail =
                            document.getElementById(
                                "mentalDetail"
                            );


                        const mentalDetailNumber =
                            document.getElementById(
                                "mentalDetailNumber"
                            );


                        const mentalDetailCode =
                            document.getElementById(
                                "mentalDetailCode"
                            );


                        const mentalDetailWord =
                            document.getElementById(
                                "mentalDetailWord"
                            );


                        const mentalDetailImage =
                            document.getElementById(
                                "mentalDetailImage"
                            );


                        const mentalDetailImageArea =
                            document.getElementById(
                                "mentalDetailImageArea"
                            );


                        if (
                            !mentalDetail ||
                            !mentalDetailNumber ||
                            !mentalDetailCode ||
                            !mentalDetailWord ||
                            !mentalDetailImage ||
                            !mentalDetailImageArea
                        ) {

                            return;

                        }


                        // =========================================
                        // NÚMERO
                        // =========================================

                        mentalDetailNumber.textContent =
                            String(
                                memoria.numero
                            ).padStart(
                                2,
                                "0"
                            );


                        // =========================================
                        // CÓDIGO
                        // =========================================

                        mentalDetailCode.textContent =
                            memoria.codigo;


                        // =========================================
                        // PALAVRA
                        // =========================================

                        mentalDetailWord.textContent =
                            memoria.palavra.toUpperCase();


                        // =========================================
                        // IMAGEM
                        //
                        // Se existir imagem cadastrada,
                        // mostramos normalmente.
                        //
                        // Se não existir, ocultamos somente
                        // a área da imagem.
                        // =========================================

                        if (memoria.imagem) {

                            mentalDetailImage.src =
                                memoria.imagem;


                            mentalDetailImage.alt =
                                `Associação visual do número ${String(
                                    memoria.numero
                                ).padStart(
                                    2,
                                    "0"
                                )} — ${memoria.palavra}`;


                            mentalDetailImageArea.hidden =
                                false;

                        } else {

                            mentalDetailImage.removeAttribute(
                                "src"
                            );


                            mentalDetailImage.alt =
                                "";


                            mentalDetailImageArea.hidden =
                                true;

                        }


                        // =========================================
                        // ABRE O DETALHE
                        // =========================================

                        mentalDetail.hidden =
                            false;

                    }
                );


                mentalTableGrid.appendChild(
                    card
                );

            }
        );

    }

    // =====================================================
    // ABRIR TELA APRENDER
    // =====================================================

    function abrirAprendizado() {

        telaMemoriaNumerica.hidden =
            true;

        telaTabelaMental.hidden =
            true;

        telaAprenderMemoria.hidden =
            false;


        // Oculta a tela introdutória "Como funciona"
        learnContent.hidden =
            true;


        // Exibe diretamente a tela real de aprendizado
        memoryLearningStage.hidden =
            false;


        // Sempre inicia pelo primeiro número
        indiceMemoriaAtual =
            0;


        mostrarMemoria(
            indiceMemoriaAtual
        );


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    // =====================================================
    // VOLTAR PARA MEMÓRIA NUMÉRICA
    // =====================================================

    function voltarParaMemoria() {

        telaAprenderMemoria.hidden =
            true;

        telaMemoriaNumerica.hidden =
            false;


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    // =====================================================
    // COMEÇAR APRENDIZADO
    // =====================================================

    function comecarAprendizado() {

        learnContent.hidden =
            true;

        memoryLearningStage.hidden =
            false;


        indiceMemoriaAtual =
            0;


        mostrarMemoria(
            indiceMemoriaAtual
        );


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    // =====================================================
    // ABRIR / FECHAR PAINEL DE FAIXAS
    // =====================================================

    function alternarPainelFaixas() {

        if (
            !learningRangePanel ||
            !btnAbrirFaixasAprender
        ) {

            return;

        }


        const painelEstaAberto =
            !learningRangePanel.hidden;


        learningRangePanel.hidden =
            painelEstaAberto;


        btnAbrirFaixasAprender.setAttribute(
            "aria-expanded",
            String(
                !painelEstaAberto
            )
        );

    }


    // =====================================================
    // MOSTRAR MEMÓRIA ATUAL
    // =====================================================

    function mostrarMemoria(indice) {

        const memoriasDaFaixa =
            bancoMemoria.filter(
                memoria =>
                    memoria.numero >= faixaInicioAtual &&
                    memoria.numero <= faixaFimAtual
            );


        const memoria =
            memoriasDaFaixa[indice];


        if (!memoria) {

            console.log(
                "Nenhuma memória disponível nesta faixa."
            );

            return;

        }


        learningProgress.textContent =
            `${String(
                indice + 1
            ).padStart(2, "0")
            } / ${String(
                memoriasDaFaixa.length
            ).padStart(2, "0")
            }`;


        learningNumero.textContent =
            String(
                memoria.numero
            ).padStart(2, "0");


        learningCodigo.textContent =
            memoria.codigo;


        learningPalavra.textContent =
            memoria.palavra.toUpperCase();


        // =================================================
        // IMAGEM DA MEMÓRIA
        // =================================================

        if (memoria.imagem) {

            learningImagem.src =
                memoria.imagem;

            learningImagem.alt =
                `Associação visual do número ${String(
                    memoria.numero
                ).padStart(2, "0")
                } — ${memoria.palavra}`;

            learningImagem.hidden =
                false;

        } else {

            learningImagem.removeAttribute(
                "src"
            );

            learningImagem.alt =
                "";

            learningImagem.hidden =
                true;

        }


        // =================================================
        // BOTÃO — PRÓXIMO / CONCLUIR
        // =================================================

        const textoBotao =
            btnProximaMemoria.querySelector(
                "span"
            );


        if (memoria.numero === 100) {

            if (textoBotao) {

                textoBotao.textContent =
                    "Concluir";

            }

        } else {

            if (textoBotao) {

                textoBotao.textContent =
                    "Próximo";

            }

        }

    }

    // =====================================================
    // ÍNDICE DA MEMÓRIA ATUAL
    //
    // Agora este índice representa a posição DENTRO
    // da faixa escolhida.
    //
    // Exemplo:
    // 21 = posição 0 da faixa 21–30
    // 22 = posição 1 da faixa 21–30
    // =====================================================

    let indiceMemoriaAtual =
        0;


    // =====================================================
    // FAIXA ATUAL DO APRENDIZADO
    // =====================================================

    let faixaInicioAtual =
        1;


    let faixaFimAtual =
        10;


    // =====================================================
    // SELECIONAR FAIXA DE APRENDIZADO
    // =====================================================

    function selecionarFaixaAprender(botao) {

        const inicio =
            Number(
                botao.dataset.inicio
            );


        const fim =
            Number(
                botao.dataset.fim
            );


        const memoriasDisponiveis =
            bancoMemoria.filter(
                memoria =>
                    memoria.numero >= inicio &&
                    memoria.numero <= fim
            );


        // =================================================
        // FAIXA AINDA NÃO CADASTRADA
        // =================================================

        if (
            memoriasDisponiveis.length === 0
        ) {

            console.log(
                `A faixa ${String(
                    inicio
                ).padStart(2, "0")}–${String(
                    fim
                ).padStart(2, "0")} ainda não possui memórias cadastradas.`
            );

            return;

        }


        // =================================================
        // DEFINE A NOVA FAIXA
        // =================================================

        faixaInicioAtual =
            inicio;


        faixaFimAtual =
            fim;


        indiceMemoriaAtual =
            0;


        // =================================================
        // ATUALIZA O TEXTO DO BOTÃO
        // =================================================

        if (learningRangeAtual) {

            learningRangeAtual.textContent =
                `${String(
                    inicio
                ).padStart(2, "0")}–${String(
                    fim
                ).padStart(2, "0")}`;

        }


        // =================================================
        // MUDA O DESTAQUE VISUAL DA FAIXA
        // =================================================

        learningRangeOptions.forEach(
            opcao => {

                opcao.classList.remove(
                    "active"
                );

            }
        );


        botao.classList.add(
            "active"
        );


        // =================================================
        // MOSTRA A PRIMEIRA MEMÓRIA DA NOVA FAIXA
        // =================================================

        mostrarMemoria(
            indiceMemoriaAtual
        );


        // =================================================
        // FECHA O PAINEL DE FAIXAS
        // =================================================

        if (learningRangePanel) {

            learningRangePanel.hidden =
                true;

        }


        if (btnAbrirFaixasAprender) {

            btnAbrirFaixasAprender.setAttribute(
                "aria-expanded",
                "false"
            );

        }


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    // =====================================================
    // AVANÇAR MEMÓRIA
    // =====================================================

    function avancarMemoria() {

        const memoriasDaFaixa =
            bancoMemoria.filter(
                memoria =>
                    memoria.numero >= faixaInicioAtual &&
                    memoria.numero <= faixaFimAtual
            );


        const proximoIndice =
            indiceMemoriaAtual + 1;


        const proximaMemoria =
            memoriasDaFaixa[
            proximoIndice
            ];


        // =====================================================
        // AINDA EXISTE MEMÓRIA NA FAIXA ATUAL
        // =====================================================

        if (proximaMemoria) {

            indiceMemoriaAtual =
                proximoIndice;


            mostrarMemoria(
                indiceMemoriaAtual
            );


            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });


            return;

        }


        // =====================================================
        // ÚLTIMA FAIXA — CONCLUIR APRENDIZADO
        // =====================================================

        if (faixaFimAtual >= 100) {

            voltarParaMemoria();

            return;

        }


        // =====================================================
        // AVANÇAR AUTOMATICAMENTE PARA A PRÓXIMA FAIXA
        // =====================================================

        const novoInicio =
            faixaFimAtual + 1;


        const novoFim =
            Math.min(
                novoInicio + 9,
                100
            );


        const memoriasProximaFaixa =
            bancoMemoria.filter(
                memoria =>
                    memoria.numero >= novoInicio &&
                    memoria.numero <= novoFim
            );


        if (
            memoriasProximaFaixa.length === 0
        ) {

            console.log(
                `A faixa ${String(
                    novoInicio
                ).padStart(2, "0")}–${String(
                    novoFim
                ).padStart(2, "0")} não possui memórias cadastradas.`
            );

            return;

        }


        faixaInicioAtual =
            novoInicio;


        faixaFimAtual =
            novoFim;


        indiceMemoriaAtual =
            0;


        // =====================================================
        // ATUALIZAR NOME DA FAIXA NO TOPO
        // =====================================================

        if (learningRangeAtual) {

            learningRangeAtual.textContent =
                `${String(
                    faixaInicioAtual
                ).padStart(2, "0")}–${String(
                    faixaFimAtual
                ).padStart(2, "0")}`;

        }


        // =====================================================
        // ATUALIZAR FAIXA ATIVA NO SELETOR
        // =====================================================

        learningRangeOptions.forEach(
            botao => {

                const inicioBotao =
                    Number(
                        botao.dataset.inicio
                    );


                const fimBotao =
                    Number(
                        botao.dataset.fim
                    );


                botao.classList.toggle(
                    "active",
                    inicioBotao === faixaInicioAtual &&
                    fimBotao === faixaFimAtual
                );

            }
        );


        // =====================================================
        // MOSTRAR PRIMEIRA MEMÓRIA DA NOVA FAIXA
        // =====================================================

        mostrarMemoria(
            indiceMemoriaAtual
        );


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    // =====================================================
    // VOLTAR PARA HOME
    // =====================================================

    function voltarParaHome() {

        telaMemoriaNumerica.hidden =
            true;


        heroHome.hidden =
            false;

        modulosHome.hidden =
            false;

        resumoHome.hidden =
            false;


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }

    // =====================================================
    // TELA 01 — ATIVAR PORTAL
    // =====================================================

    /*
       SEQUÊNCIA DA TELA 01:
     
       1. bloqueia clique duplo;
       2. ativa pulso + raio + flash;
       3. inicia a saída da Tela 01;
       4. esconde a Tela 01;
       5. libera a Home / Tela 02.
    */

    let portalEmTransicao =
        false;


    function ativarPortal() {

        if (
            !portalScreen ||
            portalEmTransicao
        ) {

            return;

        }


        portalEmTransicao =
            true;

        // =====================================================
        // SOM — ATIVAÇÃO DO PORTAL
        // =====================================================

        somPortal.currentTime =
            0;


        somPortal.play().catch(
            (erro) => {

                console.log(
                    "Não foi possível reproduzir o som do portal:",
                    erro
                );

            }
        );


        portalScreen.classList.remove(
            "portal-ativado",
            "portal-saindo"
        );


        void portalScreen.offsetWidth;


        // =====================================================
        // SOM — ATIVAÇÃO DO PORTAL
        // =====================================================

        somPortal.currentTime =
            0;

        somPortal.play().catch(
            () => {

                console.log(
                    "O navegador bloqueou o áudio."
                );

            }
        );


        // =====================================================
        // ETAPA 01 — PULSO + RAIO + FLASH
        // =====================================================

        portalScreen.classList.add(
            "portal-ativado"
        );


        // =====================================================
        // ETAPA 02 — INICIAR SAÍDA DA TELA 01
        // =====================================================

        setTimeout(() => {

            portalScreen.classList.add(
                "portal-saindo"
            );

        }, 600);


        // =====================================================
        // ETAPA 03 — MOSTRAR TELA 02 / HOME
        // =====================================================

        setTimeout(() => {

            portalScreen.style.display =
                "none";


            portalScreen.classList.remove(
                "portal-ativado",
                "portal-saindo"
            );


            portalEmTransicao =
                false;


            window.scrollTo({
                top: 0,
                behavior: "auto"
            });


            console.log(
                "Tela 02 aberta."
            );

        }, 1550);

    }


    // =====================================================
    // EVENTOS — TELA 01
    // =====================================================

    if (btnPortalEntrada) {

        btnPortalEntrada.addEventListener(
            "click",
            ativarPortal
        );

    }


    // =====================================================
    // EVENTOS — MEMÓRIA NUMÉRICA
    // =====================================================

    if (btnMemoriaNumerica) {

        btnMemoriaNumerica.addEventListener(
            "click",
            abrirMemoriaNumerica
        );

    }


    if (btnIniciarAprendizado) {

        btnIniciarAprendizado.addEventListener(
            "click",
            abrirAprendizado
        );

    }


    // =====================================================
    // EVENTOS — TABELA MENTAL
    // =====================================================

    if (btnTabelaMental) {

        btnTabelaMental.addEventListener(
            "click",
            abrirTabelaMental
        );

    }


    if (btnVoltarTabelaMental) {

        btnVoltarTabelaMental.addEventListener(
            "click",
            voltarDaTabelaMental
        );

    }


    // =====================================================
    // EVENTOS — DESAFIAR
    // =====================================================

    if (btnDesafiarMemoria) {

        btnDesafiarMemoria.addEventListener(
            "click",
            abrirDesafiarMemoria
        );

    }


    if (btnVoltarDesafiar) {

        btnVoltarDesafiar.addEventListener(
            "click",
            voltarDoDesafiar
        );

    }


    if (btnVerificarDesafio) {

        btnVerificarDesafio.addEventListener(
            "click",
            verificarRespostaDesafiar
        );

    }


    if (btnProximoDesafio) {

        btnProximoDesafio.addEventListener(
            "click",
            proximoDesafio
        );

    }


    // =====================================================
    // REFAZER DESAFIO
    // =====================================================

    if (btnRefazerDesafio) {

        btnRefazerDesafio.addEventListener(
            "click",
            () => {

                // =========================================
                // LIMPA OS RESULTADOS DA RODADA
                // =========================================

                desafiarAcertosRodada =
                    [];


                desafiarErrosRodada =
                    [];


                // =========================================
                // VOLTA PARA O PRIMEIRO NÚMERO DA FAIXA
                // =========================================

                desafiarNumeroAtual =
                    desafiarInicioAtual;


                // =========================================
                // ESCONDE O RESULTADO
                // =========================================

                desafiarResult.hidden =
                    true;


                // =========================================
                // MOSTRA NOVAMENTE O TREINO
                // =========================================

                desafiarTrainingArea.hidden =
                    false;


                // =========================================
                // CARREGA O PRIMEIRO DESAFIO
                // =========================================

                carregarMemoriaDesafiar(
                    desafiarInicioAtual
                );


                // =========================================
                // VOLTA PARA O TOPO
                // =========================================

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );

    }


    // =====================================================
    // FINALIZAR DESAFIO
    // =====================================================

    if (btnFinalizarDesafio) {

        btnFinalizarDesafio.addEventListener(
            "click",
            () => {

                // =========================================
                // PREPARA O DESAFIAR PARA UMA NOVA ABERTURA
                // =========================================

                desafiarAcertosRodada =
                    [];


                desafiarErrosRodada =
                    [];


                desafiarNumeroAtual =
                    desafiarInicioAtual;


                desafiarResult.hidden =
                    true;


                desafiarTrainingArea.hidden =
                    false;


                // =========================================
                // VOLTA PARA A CENTRAL
                // =========================================

                voltarDoDesafiar();

            }
        );

    }


    // =====================================================
    // ABRIR / FECHAR SELETOR DE FAIXAS — DESAFIAR
    // =====================================================

    if (
        btnFaixaDesafiar &&
        desafiarRangeSelector
    ) {

        btnFaixaDesafiar.addEventListener(
            "click",
            () => {

                const deveAbrir =
                    desafiarRangeSelector.hidden;


                desafiarRangeSelector.hidden =
                    !deveAbrir;


                btnFaixaDesafiar.setAttribute(
                    "aria-expanded",
                    String(deveAbrir)
                );

            }
        );

    }


    // =====================================================
    // ESCOLHER FAIXA — DESAFIAR
    // =====================================================

    desafiarRangeOptions.forEach(
        opcao => {

            opcao.addEventListener(
                "click",
                () => {

                    const inicio =
                        Number(
                            opcao.dataset.desafiarInicio
                        );


                    const fim =
                        Number(
                            opcao.dataset.desafiarFim
                        );


                    // =========================================
                    // SEGURANÇA
                    // =========================================

                    if (
                        !Number.isFinite(inicio) ||
                        !Number.isFinite(fim)
                    ) {

                        return;

                    }


                    // =========================================
                    // DEFINE A NOVA FAIXA
                    // =========================================

                    desafiarInicioAtual =
                        inicio;


                    desafiarFimAtual =
                        fim;


                    desafiarNumeroAtual =
                        desafiarInicioAtual;


                    // =========================================
                    // REMOVE O DESTAQUE DA FAIXA ANTERIOR
                    // =========================================

                    desafiarRangeOptions.forEach(
                        botao => {

                            botao.classList.remove(
                                "is-active"
                            );

                        }
                    );


                    // =========================================
                    // DESTACA A NOVA FAIXA
                    // =========================================

                    opcao.classList.add(
                        "is-active"
                    );


                    // =========================================
                    // FECHA O SELETOR
                    // =========================================

                    desafiarRangeSelector.hidden =
                        true;


                    btnFaixaDesafiar.setAttribute(
                        "aria-expanded",
                        "false"
                    );


                    // =========================================
                    // CARREGA O PRIMEIRO NÚMERO DA NOVA FAIXA
                    // =========================================

                    carregarMemoriaDesafiar(
                        desafiarInicioAtual
                    );


                    // =========================================
                    // VOLTA PARA O TOPO
                    // =========================================

                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });

                }
            );

        }
    );


    // =====================================================
    // INSTALAÇÃO DO PWA — PALÁCIO MENTAL
    // =====================================================

    const appInstallBanner =
        document.getElementById(
            "appInstallBanner"
        );


    const btnInstalarApp =
        document.getElementById(
            "btnInstalarApp"
        );


    const btnFecharInstallBanner =
        document.getElementById(
            "btnFecharInstallBanner"
        );


    let pwaInstallPrompt =
        null;


    const PWA_DISMISS_KEY =
        "palacioMentalPwaDismissedAt";


    const PWA_DISMISS_DAYS =
        7;


    // =====================================================
    // REGISTRA QUE O USUÁRIO QUER ADIAR A INSTALAÇÃO
    // =====================================================

    function adiarInstalacao() {

        localStorage.setItem(
            PWA_DISMISS_KEY,
            String(
                Date.now()
            )
        );

    }


    // =====================================================
    // VERIFICA SE O APP JÁ ESTÁ INSTALADO
    // =====================================================

    function appJaEstaInstalado() {

        const modoStandalone =
            window.matchMedia(
                "(display-mode: standalone)"
            ).matches;


        const standaloneIOS =
            window.navigator.standalone ===
            true;


        return (
            modoStandalone ||
            standaloneIOS
        );

    }

    // =====================================================
    // VERIFICA SE O USUÁRIO RECUSOU RECENTEMENTE
    // =====================================================

    function instalacaoFoiAdiadaRecentemente() {

        const valorSalvo =
            localStorage.getItem(
                PWA_DISMISS_KEY
            );


        if (!valorSalvo) {

            return false;

        }


        const dataRecusa =
            Number(
                valorSalvo
            );


        if (
            !Number.isFinite(
                dataRecusa
            )
        ) {

            localStorage.removeItem(
                PWA_DISMISS_KEY
            );


            return false;

        }


        const agora =
            Date.now();


        const tempoDecorrido =
            agora -
            dataRecusa;


        const seteDiasEmMilissegundos =
            PWA_DISMISS_DAYS *
            24 *
            60 *
            60 *
            1000;


        if (
            tempoDecorrido >=
            seteDiasEmMilissegundos
        ) {

            localStorage.removeItem(
                PWA_DISMISS_KEY
            );


            return false;

        }


        return true;

    }


    // =====================================================
    // MOSTRAR BANNER
    // =====================================================

    function mostrarBannerInstalacao() {

        if (
            !appInstallBanner ||
            appJaEstaInstalado() ||
            instalacaoFoiAdiadaRecentemente()
        ) {

            return;

        }


        appInstallBanner.hidden =
            false;

    }


    // =====================================================
    // ESCONDER BANNER
    // =====================================================

    function esconderBannerInstalacao() {

        if (!appInstallBanner) {

            return;

        }


        appInstallBanner.hidden =
            true;

    }


    // =====================================================
    // CHROME / EDGE / ANDROID
    //
    // O navegador informa quando o PWA pode ser instalado.
    // Guardamos o evento para utilizar quando o usuário
    // tocar no botão Instalar do nosso banner.
    // =====================================================

    window.addEventListener(
        "beforeinstallprompt",
        event => {

            event.preventDefault();


            pwaInstallPrompt =
                event;


            mostrarBannerInstalacao();

        }
    );


    // =====================================================
    // BOTÃO INSTALAR — BANNER
    //
    // Abre DIRETAMENTE a confirmação oficial do navegador.
    // Não existe mais modal intermediário.
    // =====================================================

    if (btnInstalarApp) {

        btnInstalarApp.addEventListener(
            "click",
            async () => {

                if (!pwaInstallPrompt) {

                    return;

                }


                pwaInstallPrompt.prompt();


                const escolha =
                    await pwaInstallPrompt.userChoice;


                if (
                    escolha.outcome ===
                    "accepted"
                ) {

                    localStorage.removeItem(
                        PWA_DISMISS_KEY
                    );


                    esconderBannerInstalacao();

                }


                if (
                    escolha.outcome ===
                    "dismissed"
                ) {

                    adiarInstalacao();


                    esconderBannerInstalacao();

                }


                pwaInstallPrompt =
                    null;

            }
        );

    }


    // =====================================================
    // BOTÃO FECHAR — BANNER
    //
    // Esconde o convite por 7 dias.
    // =====================================================

    if (btnFecharInstallBanner) {

        btnFecharInstallBanner.addEventListener(
            "click",
            () => {

                adiarInstalacao();


                esconderBannerInstalacao();

            }
        );

    }


    // =====================================================
    // INSTALAÇÃO CONCLUÍDA
    // =====================================================

    window.addEventListener(
        "appinstalled",
        () => {

            pwaInstallPrompt =
                null;


            localStorage.removeItem(
                PWA_DISMISS_KEY
            );


            esconderBannerInstalacao();


            console.log(
                "Palácio Mental instalado com sucesso."
            );

        }
    );


    // =====================================================
    // GARANTIA EXTRA
    //
    // Se estiver sendo executado como aplicativo,
    // o banner nunca deve aparecer.
    // =====================================================

    if (appJaEstaInstalado()) {

        localStorage.removeItem(
            PWA_DISMISS_KEY
        );


        esconderBannerInstalacao();

    }

});