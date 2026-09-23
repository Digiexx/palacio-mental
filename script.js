// =====================================================
// PALÁCIO MENTAL
// SCRIPT PRINCIPAL
// =====================================================



// =====================================================
// INICIALIZAÇÃO DO APLICATIVO
// =====================================================

document.addEventListener("DOMContentLoaded", () => {


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


    // =====================================================
    // REVISÃO INTELIGENTE
    // =====================================================

    const btnRevisao =
        document.getElementById(
            "btnRevisao"
        );


    const telaRevisao =
        document.getElementById(
            "telaRevisao"
        );


    const btnVoltarRevisao =
        document.getElementById(
            "btnVoltarRevisao"
        );


    const revisoesPendentes =
        document.getElementById(
            "revisoesPendentes"
        );


    const revisaoTotalPendentes =
        document.getElementById(
            "revisaoTotalPendentes"
        );


    const revisaoPercentual =
        document.getElementById(
            "revisaoPercentual"
        );


    const revisaoBarra =
        document.getElementById(
            "revisaoBarra"
        );


        // =============================================
        // NÚMERO
        // =============================================


    // =====================================================
    // ATIVIDADE — REVISÃO INTELIGENTE
    // =====================================================

    const revisaoTraining =
        document.getElementById(
            "revisaoTraining"
        );


    const revisaoTrainingProgress =
        document.getElementById(
            "revisaoTrainingProgress"
        );


    const revisaoTrainingNumber =
        document.getElementById(
            "revisaoTrainingNumber"
        );


    const revisaoTrainingAnswer =
        document.getElementById(
            "revisaoTrainingAnswer"
        );


    const revisaoTrainingAnswerValue =
        document.getElementById(
            "revisaoTrainingAnswerValue"
        );


    const btnRevelarRevisao =
        document.getElementById(
            "btnRevelarRevisao"
        );


    const revisaoTrainingEvaluation =
        document.getElementById(
            "revisaoTrainingEvaluation"
        );


    const btnNaoLembreiRevisao =
        document.getElementById(
            "btnNaoLembreiRevisao"
        );


    const btnLembreiRevisao =
        document.getElementById(
            "btnLembreiRevisao"
        );


    // =====================================================
    // RESULTADO — REVISÃO INTELIGENTE
    // =====================================================

    const revisaoResult =
        document.getElementById(
            "revisaoResult"
        );


    const revisaoResultAcertos =
        document.getElementById(
            "revisaoResultAcertos"
        );


    const revisaoResultErros =
        document.getElementById(
            "revisaoResultErros"
        );


    const revisaoResultWeak =
        document.getElementById(
            "revisaoResultWeak"
        );


    const revisaoResultWeakList =
        document.getElementById(
            "revisaoResultWeakList"
        );


    const revisaoResultSuccess =
        document.getElementById(
            "revisaoResultSuccess"
        );


    const btnNovaRevisao =
        document.getElementById(
            "btnNovaRevisao"
        );


    const btnVoltarHome =
        document.getElementById(
            "btnVoltarHome"
        );


    const btnMemoriaTreinoRapido =
        document.getElementById(
            "btnMemoriaTreinoRapido"
        );


    const telaTreinoRapido =
        document.getElementById(
            "telaTreinoRapido"
        );


    const btnVoltarTreinoRapido =
        document.getElementById(
            "btnVoltarTreinoRapido"
        );


    const treinoRapidoIntro =
        document.getElementById(
            "treinoRapidoIntro"
        );


    const btnIniciarTreinoRapido =
        document.getElementById(
            "btnIniciarTreinoRapido"
        );


    const treinoRapidoTraining =
        document.getElementById(
            "treinoRapidoTraining"
        );


    const treinoRapidoProgress =
        document.getElementById(
            "treinoRapidoProgress"
        );


    const treinoRapidoMode =
        document.getElementById(
            "treinoRapidoMode"
        );


    const treinoRapidoQuestionLabel =
        document.getElementById(
            "treinoRapidoQuestionLabel"
        );


    const treinoRapidoNumber =
        document.getElementById(
            "treinoRapidoNumber"
        );


    const treinoRapidoImageArea =
        document.getElementById(
            "treinoRapidoImageArea"
        );


    const treinoRapidoImage =
        document.getElementById(
            "treinoRapidoImage"
        );


    const treinoRapidoAnswer =
        document.getElementById(
            "treinoRapidoAnswer"
        );


    const treinoRapidoAnswerLabel =
        document.getElementById(
            "treinoRapidoAnswerLabel"
        );


    const treinoRapidoAnswerValue =
        document.getElementById(
            "treinoRapidoAnswerValue"
        );


    const btnRevelarTreinoRapido =
        document.getElementById(
            "btnRevelarTreinoRapido"
        );


    const treinoRapidoEvaluation =
        document.getElementById(
            "treinoRapidoEvaluation"
        );


    const btnNaoLembreiTreinoRapido =
        document.getElementById(
            "btnNaoLembreiTreinoRapido"
        );


    const btnLembreiTreinoRapido =
        document.getElementById(
            "btnLembreiTreinoRapido"
        );


    // =====================================================
    // RESULTADO — TREINO RÁPIDO
    // =====================================================

    const treinoRapidoResult =
        document.getElementById(
            "treinoRapidoResult"
        );


    const treinoRapidoPercentual =
        document.getElementById(
            "treinoRapidoPercentual"
        );


    const treinoRapidoTotalAcertos =
        document.getElementById(
            "treinoRapidoTotalAcertos"
        );


    const treinoRapidoTotalErros =
        document.getElementById(
            "treinoRapidoTotalErros"
        );


    const treinoRapidoWeakList =
        document.getElementById(
            "treinoRapidoWeakList"
        );


    const treinoRapidoWeakEmpty =
        document.getElementById(
            "treinoRapidoWeakEmpty"
        );


    const btnReiniciarTreinoRapido =
        document.getElementById(
            "btnReiniciarTreinoRapido"
        );


    const btnFinalizarTreinoRapido =
        document.getElementById(
            "btnFinalizarTreinoRapido"
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


    const btnVelocidadeMemoria =
        document.getElementById(
            "btnVelocidadeMemoria"
        );


    const btnVoltarVelocidade =
        document.getElementById(
            "btnVoltarVelocidade"
        );


    const telaVelocidadeMemoria =
        document.getElementById(
            "telaVelocidadeMemoria"
        );


    const velocidadeRangeOptions =
        document.querySelectorAll(
            ".velocidade-range-option"
        );


    const velocidadeTimeOptions =
        document.querySelectorAll(
            ".velocidade-time-option"
        );


    const btnIniciarVelocidade =
        document.getElementById(
            "btnIniciarVelocidade"
        );


    const velocidadeConfig =
        document.getElementById(
            "velocidadeConfig"
        );


    const velocidadeTrainingArea =
        document.getElementById(
            "velocidadeTrainingArea"
        );


    const velocidadeProgress =
        document.getElementById(
            "velocidadeProgress"
        );


    const velocidadeTrainingTime =
        document.getElementById(
            "velocidadeTrainingTime"
        );


    const velocidadeTimer =
        document.getElementById(
            "velocidadeTimer"
        );


    const velocidadeTimeoutMessage =
        document.getElementById(
            "velocidadeTimeoutMessage"
        );


    const velocidadeNumber =
        document.getElementById(
            "velocidadeNumber"
        );


    const velocidadeAnswer =
        document.getElementById(
            "velocidadeAnswer"
        );


    const velocidadeAnswerWord =
        document.getElementById(
            "velocidadeAnswerWord"
        );


    const velocidadeAnswerImageArea =
        document.getElementById(
            "velocidadeAnswerImageArea"
        );


    const velocidadeAnswerImage =
        document.getElementById(
            "velocidadeAnswerImage"
        );


    const btnRevelarVelocidade =
        document.getElementById(
            "btnRevelarVelocidade"
        );


    const velocidadeEvaluation =
        document.getElementById(
            "velocidadeEvaluation"
        );


    const btnNaoLembreiVelocidade =
        document.getElementById(
            "btnNaoLembreiVelocidade"
        );


    const btnLembreiVelocidade =
        document.getElementById(
            "btnLembreiVelocidade"
        );        
        
        
        // =====================================================
    // RESULTADO — VELOCIDADE
    // =====================================================

    const velocidadeResult =
        document.getElementById(
            "velocidadeResult"
        );


    const velocidadeResultPercent =
        document.getElementById(
            "velocidadeResultPercent"
        );


    const velocidadeResultAcertos =
        document.getElementById(
            "velocidadeResultAcertos"
        );


    const velocidadeResultErros =
        document.getElementById(
            "velocidadeResultErros"
        );


    const velocidadeResultErrors =
        document.getElementById(
            "velocidadeResultErrors"
        );


    const btnRepetirVelocidade =
        document.getElementById(
            "btnRepetirVelocidade"
        );


    const btnCentralVelocidade =
        document.getElementById(
            "btnCentralVelocidade"
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


    const homePalacio =
        document.querySelector(
            ".home-palacio"
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
    // MOTOR DE DOMÍNIO — MEMÓRIA NUMÉRICA
    //
    // Mantém o progresso de cada associação separado
    // do banco oficial de memórias.
    // =====================================================

    const CHAVE_DOMINIO_MEMORIA =
        "palacioMentalDominioMemoria";


    let dominioMemoria =
        carregarDominioMemoria();


    // =====================================================
    // CRIAR REGISTRO PADRÃO
    // =====================================================

    function criarRegistroDominio() {

        return {
            pontos: 0,
            acertos: 0,
            erros: 0
        };

    }


    // =====================================================
    // CARREGAR DOMÍNIO SALVO
    // =====================================================

    function carregarDominioMemoria() {

        try {

            const dadosSalvos =
                localStorage.getItem(
                    CHAVE_DOMINIO_MEMORIA
                );


            if (!dadosSalvos) {

                return {};

            }


            const dadosConvertidos =
                JSON.parse(
                    dadosSalvos
                );


            if (
                !dadosConvertidos ||
                typeof dadosConvertidos !== "object" ||
                Array.isArray(dadosConvertidos)
            ) {

                return {};

            }


            return dadosConvertidos;

        } catch (erro) {

            console.error(
                "Erro ao carregar domínio da memória:",
                erro
            );

            return {};

        }

    }


    // =====================================================
    // SALVAR DOMÍNIO
    // =====================================================

    function salvarDominioMemoria() {

        try {

            localStorage.setItem(
                CHAVE_DOMINIO_MEMORIA,
                JSON.stringify(
                    dominioMemoria
                )
            );

        } catch (erro) {

            console.error(
                "Erro ao salvar domínio da memória:",
                erro
            );

        }

    }


    // =====================================================
    // OBTER DOMÍNIO DE UM NÚMERO
    // =====================================================

    function obterDominioNumero(
        numero
    ) {

        const chave =
            String(
                numero
            );


        if (
            !dominioMemoria[chave]
        ) {

            dominioMemoria[chave] =
                criarRegistroDominio();

        }


        return dominioMemoria[chave];

    }


    // =====================================================
    // CLASSIFICAR NÍVEL DE DOMÍNIO
    // =====================================================

    function obterNivelDominio(
        pontos
    ) {

        const pontuacao =
            Math.max(
                0,
                Math.min(
                    100,
                    Number(pontos) || 0
                )
            );


        if (
            pontuacao >= 80
        ) {

            return "dominado";

        }


        if (
            pontuacao >= 60
        ) {

            return "forte";

        }


        if (
            pontuacao >= 40
        ) {

            return "fixando";

        }


        if (
            pontuacao >= 20
        ) {

            return "aprendendo";

        }


        return "novo";

    }


    // =====================================================
    // PESOS DAS ATIVIDADES — DOMÍNIO
    // =====================================================

    const pesosDominio = {

        fixar: {
            acerto: 3,
            erro: -2
        },

        treinoRapido: {
            acerto: 4,
            erro: -3
        },

        desafiar: {
            acerto: 6,
            erro: -4
        },

        velocidade: {
            acerto: 7,
            erro: -5
        }

    };


    // =====================================================
    // REGISTRAR RESULTADO NO DOMÍNIO
    // =====================================================

    function registrarResultadoDominio(
        numero,
        atividade,
        acertou
    ) {

        const pesoAtividade =
            pesosDominio[
                atividade
            ];


        if (!pesoAtividade) {

            console.warn(
                "Atividade sem peso de domínio:",
                atividade
            );

            return null;

        }


        const registro =
            obterDominioNumero(
                numero
            );


        const variacao =
            acertou
                ? pesoAtividade.acerto
                : pesoAtividade.erro;


        registro.pontos =
            Math.max(
                0,
                Math.min(
                    100,
                    registro.pontos +
                    variacao
                )
            );


        if (acertou) {

            registro.acertos++;

        } else {

            registro.erros++;

        }


        salvarDominioMemoria();


        return {
            numero: numero,
            pontos: registro.pontos,
            acertos: registro.acertos,
            erros: registro.erros,
            nivel: obterNivelDominio(
                registro.pontos
            )
        };

    }


    // =====================================================
    // ATUALIZAR MAPA DE DOMÍNIO — CENTRAL
    // =====================================================

    function atualizarMapaDominio() {

        const memoriaCentralDominados =
            document.getElementById(
                "memoriaCentralDominados"
            );

        const memoriaCentralPercentual =
            document.getElementById(
                "memoriaCentralPercentual"
            );

        const memoriaCentralBarra =
            document.getElementById(
                "memoriaCentralBarra"
            );

        const faixasDominio =
            document.querySelectorAll(
                ".memory-range-card[data-dominio-inicio]"
            );


        // =============================================
        // TOTAL GERAL DE NÚMEROS DOMINADOS
        // =============================================

        let totalDominados =
            0;


        bancoMemoria.forEach(
            memoria => {

                const registro =
                    obterDominioNumero(
                        memoria.numero
                    );


                if (
                    registro.pontos >= 80
                ) {

                    totalDominados++;

                }

            }
        );


        const totalMemorias =
            bancoMemoria.length;


        const percentual =
            totalMemorias > 0
                ? Math.round(
                    (
                        totalDominados /
                        totalMemorias
                    ) * 100
                )
                : 0;


        // =============================================
        // PAINEL SUPERIOR
        // =============================================

        if (
            memoriaCentralDominados
        ) {

            memoriaCentralDominados.textContent =
                totalDominados;

        }


        if (
            memoriaCentralPercentual
        ) {

            memoriaCentralPercentual.textContent =
                `${percentual}%`;

        }


        if (
            memoriaCentralBarra
        ) {

            memoriaCentralBarra.style.width =
                `${percentual}%`;

        }


        // =============================================
        // MAPA DAS FAIXAS
        // =============================================

        faixasDominio.forEach(
            faixa => {

                const inicio =
                    Number(
                        faixa.dataset.dominioInicio
                    );

                const fim =
                    Number(
                        faixa.dataset.dominioFim
                    );


                const memoriasDaFaixa =
                    bancoMemoria.filter(
                        memoria =>
                            memoria.numero >= inicio &&
                            memoria.numero <= fim
                    );


                const dominadosNaFaixa =
                    memoriasDaFaixa.filter(
                        memoria => {

                            const registro =
                                obterDominioNumero(
                                    memoria.numero
                                );


                            return (
                                registro.pontos >= 80
                            );

                        }
                    ).length;


                // =========================================
                // CALCULA O PROGRESSO MÉDIO DA FAIXA
                // =========================================

                const totalPontosFaixa =
                    memoriasDaFaixa.reduce(
                        (
                            total,
                            memoria
                        ) => {

                            const registro =
                                obterDominioNumero(
                                    memoria.numero
                                );


                            return (
                                total +
                                registro.pontos
                            );

                        },
                        0
                    );


                const percentualFaixa =
                    memoriasDaFaixa.length > 0
                        ? Math.round(
                            totalPontosFaixa /
                            memoriasDaFaixa.length
                        )
                        : 0;


                // =========================================
                // ATUALIZA QUANTIDADE DOMINADA
                // =========================================

                const indicador =
                    faixa.querySelector(
                        ".memory-range-domain"
                    );


                if (
                    indicador
                ) {

                    indicador.textContent =
                        `${dominadosNaFaixa}/${memoriasDaFaixa.length}`;

                }


                // =========================================
                // ATUALIZA BARRA DE PROGRESSO
                // =========================================

                const barraProgresso =
                    faixa.querySelector(
                        ".memory-range-progress-fill"
                    );


                if (
                    barraProgresso
                ) {

                    barraProgresso.style.width =
                        `${percentualFaixa}%`;

                }


                // =========================================
                // ATUALIZA PERCENTUAL DA FAIXA
                // =========================================

                const valorProgresso =
                    faixa.querySelector(
                        ".memory-range-progress-value"
                    );


                if (
                    valorProgresso
                ) {

                    valorProgresso.textContent =
                        `${percentualFaixa}%`;

                }

            }
        );

    }


    // =====================================================
    // REVISÃO INTELIGENTE — IDENTIFICAR PENDÊNCIAS
    //
    // Analisa somente memórias que já possuem histórico
    // real de treinamento.
    //
    // Uma memória nunca treinada não entra na revisão.
    // =====================================================

    function obterMemoriasParaRevisao() {

        const memoriasParaRevisao =
            bancoMemoria
                .map(
                    memoria => {

                        const registro =
                            obterDominioNumero(
                                memoria.numero
                            );


                        const totalTentativas =
                            registro.acertos +
                            registro.erros;


                        // =================================
                        // IGNORA MEMÓRIAS NUNCA TREINADAS
                        // =================================

                        if (
                            totalTentativas === 0
                        ) {

                            return null;

                        }


                        // =================================
                        // MEMÓRIA AINDA PRECISA DE REVISÃO
                        //
                        // Por enquanto:
                        // abaixo de 80 pontos = pendente
                        // =================================

                        if (
                            registro.pontos >= 80
                        ) {

                            return null;

                        }


                        return {

                            numero:
                                memoria.numero,

                            palavra:
                                memoria.palavra,

                            imagem:
                                memoria.imagem,

                            pontos:
                                registro.pontos,

                            acertos:
                                registro.acertos,

                            erros:
                                registro.erros,

                            totalTentativas:
                                totalTentativas,

                            nivel:
                                obterNivelDominio(
                                    registro.pontos
                                )

                        };

                    }
                )
                .filter(
                    memoria =>
                        memoria !== null
                );


        // =============================================
        // PRIORIZAÇÃO
        //
        // 1º mais erros
        // 2º menor domínio
        // 3º menor número
        // =============================================

        memoriasParaRevisao.sort(
            (
                memoriaA,
                memoriaB
            ) => {

                if (
                    memoriaB.erros !==
                    memoriaA.erros
                ) {

                    return (
                        memoriaB.erros -
                        memoriaA.erros
                    );

                }


                if (
                    memoriaA.pontos !==
                    memoriaB.pontos
                ) {

                    return (
                        memoriaA.pontos -
                        memoriaB.pontos
                    );

                }


                return (
                    memoriaA.numero -
                    memoriaB.numero
                );

            }
        );


        return memoriasParaRevisao;

    }


    // =====================================================
    // REVISÃO INTELIGENTE — PREPARAR SESSÃO
    //
    // Cria uma nova sessão usando as memórias
    // selecionadas pelo motor de revisão.
    // =====================================================

    function iniciarRevisaoInteligente() {

        revisaoFila =
            obterMemoriasParaRevisao();


        revisaoIndiceAtual =
            0;


        revisaoAcertos =
            [];


        revisaoErros =
            [];


        // =============================================
        // NENHUMA MEMÓRIA PENDENTE
        // =============================================

        if (
            revisaoFila.length === 0
        ) {

            return false;

        }


        return true;

    }


    // =====================================================
    // REVISÃO INTELIGENTE — ATUALIZAR CONTADOR DA HOME
    // =====================================================

    function atualizarContadorRevisao() {

        const memoriasParaRevisao =
            obterMemoriasParaRevisao();


        if (
            revisoesPendentes
        ) {

            revisoesPendentes.textContent =
                memoriasParaRevisao.length;

        }

    }


    // =====================================================
    // REVISÃO INTELIGENTE — LEMBREI
    // =====================================================

    if (btnLembreiRevisao) {

        btnLembreiRevisao.addEventListener(
            "click",
            () => {

                registrarRespostaRevisao(
                    true
                );

            }
        );

    }


    // =====================================================
    // REVISÃO INTELIGENTE — NOVA REVISÃO
    // =====================================================

    if (btnNovaRevisao) {

        btnNovaRevisao.addEventListener(
            "click",
            () => {

                const revisaoDisponivel =
                    iniciarRevisaoInteligente();


                // =========================================
                // ESCONDE O RESULTADO ANTERIOR
                // =========================================

                revisaoResult.hidden =
                    true;


                // =========================================
                // EXISTEM MEMÓRIAS PARA REVISAR
                // =========================================

                if (
                    revisaoDisponivel
                ) {

                    carregarMemoriaRevisao();


                    revisaoTraining.hidden =
                        false;


                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });


                    return;

                }


                // =========================================
                // NÃO EXISTEM MAIS PENDÊNCIAS
                // =========================================

                revisaoTraining.hidden =
                    true;


                if (
                    revisaoTotalPendentes
                ) {

                    revisaoTotalPendentes.textContent =
                        "0";

                }


                if (
                    revisaoPercentual
                ) {

                    revisaoPercentual.textContent =
                        "0%";

                }


                if (
                    revisaoBarra
                ) {

                    revisaoBarra.style.width =
                        "0%";

                }

            }
        );

    }

    // =====================================================
    // REVISÃO INTELIGENTE — CARREGAR MEMÓRIA ATUAL
    // =====================================================

    function carregarMemoriaRevisao() {

        const memoriaAtual =
            revisaoFila[
                revisaoIndiceAtual
            ];


        if (
            !memoriaAtual
        ) {

            return false;

        }


        // =============================================
        // PROGRESSO DA SESSÃO
        // =============================================

        revisaoTrainingProgress.textContent =
            `${revisaoIndiceAtual + 1} / ${revisaoFila.length}`;


        // =============================================
        // PAINEL SUPERIOR
        // =============================================

        const revisaoConcluidas =
            revisaoIndiceAtual;


        const percentualRevisao =
            Math.round(
                (
                    revisaoConcluidas /
                    revisaoFila.length
                ) *
                100
            );


        if (
            revisaoTotalPendentes
        ) {

            revisaoTotalPendentes.textContent =
                revisaoFila.length;

        }


        if (
            revisaoPercentual
        ) {

            revisaoPercentual.textContent =
                `${percentualRevisao}%`;

        }


        if (
            revisaoBarra
        ) {

            revisaoBarra.style.width =
                `${percentualRevisao}%`;

        }


        // =============================================
        // NÚMERO
        // =============================================

        revisaoTrainingNumber.textContent =
            String(
                memoriaAtual.numero
            ).padStart(
                2,
                "0"
            );


        // =============================================
        // RESPOSTA
        // =============================================

        revisaoTrainingAnswerValue.textContent =
            memoriaAtual.palavra;


        // =============================================
        // ESTADO INICIAL DO CARD
        // =============================================

        revisaoTrainingAnswer.hidden =
            true;

        revisaoTrainingEvaluation.hidden =
            true;

        btnRevelarRevisao.hidden =
            false;


        return true;

    }

    // =====================================================
    // GERENCIADOR CENTRAL — MAPA DE TELAS
    // =====================================================

    const telasApp = {

        home: {
            elemento: homePalacio,
            pai: null
        },

        revisao: {
            elemento: telaRevisao,
            pai: "home"
        },

        memoriaNumerica: {
            elemento: telaMemoriaNumerica,
            pai: "home"
        },

        aprender: {
            elemento: telaAprenderMemoria,
            pai: "memoriaNumerica"
        },

        tabelaMental: {
            elemento: telaTabelaMental,
            pai: "memoriaNumerica"
        },

        fixar: {
            elemento: telaFixarMemoria,
            pai: "memoriaNumerica"
        },

        desafiar: {
            elemento: telaDesafiarMemoria,
            pai: "memoriaNumerica"
        },

        velocidade: {
            elemento: telaVelocidadeMemoria,
            pai: "memoriaNumerica"
        },

        treinoRapido: {
            elemento: telaTreinoRapido,
            pai: "memoriaNumerica"
        }

    };


    // =====================================================
    // GERENCIADOR CENTRAL — EXIBIR TELA
    // =====================================================

    function exibirTelaApp(
        nomeTela
    ) {

        const telaDestino =
            telasApp[nomeTela];


        if (
            !telaDestino ||
            !telaDestino.elemento
        ) {

            console.error(
                "Tela não encontrada:",
                nomeTela
            );

            return;

        }


        // =================================================
        // ESCONDE TODAS AS TELAS CADASTRADAS
        // =================================================

        Object.values(
            telasApp
        ).forEach(
            tela => {

                if (
                    tela.elemento
                ) {

                    tela.elemento.hidden =
                        true;

                }

            }
        );


        // =================================================
        // EXIBE SOMENTE A TELA SOLICITADA
        // =================================================

        telaDestino.elemento.hidden =
            false;


        // =============================================
        // ATUALIZA O DOMÍNIO AO EXIBIR A CENTRAL
        // =============================================

        if (
            nomeTela ===
            "memoriaNumerica"
        ) {

            atualizarMapaDominio();

        }


        // =============================================
        // ATUALIZA A REVISÃO AO EXIBIR A HOME
        // =============================================

        if (
            nomeTela ===
            "home"
        ) {

            atualizarContadorRevisao();

        }

    }


    // =====================================================
    // GERENCIADOR CENTRAL — NAVEGAR
    // =====================================================

    function navegarParaTela(
        nomeTela,
        registrarHistorico = true
    ) {

        if (
            !telasApp[nomeTela]
        ) {

            console.error(
                "Tela não cadastrada:",
                nomeTela
            );

            return;

        }


        // =================================================
        // EXIBE A TELA
        // =================================================

        exibirTelaApp(
            nomeTela
        );


        // =================================================
        // REGISTRA A TELA NO HISTÓRICO
        // =================================================

        if (registrarHistorico) {

            history.pushState(
                {
                    tela: nomeTela
                },
                "",
                window.location.href
            );

        }


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    // =====================================================
    // ABRIR MEMÓRIA NUMÉRICA
    // =====================================================

    function abrirMemoriaNumerica(
        registrarHistorico = true
    ) {

        navegarParaTela(
            "memoriaNumerica",
            registrarHistorico
        );

    }



    // =====================================================
    // ABRIR FIXAR
    // =====================================================

    function abrirFixarMemoria(
        registrarHistorico = true
    ) {

        // =================================================
        // NAVEGA PARA FIXAR
        // =================================================

        navegarParaTela(
            "fixar",
            registrarHistorico
        );


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

    }

    // =====================================================
    // ABRIR DESAFIAR
    // =====================================================

    function abrirDesafiarMemoria(
        registrarHistorico = true
    ) {

        // =================================================
        // NAVEGA PARA DESAFIAR
        // =================================================

        navegarParaTela(
            "desafiar",
            registrarHistorico
        );


        // =================================================
        // CARREGA A PRIMEIRA MEMÓRIA DA FAIXA ATUAL
        // =================================================

        carregarMemoriaDesafiar(
            desafiarInicioAtual
        );

    }


    // =====================================================
    // EMBARALHAR ITENS — TREINO RÁPIDO
    // =====================================================

    function embaralharTreinoRapido(
        itens
    ) {

        const lista =
            [...itens];


        for (
            let i = lista.length - 1;
            i > 0;
            i--
        ) {

            const j =
                Math.floor(
                    Math.random() *
                    (i + 1)
                );


            [
                lista[i],
                lista[j]
            ] =
                [
                    lista[j],
                    lista[i]
                ];

        }


        return lista;

    }


    // =====================================================
    // INICIAR TREINO RÁPIDO
    // =====================================================

    function iniciarTreinoRapido() {

        treinoRapidoFila =
            embaralharTreinoRapido(
                bancoMemoria
            ).slice(
                0,
                Math.min(
                    10,
                    bancoMemoria.length
                )
            );


        treinoRapidoIndiceAtual =
            0;

        treinoRapidoAcertos =
            [];

        treinoRapidoErros =
            [];


        treinoRapidoIntro.hidden =
            true;

        treinoRapidoTraining.hidden =
            false;


        carregarDesafioTreinoRapido();

    }


    // =====================================================
    // CARREGAR DESAFIO — TREINO RÁPIDO
    // =====================================================

    function carregarDesafioTreinoRapido() {

        const memoria =
            treinoRapidoFila[
                treinoRapidoIndiceAtual
            ];


        if (!memoria) {

            return;

        }


        const totalDesafios =
            treinoRapidoFila.length;


        treinoRapidoProgress.textContent =
            `${String(
                treinoRapidoIndiceAtual + 1
            ).padStart(
                2,
                "0"
            )} / ${String(
                totalDesafios
            ).padStart(
                2,
                "0"
            )}`;


        treinoRapidoAnswer.hidden =
            true;

        treinoRapidoEvaluation.hidden =
            true;

        btnRevelarTreinoRapido.hidden =
            false;


        const modoImagem =
            Math.random() < 0.5;


        if (modoImagem) {

            treinoRapidoMode.textContent =
                "IMAGEM → NÚMERO";

            treinoRapidoQuestionLabel.textContent =
                "QUAL É O NÚMERO?";


            treinoRapidoNumber.hidden =
                true;

            treinoRapidoImageArea.hidden =
                false;


            treinoRapidoImage.src =
                memoria.imagem;

            treinoRapidoImage.alt =
                `Associação ${memoria.palavra}`;


            treinoRapidoAnswerLabel.textContent =
                "NÚMERO";

            treinoRapidoAnswerValue.textContent =
                String(
                    memoria.numero
                ).padStart(
                    2,
                    "0"
                );

        } else {

            treinoRapidoMode.textContent =
                "NÚMERO → ASSOCIAÇÃO";

            treinoRapidoQuestionLabel.textContent =
                "QUAL É A ASSOCIAÇÃO?";


            treinoRapidoImageArea.hidden =
                true;

            treinoRapidoNumber.hidden =
                false;


            treinoRapidoNumber.textContent =
                String(
                    memoria.numero
                ).padStart(
                    2,
                    "0"
                );


            treinoRapidoAnswerLabel.textContent =
                "ASSOCIAÇÃO";

            treinoRapidoAnswerValue.textContent =
                memoria.palavra;

        }

    }


    // =====================================================
    // ABRIR TREINO RÁPIDO
    // =====================================================

    function abrirTreinoRapido(
        registrarHistorico = true
    ) {

        // =================================================
        // NAVEGA PARA O TREINO RÁPIDO
        // =================================================

        navegarParaTela(
            "treinoRapido",
            registrarHistorico
        );


        // =================================================
        // RESTAURA O ESTADO INICIAL DO TREINO RÁPIDO
        // =================================================

        treinoRapidoIntro.hidden =
            false;

        treinoRapidoTraining.hidden =
            true;

        treinoRapidoResult.hidden =
            true;

        treinoRapidoAnswer.hidden =
            true;

        treinoRapidoEvaluation.hidden =
            true;

        btnRevelarTreinoRapido.hidden =
            false;

    }


    // =====================================================
    // ABRIR VELOCIDADE
    // =====================================================

    function abrirVelocidadeMemoria(
        registrarHistorico = true
    ) {

        // =================================================
        // NAVEGA PARA VELOCIDADE
        // =================================================

        navegarParaTela(
            "velocidade",
            registrarHistorico
        );


        // =================================================
        // RESTAURA A TELA INICIAL DA VELOCIDADE
        // =================================================

        velocidadeResult.hidden =
            true;

        velocidadeTrainingArea.hidden =
            true;

        velocidadeConfig.hidden =
            false;

    }



    // =====================================================
    // INICIAR TREINO — VELOCIDADE
    // =====================================================

    function iniciarTreinoVelocidade() {

        // =================================================
        // REINICIA OS RESULTADOS DA SESSÃO
        // =================================================

        velocidadeAcertos =
            [];

        velocidadeErros =
            [];


        // =================================================
        // MONTA A FILA COM OS NÚMEROS DA FAIXA
        // =================================================

        velocidadeFila =
            [];


        for (
            let numero = velocidadeInicioAtual;
            numero <= velocidadeFimAtual;
            numero++
        ) {

            velocidadeFila.push(
                numero
            );

        }

        // =================================================
        // EMBARALHA A FILA
        //
        // Cada número aparece apenas uma vez.
        // =================================================

        for (
            let indice = velocidadeFila.length - 1;
            indice > 0;
            indice--
        ) {

            const indiceAleatorio =
                Math.floor(
                    Math.random() *
                    (indice + 1)
                );


            [
                velocidadeFila[indice],
                velocidadeFila[indiceAleatorio]
            ] =
                [
                    velocidadeFila[indiceAleatorio],
                    velocidadeFila[indice]
                ];

        }


        // =================================================
        // COMEÇA PELA PRIMEIRA POSIÇÃO
        // =================================================

        velocidadeIndiceAtual =
            0;


        const numeroInicial =
            velocidadeFila[
            velocidadeIndiceAtual
            ];


        // =================================================
        // MOSTRA A ÁREA DO TREINO
        // =================================================

        velocidadeConfig.hidden =
            true;

        velocidadeResult.hidden =
            true;

        velocidadeTrainingArea.hidden =
            false;


        // =================================================
        // REINICIA OS CONTROLES DA RODADA
        // =================================================

        velocidadeAnswer.hidden =
            true;

        velocidadeEvaluation.hidden =
            true;

        btnRevelarVelocidade.hidden =
            false;

        velocidadeTimeoutMessage.hidden =
            true;


        // =================================================
        // REINICIA NÚMERO E IMAGEM
        // =================================================

        velocidadeAnswerImageArea.hidden =
            true;


        velocidadeAnswerImage.removeAttribute(
            "src"
        );


        velocidadeAnswerImage.alt =
            "";


        velocidadeNumber.hidden =
            false;


        // =================================================
        // TEMPO ESCOLHIDO
        // =================================================

        velocidadeTrainingTime.textContent =
            `${velocidadeTempoAtual}s`;


        // =================================================
        // NÚMERO SORTEADO
        // =================================================

        velocidadeNumber.textContent =
            String(
                numeroInicial
            ).padStart(
                2,
                "0"
            );


        // =================================================
        // PROGRESSO
        // =================================================

        velocidadeProgress.textContent =
            `01 / ${String(
                velocidadeFila.length
            ).padStart(
                2,
                "0"
            )}`;


        // =================================================
        // INICIA O CRONÔMETRO
        // =================================================

        if (
            velocidadeIntervaloAtual
        ) {

            clearInterval(
                velocidadeIntervaloAtual
            );

            velocidadeIntervaloAtual =
                null;

        }


        velocidadeTempoRestante =
            velocidadeTempoAtual;


        velocidadeTimer.textContent =
            velocidadeTempoRestante;


        velocidadeIntervaloAtual =
            setInterval(
                () => {

                    velocidadeTempoRestante--;


                    velocidadeTimer.textContent =
                        velocidadeTempoRestante;


                    // =========================================
                    // TEMPO ESGOTADO
                    // =========================================

                    if (
                        velocidadeTempoRestante <= 0
                    ) {

                        clearInterval(
                            velocidadeIntervaloAtual
                        );


                        velocidadeIntervaloAtual =
                            null;


                        velocidadeTempoRestante =
                            0;


                        velocidadeTimer.textContent =
                            "0";


                        // =====================================
                        // MOSTRA O AVISO DE TEMPO ESGOTADO
                        // =====================================

                        velocidadeTimeoutMessage.hidden =
                            false;


                        // =====================================
                        // IDENTIFICA O NÚMERO ATUAL
                        // =====================================

                        const numeroAtual =
                            velocidadeFila[
                            velocidadeIndiceAtual
                            ];


                        // =====================================
                        // REGISTRA COMO ERRO
                        // =====================================

                        velocidadeErros.push(
                            numeroAtual
                        );


                        // =====================================
                        // REGISTRA O TEMPO ESGOTADO
                        // NO MOTOR DE DOMÍNIO
                        //
                        // TEMPO ESGOTADO:
                        // -5 pontos
                        // =====================================

                        registrarResultadoDominio(
                            numeroAtual,
                            "velocidade",
                            false
                        );


                        // =====================================
                        // LOCALIZA A ASSOCIAÇÃO
                        // =====================================

                        const memoriaAtual =
                            bancoMemoria.find(
                                memoria =>
                                    Number(
                                        memoria.numero
                                    ) ===
                                    Number(
                                        numeroAtual
                                    )
                            );


                        // =====================================
                        // REVELA A RESPOSTA
                        // =====================================

                        if (
                            memoriaAtual
                        ) {

                            velocidadeAnswerWord.textContent =
                                memoriaAtual.palavra.toUpperCase();


                            // =================================
                            // MOSTRA A IMAGEM NO LUGAR
                            // DO NÚMERO
                            // =================================

                            if (
                                memoriaAtual.imagem
                            ) {

                                velocidadeAnswerImage.src =
                                    memoriaAtual.imagem;


                                velocidadeAnswerImage.alt =
                                    `Associação ${memoriaAtual.palavra}`;


                                velocidadeNumber.hidden =
                                    true;


                                velocidadeAnswerImageArea.hidden =
                                    false;

                            } else {

                                velocidadeAnswerImage.removeAttribute(
                                    "src"
                                );


                                velocidadeAnswerImage.alt =
                                    "";


                                velocidadeAnswerImageArea.hidden =
                                    true;


                                velocidadeNumber.hidden =
                                    false;

                            }


                            velocidadeAnswer.hidden =
                                false;

                        }


                        // =====================================
                        // ESCONDE OS CONTROLES DE RESPOSTA
                        // =====================================

                        btnRevelarVelocidade.hidden =
                            true;


                        velocidadeEvaluation.hidden =
                            true;


                        // =====================================
                        // AGUARDA A VISUALIZAÇÃO DA RESPOSTA
                        // E SEGUE AUTOMATICAMENTE
                        // =====================================

                        velocidadeTimeoutAvancoAtual =
                            setTimeout(
                                () => {

                                    velocidadeTimeoutAvancoAtual =
                                        null;


                                    proximaRodadaVelocidade();

                                },
                                1800
                            );

                    }

                },
                1000
            );


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    // =====================================================
    // REVELAR RESPOSTA — VELOCIDADE
    // =====================================================

    function revelarRespostaVelocidade() {

        // =================================================
        // PARA O CRONÔMETRO
        // =================================================

        if (
            velocidadeIntervaloAtual
        ) {

            clearInterval(
                velocidadeIntervaloAtual
            );


            velocidadeIntervaloAtual =
                null;

        }


        // =================================================
        // DESCOBRE O NÚMERO ATUAL
        // =================================================

        const numeroAtual =
            velocidadeFila[
            velocidadeIndiceAtual
            ];


        // =================================================
        // PROCURA A ASSOCIAÇÃO NO BANCO OFICIAL
        // =================================================

        const memoriaAtual =
            bancoMemoria.find(
                memoria =>
                    Number(
                        memoria.numero
                    ) ===
                    Number(
                        numeroAtual
                    )
            );


        if (
            !memoriaAtual
        ) {

            console.error(
                "Associação não encontrada para o número:",
                numeroAtual
            );


            return;

        }


        // =================================================
        // MOSTRA A PALAVRA CORRETA
        // =================================================

        velocidadeAnswerWord.textContent =
            memoriaAtual.palavra.toUpperCase();


        // =================================================
        // MOSTRA A IMAGEM NO LUGAR DO NÚMERO
        // =================================================

        if (
            memoriaAtual.imagem
        ) {

            velocidadeAnswerImage.src =
                memoriaAtual.imagem;


            velocidadeAnswerImage.alt =
                `Associação ${memoriaAtual.palavra}`;


            velocidadeNumber.hidden =
                true;


            velocidadeAnswerImageArea.hidden =
                false;

        } else {

            velocidadeAnswerImage.removeAttribute(
                "src"
            );


            velocidadeAnswerImage.alt =
                "";


            velocidadeAnswerImageArea.hidden =
                true;


            velocidadeNumber.hidden =
                false;

        }


        velocidadeAnswer.hidden =
            false;


        // =================================================
        // ESCONDE O BOTÃO DE REVELAR
        // =================================================

        btnRevelarVelocidade.hidden =
            true;


        // =================================================
        // MOSTRA A AVALIAÇÃO
        // =================================================

        velocidadeEvaluation.hidden =
            false;

    }


    // =====================================================
    // PRÓXIMA RODADA — VELOCIDADE
    // =====================================================

    function proximaRodadaVelocidade() {

        // =================================================
        // AVANÇA NA FILA
        // =================================================

        velocidadeIndiceAtual++;


        // =================================================
        // VERIFICA SE A RODADA TERMINOU
        // =================================================

        if (
            velocidadeIndiceAtual >=
            velocidadeFila.length
        ) {

            // =============================================
            // GARANTE QUE O CRONÔMETRO ESTEJA ENCERRADO
            // =============================================

            if (
                velocidadeIntervaloAtual
            ) {

                clearInterval(
                    velocidadeIntervaloAtual
                );


                velocidadeIntervaloAtual =
                    null;

            }


            // =============================================
            // ESCONDE OS CONTROLES DA RODADA
            // =============================================

            velocidadeAnswer.hidden =
                true;


            velocidadeEvaluation.hidden =
                true;


            btnRevelarVelocidade.hidden =
                true;


            velocidadeTimeoutMessage.hidden =
                true;


            velocidadeAnswerImageArea.hidden =
                true;


            velocidadeNumber.hidden =
                false;


            // =============================================
            // CALCULA O APROVEITAMENTO
            // =============================================

            const totalQuestoes =
                velocidadeFila.length;


            const totalAcertos =
                velocidadeAcertos.length;


            const totalErros =
                velocidadeErros.length;


            const percentualAcertos =
                totalQuestoes > 0
                    ? Math.round(
                        (
                            totalAcertos /
                            totalQuestoes
                        ) * 100
                    )
                    : 0;


            // =============================================
            // ATUALIZA O RESULTADO
            // =============================================

            velocidadeResultPercent.textContent =
                `${percentualAcertos}%`;


            velocidadeResultAcertos.textContent =
                totalAcertos;


            velocidadeResultErros.textContent =
                totalErros;


            // =============================================
            // LIMPA A LISTA DE REFORÇO
            // =============================================

            velocidadeResultErrors.innerHTML =
                "";


            // =============================================
            // MONTA A LISTA DOS NÚMEROS QUE PRECISAM
            // SER REFORÇADOS
            // =============================================

            velocidadeErros.forEach(
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


                    if (
                        !memoria
                    ) {

                        return;

                    }


                    const itemErro =
                        document.createElement(
                            "div"
                        );


                    itemErro.className =
                        "velocidade-result-error";


                    const numeroErro =
                        document.createElement(
                            "span"
                        );


                    numeroErro.className =
                        "velocidade-result-error-number";


                    numeroErro.textContent =
                        String(
                            numero
                        ).padStart(
                            2,
                            "0"
                        );


                    const palavraErro =
                        document.createElement(
                            "strong"
                        );


                    palavraErro.className =
                        "velocidade-result-error-word";


                    palavraErro.textContent =
                        memoria.palavra.toUpperCase();


                    itemErro.appendChild(
                        numeroErro
                    );


                    itemErro.appendChild(
                        palavraErro
                    );


                    velocidadeResultErrors.appendChild(
                        itemErro
                    );

                }
            );


            // =============================================
            // CASO NÃO TENHA NENHUM ERRO
            // =============================================

            if (
                velocidadeErros.length === 0
            ) {

                const mensagemPerfeita =
                    document.createElement(
                        "div"
                    );


                mensagemPerfeita.className =
                    "velocidade-result-error";


                const textoPerfeito =
                    document.createElement(
                        "strong"
                    );


                textoPerfeito.className =
                    "velocidade-result-error-word";


                textoPerfeito.textContent =
                    "Nenhuma associação para reforçar nesta rodada.";


                mensagemPerfeita.appendChild(
                    textoPerfeito
                );


                velocidadeResultErrors.appendChild(
                    mensagemPerfeita
                );

            }


            // =============================================
            // TROCA O TREINO PELA TELA DE RESULTADO
            // =============================================

            velocidadeTrainingArea.hidden =
                true;


            velocidadeResult.hidden =
                false;


            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });


            // =============================================
            // REGISTRA O RESULTADO DA SESSÃO
            // =============================================

            console.log(
                "Treino de Velocidade concluído."
            );


            console.log(
                "Acertos:",
                velocidadeAcertos
            );


            console.log(
                "Erros:",
                velocidadeErros
            );


            console.log(
                "Total de acertos:",
                totalAcertos
            );


            console.log(
                "Total de erros:",
                totalErros
            );


            console.log(
                "Aproveitamento:",
                `${percentualAcertos}%`
            );


            return;

        }


        // =================================================
        // PEGA O PRÓXIMO NÚMERO
        // =================================================

        const proximoNumero =
            velocidadeFila[
            velocidadeIndiceAtual
            ];


        // =================================================
        // REINICIA O ESTADO VISUAL DA RODADA
        // =================================================

        velocidadeAnswer.hidden =
            true;


        velocidadeEvaluation.hidden =
            true;


        btnRevelarVelocidade.hidden =
            false;


        velocidadeTimeoutMessage.hidden =
            true;


        velocidadeAnswerImageArea.hidden =
            true;


        velocidadeAnswerImage.removeAttribute(
            "src"
        );


        velocidadeAnswerImage.alt =
            "";


        velocidadeNumber.hidden =
            false;


        // =================================================
        // MOSTRA O PRÓXIMO NÚMERO
        // =================================================

        velocidadeNumber.textContent =
            String(
                proximoNumero
            ).padStart(
                2,
                "0"
            );


        // =================================================
        // ATUALIZA O PROGRESSO
        // =================================================

        velocidadeProgress.textContent =
            `${String(
                velocidadeIndiceAtual + 1
            ).padStart(
                2,
                "0"
            )} / ${String(
                velocidadeFila.length
            ).padStart(
                2,
                "0"
            )}`;


        // =================================================
        // REINICIA O CRONÔMETRO
        // =================================================

        if (
            velocidadeIntervaloAtual
        ) {

            clearInterval(
                velocidadeIntervaloAtual
            );


            velocidadeIntervaloAtual =
                null;

        }


        velocidadeTempoRestante =
            velocidadeTempoAtual;


        velocidadeTimer.textContent =
            velocidadeTempoRestante;


        velocidadeIntervaloAtual =
            setInterval(
                () => {

                    velocidadeTempoRestante--;


                    velocidadeTimer.textContent =
                        velocidadeTempoRestante;


                    // =========================================
                    // TEMPO ESGOTADO
                    // =========================================

                    if (
                        velocidadeTempoRestante <= 0
                    ) {

                        clearInterval(
                            velocidadeIntervaloAtual
                        );


                        velocidadeIntervaloAtual =
                            null;


                        velocidadeTempoRestante =
                            0;


                        velocidadeTimer.textContent =
                            "0";


                        // =====================================
                        // MOSTRA O AVISO DE TEMPO ESGOTADO
                        // =====================================

                        velocidadeTimeoutMessage.hidden =
                            false;


                        // =====================================
                        // IDENTIFICA O NÚMERO ATUAL
                        // =====================================

                        const numeroAtual =
                            velocidadeFila[
                            velocidadeIndiceAtual
                            ];


                        // =====================================
                        // REGISTRA COMO ERRO
                        // =====================================

                        velocidadeErros.push(
                            numeroAtual
                        );


                        // =====================================
                        // LOCALIZA A ASSOCIAÇÃO
                        // =====================================

                        const memoriaAtual =
                            bancoMemoria.find(
                                memoria =>
                                    Number(
                                        memoria.numero
                                    ) ===
                                    Number(
                                        numeroAtual
                                    )
                            );


                        // =====================================
                        // REVELA A RESPOSTA
                        // =====================================

                        if (
                            memoriaAtual
                        ) {

                            velocidadeAnswerWord.textContent =
                                memoriaAtual.palavra.toUpperCase();


                            // =================================
                            // MOSTRA A IMAGEM NO LUGAR
                            // DO NÚMERO
                            // =================================

                            if (
                                memoriaAtual.imagem
                            ) {

                                velocidadeAnswerImage.src =
                                    memoriaAtual.imagem;


                                velocidadeAnswerImage.alt =
                                    `Associação ${memoriaAtual.palavra}`;


                                velocidadeNumber.hidden =
                                    true;


                                velocidadeAnswerImageArea.hidden =
                                    false;

                            } else {

                                velocidadeAnswerImage.removeAttribute(
                                    "src"
                                );


                                velocidadeAnswerImage.alt =
                                    "";


                                velocidadeAnswerImageArea.hidden =
                                    true;


                                velocidadeNumber.hidden =
                                    false;

                            }


                            velocidadeAnswer.hidden =
                                false;

                        }


                        // =====================================
                        // ESCONDE OS CONTROLES DE RESPOSTA
                        // =====================================

                        btnRevelarVelocidade.hidden =
                            true;


                        velocidadeEvaluation.hidden =
                            true;


                        // =====================================
                        // AGUARDA A VISUALIZAÇÃO DA RESPOSTA
                        // E SEGUE AUTOMATICAMENTE
                        // =====================================

                        velocidadeTimeoutAvancoAtual =
                            setTimeout(
                                () => {

                                    velocidadeTimeoutAvancoAtual =
                                        null;


                                    proximaRodadaVelocidade();

                                },
                                1800
                            );

                    }

                },
                1000
            );

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
        // REGISTRA O RESULTADO NO MOTOR DE DOMÍNIO
        //
        // ACERTO:
        // +6 pontos
        //
        // ERRO:
        // -4 pontos
        // =================================================

        registrarResultadoDominio(
            desafiarNumeroAtual,
            "desafiar",
            acertou
        );


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

    function abrirTabelaMental(
        registrarHistorico = true
    ) {

        // =================================================
        // NAVEGA PARA A TABELA MENTAL
        // =================================================

        navegarParaTela(
            "tabelaMental",
            registrarHistorico
        );


        // =================================================
        // CARREGA INICIALMENTE A FAIXA 01–10
        // =================================================

        gerarTabelaMental(
            1,
            10
        );

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

    function abrirAprendizado(
        registrarHistorico = true
    ) {

        // =================================================
        // NAVEGA PARA APRENDER
        // =================================================

        navegarParaTela(
            "aprender",
            registrarHistorico
        );


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

    }


    //=================================
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

        // =================================================
        // ESCONDE A CENTRAL DA MEMÓRIA NUMÉRICA
        // =================================================

        telaMemoriaNumerica.hidden =
            true;


        // =================================================
        // GARANTE QUE TODAS AS TELAS INTERNAS ESTEJAM FECHADAS
        // =================================================

        telaAprenderMemoria.hidden =
            true;


        telaTabelaMental.hidden =
            true;


        telaFixarMemoria.hidden =
            true;


        telaDesafiarMemoria.hidden =
            true;


        telaVelocidadeMemoria.hidden =
            true;


        // =================================================
        // EXIBE SOMENTE A HOME
        // =================================================

        homePalacio.hidden =
            false;


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

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


    // =====================================================
    // ABRIR REVISÃO INTELIGENTE
    // =====================================================

    if (btnRevisao) {

        btnRevisao.addEventListener(
            "click",
            () => {

                navegarParaTela(
                    "revisao"
                );


                const revisaoDisponivel =
                    iniciarRevisaoInteligente();


                // =========================================
                // EXISTEM MEMÓRIAS PARA REVISAR
                // =========================================

                if (
                    revisaoDisponivel
                ) {

                    carregarMemoriaRevisao();

                    revisaoTraining.hidden =
                        false;

                }


                // =========================================
                // NENHUMA MEMÓRIA PARA REVISAR
                // =========================================

                else {

                    revisaoTraining.hidden =
                        true;

                }

            }
        );

    }


    // =====================================================
    // VOLTAR — REVISÃO INTELIGENTE
    // =====================================================

    if (btnVoltarRevisao) {

        btnVoltarRevisao.addEventListener(
            "click",
            () => {

                history.back();

            }
        );

    }


    // =====================================================
    // REVISÃO INTELIGENTE — REVELAR RESPOSTA
    // =====================================================

    if (btnRevelarRevisao) {

        btnRevelarRevisao.addEventListener(
            "click",
            () => {

                revisaoTrainingAnswer.hidden =
                    false;


                revisaoTrainingEvaluation.hidden =
                    false;


                btnRevelarRevisao.hidden =
                    true;

            }
        );

    }


    // =====================================================
    // REVISÃO INTELIGENTE — NÃO LEMBREI
    // =====================================================

    if (btnNaoLembreiRevisao) {

        btnNaoLembreiRevisao.addEventListener(
            "click",
            () => {

                registrarRespostaRevisao(
                    false
                );

            }
        );

    }


    // =====================================================
    // REVISÃO INTELIGENTE — LEMBREI
    // =====================================================

    if (btnLembreiRevisao) {

        btnLembreiRevisao.addEventListener(
            "click",
            () => {

                registrarRespostaRevisao(
                    true
                );

            }
        );

    }


    if (btnVoltarHome) {

        btnVoltarHome.addEventListener(
            "click",
            () => {

                history.back();

            }
        );

    }


    // =====================================================
    // VOLTAR DO ANDROID / NAVEGADOR
    // =====================================================

    window.addEventListener(
        "popstate",
        () => {

            // =============================================
            // DESCOBRE QUAL TELA ESTÁ ABERTA
            // =============================================

            const entradaTelaAtual =
                Object.entries(
                    telasApp
                ).find(
                    ([nomeTela, dadosTela]) => {

                        return (
                            dadosTela.elemento &&
                            !dadosTela.elemento.hidden
                        );

                    }
                );


            if (!entradaTelaAtual) {

                return;

            }


            const [
                nomeTelaAtual,
                dadosTelaAtual
            ] =
                entradaTelaAtual;


            // =============================================
            // HOME NÃO POSSUI TELA PAI
            // =============================================

            if (
                nomeTelaAtual === "home" ||
                !dadosTelaAtual.pai
            ) {

                return;

            }


            // =============================================
            // VOLTA AUTOMATICAMENTE PARA A TELA PAI
            // =============================================

            navegarParaTela(
                dadosTelaAtual.pai,
                false
            );

        }
    );


    if (btnIniciarAprendizado) {

        btnIniciarAprendizado.addEventListener(
            "click",
            abrirAprendizado
        );

    }


    // =====================================================
    // ABRIR TREINO RÁPIDO
    // =====================================================

    if (btnMemoriaTreinoRapido) {

        btnMemoriaTreinoRapido.addEventListener(
            "click",
            abrirTreinoRapido
        );

    }


    // =====================================================
    // INICIAR TREINO RÁPIDO
    // =====================================================

    if (btnIniciarTreinoRapido) {

        btnIniciarTreinoRapido.addEventListener(
            "click",
            iniciarTreinoRapido
        );

    }


    // =====================================================
    // TREINAR NOVAMENTE — TREINO RÁPIDO
    // =====================================================

    if (btnReiniciarTreinoRapido) {

        btnReiniciarTreinoRapido.addEventListener(
            "click",
            () => {

                treinoRapidoResult.hidden =
                    true;


                iniciarTreinoRapido();

            }
        );

    }


    // =====================================================
    // VOLTAR À CENTRAL — TREINO RÁPIDO
    // =====================================================

    if (btnFinalizarTreinoRapido) {

        btnFinalizarTreinoRapido.addEventListener(
            "click",
            () => {

                history.back();

            }
        );

    }


    // =====================================================
    // MOSTRAR RESPOSTA — TREINO RÁPIDO
    // =====================================================

    if (btnRevelarTreinoRapido) {

        btnRevelarTreinoRapido.addEventListener(
            "click",
            () => {

                treinoRapidoAnswer.hidden =
                    false;

                treinoRapidoEvaluation.hidden =
                    false;

                btnRevelarTreinoRapido.hidden =
                    true;

            }
        );

    }


    // =====================================================
    // MOSTRAR RESULTADO — TREINO RÁPIDO
    // =====================================================

    function mostrarResultadoTreinoRapido() {

        const totalDesafios =
            treinoRapidoFila.length;


        const totalAcertos =
            treinoRapidoAcertos.length;


        const totalErros =
            treinoRapidoErros.length;


        const percentual =
            totalDesafios > 0
                ? Math.round(
                    (
                        totalAcertos /
                        totalDesafios
                    ) * 100
                )
                : 0;


        // =================================================
        // ATUALIZA OS NÚMEROS DO RESULTADO
        // =================================================

        treinoRapidoPercentual.textContent =
            `${percentual}%`;


        treinoRapidoTotalAcertos.textContent =
            totalAcertos;


        treinoRapidoTotalErros.textContent =
            totalErros;


        // =================================================
        // LIMPA A LISTA DE NÚMEROS PARA REFORÇAR
        // =================================================

        treinoRapidoWeakList.innerHTML =
            "";


        // =================================================
        // EXIBE OS NÚMEROS QUE O USUÁRIO NÃO LEMBROU
        // =================================================

        if (
            treinoRapidoErros.length > 0
        ) {

            treinoRapidoWeakEmpty.hidden =
                true;


            treinoRapidoErros.forEach(
                memoria => {

                    const item =
                        document.createElement(
                            "div"
                        );


                    item.className =
                        "treino-rapido-weak-item";


                    const numero =
                        document.createElement(
                            "strong"
                        );


                    numero.textContent =
                        String(
                            memoria.numero
                        ).padStart(
                            2,
                            "0"
                        );


                    const palavra =
                        document.createElement(
                            "span"
                        );


                    palavra.textContent =
                        memoria.palavra;


                    item.appendChild(
                        numero
                    );


                    item.appendChild(
                        palavra
                    );


                    treinoRapidoWeakList.appendChild(
                        item
                    );

                }
            );

        } else {

            treinoRapidoWeakEmpty.hidden =
                false;

        }


        // =================================================
        // EXIBE O RESULTADO
        // =================================================

        treinoRapidoTraining.hidden =
            true;

        treinoRapidoIntro.hidden =
            true;

        treinoRapidoResult.hidden =
            false;


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    // =====================================================
    // REGISTRAR RESPOSTA — TREINO RÁPIDO
    // =====================================================

    function registrarRespostaTreinoRapido(
        lembrou
    ) {

        const memoriaAtual =
            treinoRapidoFila[
                treinoRapidoIndiceAtual
            ];


        if (!memoriaAtual) {

            return;

        }


        if (lembrou) {

            treinoRapidoAcertos.push(
                memoriaAtual
            );

        } else {

            treinoRapidoErros.push(
                memoriaAtual
            );

        }


        // =================================================
        // REGISTRA O RESULTADO NO MOTOR DE DOMÍNIO
        //
        // LEMBREI:
        // +4 pontos
        //
        // NÃO LEMBREI:
        // -3 pontos
        // =================================================

        registrarResultadoDominio(
            memoriaAtual.numero,
            "treinoRapido",
            lembrou
        );


        // =================================================
        // AVANÇA PARA O PRÓXIMO DESAFIO
        // =================================================

        treinoRapidoIndiceAtual++;


        // =================================================
        // VERIFICA SE A SESSÃO TERMINOU
        // =================================================

        if (
            treinoRapidoIndiceAtual >=
            treinoRapidoFila.length
        ) {

            mostrarResultadoTreinoRapido();


            return;

        }


        carregarDesafioTreinoRapido();

    }


    // =====================================================
    // NÃO LEMBREI — TREINO RÁPIDO
    // =====================================================

    if (btnNaoLembreiTreinoRapido) {

        btnNaoLembreiTreinoRapido.addEventListener(
            "click",
            () => {

                registrarRespostaTreinoRapido(
                    false
                );

            }
        );

    }


    // =====================================================
    // LEMBREI — TREINO RÁPIDO
    // =====================================================

    if (btnLembreiTreinoRapido) {

        btnLembreiTreinoRapido.addEventListener(
            "click",
            () => {

                registrarRespostaTreinoRapido(
                    true
                );

            }
        );

    }


    // =====================================================
    // VOLTAR DO TREINO RÁPIDO PARA A CENTRAL
    // =====================================================

    if (btnVoltarTreinoRapido) {

        btnVoltarTreinoRapido.addEventListener(
            "click",
            () => {

                history.back();

            }
        );

    }


    if (btnVelocidadeMemoria) {

        btnVelocidadeMemoria.addEventListener(
            "click",
            abrirVelocidadeMemoria
        );

    }


    if (btnVoltarVelocidade) {

        btnVoltarVelocidade.addEventListener(
            "click",
            () => {

                // =============================================
                // SE ESTIVER NA TELA DE RESULTADO
                // VOLTA PARA A CONFIGURAÇÃO DA VELOCIDADE
                // =============================================

                if (
                    !velocidadeResult.hidden
                ) {

                    velocidadeResult.hidden =
                        true;

                    velocidadeTrainingArea.hidden =
                        true;

                    velocidadeConfig.hidden =
                        false;


                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });


                    return;

                }


                // =============================================
                // SE ESTIVER DENTRO DO TREINO
                // VOLTA PARA A CONFIGURAÇÃO DA VELOCIDADE
                // =============================================

                if (
                    !velocidadeTrainingArea.hidden
                ) {

                    if (
                        velocidadeIntervaloAtual
                    ) {

                        clearInterval(
                            velocidadeIntervaloAtual
                        );


                        velocidadeIntervaloAtual =
                            null;

                    }


                    // =========================================
                    // CANCELA O AVANÇO AUTOMÁTICO PENDENTE
                    // =========================================

                    if (
                        velocidadeTimeoutAvancoAtual
                    ) {

                        clearTimeout(
                            velocidadeTimeoutAvancoAtual
                        );


                        velocidadeTimeoutAvancoAtual =
                            null;

                    }


                    velocidadeTrainingArea.hidden =
                        true;

                    velocidadeResult.hidden =
                        true;

                    velocidadeConfig.hidden =
                        false;


                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });


                    return;

                }


                // =============================================
                // SE JÁ ESTIVER NA CONFIGURAÇÃO
                // VOLTA PELO HISTÓRICO PARA A CENTRAL
                // =============================================

                history.back();

            }
        );

    }

    if (btnIniciarVelocidade) {

        btnIniciarVelocidade.addEventListener(
            "click",
            iniciarTreinoVelocidade
        );

    }


    if (btnRevelarVelocidade) {

        btnRevelarVelocidade.addEventListener(
            "click",
            revelarRespostaVelocidade
        );

    }


    if (btnLembreiVelocidade) {

        btnLembreiVelocidade.addEventListener(
            "click",
            () => {

                // =============================================
                // REGISTRA O NÚMERO COMO ACERTO
                // =============================================

                const numeroAtual =
                    velocidadeFila[
                    velocidadeIndiceAtual
                    ];


                velocidadeAcertos.push(
                    numeroAtual
                );


                // =============================================
                // REGISTRA O ACERTO NO MOTOR DE DOMÍNIO
                //
                // ACERTO:
                // +7 pontos
                // =============================================

                registrarResultadoDominio(
                    numeroAtual,
                    "velocidade",
                    true
                );


                // =============================================
                // AVANÇA PARA A PRÓXIMA RODADA
                // =============================================

                proximaRodadaVelocidade();

            }
        );

    }

    if (btnNaoLembreiVelocidade) {

        btnNaoLembreiVelocidade.addEventListener(
            "click",
            () => {

                // =============================================
                // REGISTRA O NÚMERO COMO ERRO
                // =============================================

                const numeroAtual =
                    velocidadeFila[
                    velocidadeIndiceAtual
                    ];


                velocidadeErros.push(
                    numeroAtual
                );


                // =============================================
                // REGISTRA O ERRO NO MOTOR DE DOMÍNIO
                //
                // ERRO:
                // -5 pontos
                // =============================================

                registrarResultadoDominio(
                    numeroAtual,
                    "velocidade",
                    false
                );


                // =============================================
                // AVANÇA PARA A PRÓXIMA RODADA
                // =============================================

                proximaRodadaVelocidade();

            }
        );

    }

    // =====================================================
    // TREINAR NOVAMENTE — VELOCIDADE
    // =====================================================

    if (btnRepetirVelocidade) {

        btnRepetirVelocidade.addEventListener(
            "click",
            () => {

                // =============================================
                // ESCONDE O RESULTADO
                // =============================================

                velocidadeResult.hidden =
                    true;


                // =============================================
                // PREPARA NOVAMENTE OS CONTROLES DO TREINO
                // =============================================

                velocidadeAnswer.hidden =
                    true;


                velocidadeEvaluation.hidden =
                    true;


                btnRevelarVelocidade.hidden =
                    false;


                // =============================================
                // INICIA UMA NOVA RODADA
                // MANTENDO FAIXA E TEMPO SELECIONADOS
                // =============================================

                iniciarTreinoVelocidade();

            }
        );

    }


    // =====================================================
    // VOLTAR À CENTRAL — VELOCIDADE
    // =====================================================

    if (btnCentralVelocidade) {

        btnCentralVelocidade.addEventListener(
            "click",
            () => {

                // =============================================
                // ESCONDE O RESULTADO
                // =============================================

                velocidadeResult.hidden =
                    true;


                // =============================================
                // ESCONDE A TELA DE VELOCIDADE
                // =============================================

                telaVelocidadeMemoria.hidden =
                    true;


                // =============================================
                // ABRE A CENTRAL DA MEMÓRIA NUMÉRICA
                // =============================================

                abrirMemoriaNumerica();

            }
        );

    }

    // =====================================================
    // SELEÇÃO — FAIXA DA VELOCIDADE
    // =====================================================

    let velocidadeInicioAtual =
        1;

    let velocidadeFimAtual =
        10;




    // =====================================================
    // ESTADO DA RODADA — TREINO RÁPIDO
    // =====================================================

    let treinoRapidoFila =
        [];

    let treinoRapidoIndiceAtual =
        0;

    let treinoRapidoAcertos =
        [];

    let treinoRapidoErros =
        [];


    // =====================================================
    // ESTADO DA SESSÃO — REVISÃO INTELIGENTE
    // =====================================================

    let revisaoFila =
        [];

    let revisaoIndiceAtual =
        0;

    let revisaoAcertos =
        [];

    let revisaoErros =
        [];


    // =====================================================
    // ESTADO DA RODADA — VELOCIDADE
    // =====================================================

    let velocidadeFila =
        [];

    let velocidadeIndiceAtual =
        0;

    let velocidadeIntervaloAtual =
        null;

    let velocidadeTimeoutAvancoAtual =
        null;

    let velocidadeTempoRestante =
        0;

    let velocidadeAcertos =
        [];

    let velocidadeErros =
        [];


    velocidadeRangeOptions.forEach(
        option => {

            option.addEventListener(
                "click",
                () => {

                    velocidadeRangeOptions.forEach(
                        item => {

                            item.classList.remove(
                                "is-active"
                            );

                        }
                    );


                    option.classList.add(
                        "is-active"
                    );


                    velocidadeInicioAtual =
                        Number(
                            option.dataset.velocidadeInicio
                        );


                    velocidadeFimAtual =
                        Number(
                            option.dataset.velocidadeFim
                        );

                }
            );

        }
    );


    // =====================================================
    // SELEÇÃO — TEMPO DA VELOCIDADE
    // =====================================================

    let velocidadeTempoAtual =
        10;


    velocidadeTimeOptions.forEach(
        option => {

            option.addEventListener(
                "click",
                () => {

                    velocidadeTimeOptions.forEach(
                        item => {

                            item.classList.remove(
                                "is-active"
                            );

                        }
                    );


                    option.classList.add(
                        "is-active"
                    );


                    velocidadeTempoAtual =
                        Number(
                            option.dataset.velocidadeTempo
                        );

                }
            );

        }
    );



    // =====================================================
    // EVENTOS — APRENDER
    // =====================================================

    if (btnVoltarMemoria) {

        btnVoltarMemoria.addEventListener(
            "click",
            () => {

                history.back();

            }
        );

    }


    if (btnVoltarCentralMemoria) {

        btnVoltarCentralMemoria.addEventListener(
            "click",
            () => {

                history.back();

            }
        );

    }


    if (btnComecarAprendizado) {

        btnComecarAprendizado.addEventListener(
            "click",
            comecarAprendizado
        );

    }


    if (btnAbrirFaixasAprender) {

        btnAbrirFaixasAprender.addEventListener(
            "click",
            alternarPainelFaixas
        );

    }

    // =====================================================
    // ESCOLHER FAIXA — 01–10, 11–20 ETC.
    // =====================================================

    learningRangeOptions.forEach(
        botao => {

            botao.addEventListener(
                "click",
                () => {

                    selecionarFaixaAprender(
                        botao
                    );

                }
            );

        }
    );


    if (btnProximaMemoria) {

        btnProximaMemoria.addEventListener(
            "click",
            avancarMemoria
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
            () => {

                history.back();

            }
        );

    }


    // =====================================================
    // ESCOLHER FAIXA — TABELA MENTAL
    //
    // Esta lógica pertence somente à Tabela Mental.
    // Não altera a faixa nem o funcionamento do Aprender.
    // =====================================================

    mentalTableRangeOptions.forEach(
        botao => {

            botao.addEventListener(
                "click",
                () => {

                    const inicio =
                        Number(
                            botao.dataset.inicio
                        );


                    const fim =
                        Number(
                            botao.dataset.fim
                        );


                    // =========================================
                    // CARREGA A FAIXA ESCOLHIDA
                    // =========================================

                    gerarTabelaMental(
                        inicio,
                        fim
                    );


                    // =========================================
                    // REMOVE O DESTAQUE DA FAIXA ANTERIOR
                    // =========================================

                    mentalTableRangeOptions.forEach(
                        opcao => {

                            opcao.classList.remove(
                                "active"
                            );

                        }
                    );


                    // =========================================
                    // DESTACA A FAIXA ESCOLHIDA
                    // =========================================

                    botao.classList.add(
                        "active"
                    );

                }
            );

        }
    );

    // =====================================================
    // BOTÃO ENTENDI — DETALHE DA MEMÓRIA
    //
    // Fecha somente o detalhe.
    // A Tabela Mental permanece exatamente na faixa
    // em que o usuário estava.
    // =====================================================

    const btnEntendiMentalDetail =
        document.getElementById(
            "btnEntendiMentalDetail"
        );


    if (btnEntendiMentalDetail) {

        btnEntendiMentalDetail.addEventListener(
            "click",
            () => {

                const mentalDetail =
                    document.getElementById(
                        "mentalDetail"
                    );


                if (!mentalDetail) {

                    return;

                }


                mentalDetail.hidden =
                    true;

            }
        );

    }


    // =====================================================
    // EVENTOS — FIXAR
    // =====================================================

    if (btnFixar) {

        btnFixar.addEventListener(
            "click",
            abrirFixarMemoria
        );

    }


    if (btnVoltarFixar) {

        btnVoltarFixar.addEventListener(
            "click",
            () => {

                history.back();

            }
        );

    }


    // =====================================================
    // ABRIR / FECHAR SELETOR DE FAIXAS — FIXAR
    // =====================================================

    if (
        btnFaixaFixar &&
        fixarRangeSelector
    ) {

        btnFaixaFixar.addEventListener(
            "click",
            () => {

                const deveAbrir =
                    fixarRangeSelector.hidden;


                fixarRangeSelector.hidden =
                    !deveAbrir;


                btnFaixaFixar.setAttribute(
                    "aria-expanded",
                    String(deveAbrir)
                );

            }
        );

    }


    // =====================================================
    // ESCOLHER FAIXA — FIXAR
    //
    // Exemplo:
    // 01–10
    // 11–20
    // 21–30
    // ...
    // 91–100
    // =====================================================

    fixarRangeOptions.forEach(
        opcao => {

            opcao.addEventListener(
                "click",
                () => {

                    const inicio =
                        Number(
                            opcao.dataset.fixarInicio
                        );


                    const fim =
                        Number(
                            opcao.dataset.fixarFim
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

                    fixarInicioAtual =
                        inicio;


                    fixarFimAtual =
                        fim;


                    // =========================================
                    // INICIA UMA NOVA RODADA
                    // =========================================

                    fixarNumeroAtual =
                        fixarInicioAtual;


                    fixarErrosRodada =
                        [];


                    fixarAcertosRodada =
                        [];


                    // =========================================
                    // GARANTE QUE NÃO ESTAMOS EM REVISÃO
                    // =========================================

                    limparRevisaoErrosFixar();


                    // =========================================
                    // REMOVE O DESTAQUE DA FAIXA ANTERIOR
                    // =========================================

                    fixarRangeOptions.forEach(
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

                    if (
                        fixarRangeSelector
                    ) {

                        fixarRangeSelector.hidden =
                            true;

                    }


                    if (
                        btnFaixaFixar
                    ) {

                        btnFaixaFixar.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                    }


                    // =========================================
                    // GARANTE QUE O RESULTADO ESTEJA FECHADO
                    // =========================================

                    fixarResult.hidden =
                        true;


                    fixarTrainingArea.hidden =
                        false;


                    // =========================================
                    // CARREGA O PRIMEIRO NÚMERO DA FAIXA
                    // =========================================

                    carregarMemoriaFixar(
                        fixarInicioAtual
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
    // REVELAR MEMÓRIA — FIXAR
    // =====================================================

    if (btnRevelarFixar) {

        btnRevelarFixar.addEventListener(
            "click",
            revelarMemoriaFixar
        );

    }


    // =====================================================
    // LEMBREI — FIXAR
    //
    // Registra o número atual como acerto.
    //
    // TREINO NORMAL:
    // avança numericamente até o final da faixa escolhida.
    //
    // REVISÃO:
    // avança somente pela fila de memórias erradas.
    // =====================================================

    if (btnLembreiFixar) {

        btnLembreiFixar.addEventListener(
            "click",
            () => {

                // =========================================
                // EVITA REGISTRAR O MESMO NÚMERO DUAS VEZES
                // =========================================

                if (
                    !fixarAcertosRodada.includes(
                        fixarNumeroAtual
                    )
                ) {

                    fixarAcertosRodada.push(
                        fixarNumeroAtual
                    );

                }


                // =========================================
                // REMOVE DOS ERROS CASO JÁ EXISTA
                //
                // Na revisão isso significa que a memória
                // foi recuperada com sucesso.
                // =========================================

                fixarErrosRodada =
                    fixarErrosRodada.filter(
                        numero =>
                            numero !==
                            fixarNumeroAtual
                    );


                // =========================================
                // REGISTRA O ACERTO NO MOTOR DE DOMÍNIO
                // =========================================

                registrarResultadoDominio(
                    fixarNumeroAtual,
                    "fixar",
                    true
                );


                // =========================================
                // MODO REVISÃO
                //
                // Avança somente dentro da fila
                // criada com as memórias erradas.
                // =========================================

                if (
                    fixarModoRevisao
                ) {

                    // =====================================
                    // AVANÇA A POSIÇÃO DA FILA
                    // =====================================

                    fixarIndiceRevisao++;


                    // =====================================
                    // AINDA EXISTE OUTRA MEMÓRIA PARA REVISAR
                    // =====================================

                    if (
                        fixarIndiceRevisao <
                        fixarFilaRevisao.length
                    ) {

                        carregarMemoriaFixar(
                            fixarFilaRevisao[
                            fixarIndiceRevisao
                            ]
                        );

                    } else {

                        // =================================
                        // TERMINOU A FILA DE REVISÃO
                        // =================================

                        limparRevisaoErrosFixar();

                        finalizarRodadaFixar();

                    }


                    return;

                }


                // =========================================
                // MODO NORMAL
                //
                // Avança até o final da faixa escolhida.
                //
                // Exemplo:
                // faixa 31–40 → termina no 40.
                // faixa 91–100 → termina no 100.
                // =========================================

                if (
                    fixarNumeroAtual <
                    fixarFimAtual
                ) {

                    carregarMemoriaFixar(
                        fixarNumeroAtual + 1
                    );

                } else {

                    finalizarRodadaFixar();

                }

            }
        );

    }


    // =====================================================
    // NÃO LEMBREI — FIXAR
    //
    // Registra o número atual como erro.
    //
    // TREINO NORMAL:
    // avança numericamente até o final da faixa escolhida.
    //
    // REVISÃO:
    // mantém a memória como erro
    // e avança somente pela fila de revisão.
    // =====================================================

    if (btnNaoLembreiFixar) {

        btnNaoLembreiFixar.addEventListener(
            "click",
            () => {

                // =========================================
                // EVITA REGISTRAR O MESMO NÚMERO DUAS VEZES
                // =========================================

                if (
                    !fixarErrosRodada.includes(
                        fixarNumeroAtual
                    )
                ) {

                    fixarErrosRodada.push(
                        fixarNumeroAtual
                    );

                }


                // =========================================
                // REMOVE DOS ACERTOS CASO JÁ EXISTA
                //
                // Na revisão isso significa que a memória
                // ainda precisa de reforço.
                // =========================================

                fixarAcertosRodada =
                    fixarAcertosRodada.filter(
                        numero =>
                            numero !==
                            fixarNumeroAtual
                    );


                // =========================================
                // REGISTRA O ERRO NO MOTOR DE DOMÍNIO
                // =========================================

                registrarResultadoDominio(
                    fixarNumeroAtual,
                    "fixar",
                    false
                );


                // =========================================
                // MODO REVISÃO
                //
                // Avança somente dentro da fila
                // criada com as memórias erradas.
                // =========================================

                if (
                    fixarModoRevisao
                ) {

                    // =====================================
                    // AVANÇA A POSIÇÃO DA FILA
                    // =====================================

                    fixarIndiceRevisao++;


                    // =====================================
                    // AINDA EXISTE OUTRA MEMÓRIA PARA REVISAR
                    // =====================================

                    if (
                        fixarIndiceRevisao <
                        fixarFilaRevisao.length
                    ) {

                        carregarMemoriaFixar(
                            fixarFilaRevisao[
                            fixarIndiceRevisao
                            ]
                        );

                    } else {

                        // =================================
                        // TERMINOU A FILA DE REVISÃO
                        // =================================

                        limparRevisaoErrosFixar();

                        finalizarRodadaFixar();

                    }


                    return;

                }


                // =========================================
                // MODO NORMAL
                //
                // Avança até o final da faixa escolhida.
                // =========================================

                if (
                    fixarNumeroAtual <
                    fixarFimAtual
                ) {

                    carregarMemoriaFixar(
                        fixarNumeroAtual + 1
                    );

                } else {

                    finalizarRodadaFixar();

                }

            }
        );

    }


    // =====================================================
    // REVISAR ERROS — RESULTADO DO FIXAR
    //
    // Prepara a fila somente com as memórias
    // marcadas como "Não lembrei"
    // e abre a primeira memória da revisão.
    // =====================================================

    if (btnRevisarErrosFixar) {

        btnRevisarErrosFixar.addEventListener(
            "click",
            () => {

                // =========================================
                // PREPARA A FILA DE REVISÃO
                // =========================================

                const revisaoPreparada =
                    prepararRevisaoErrosFixar();


                if (
                    !revisaoPreparada
                ) {

                    return;

                }


                // =========================================
                // ESCONDE O RESULTADO
                // =========================================

                fixarResult.hidden =
                    true;


                // =========================================
                // MOSTRA NOVAMENTE A ÁREA DE TREINO
                // =========================================

                fixarTrainingArea.hidden =
                    false;


                // =========================================
                // FECHA O SELETOR DE FAIXAS
                // =========================================

                if (
                    fixarRangeSelector
                ) {

                    fixarRangeSelector.hidden =
                        true;

                }


                if (
                    btnFaixaFixar
                ) {

                    btnFaixaFixar.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }


                // =========================================
                // ABRE A PRIMEIRA MEMÓRIA ERRADA
                // =========================================

                carregarMemoriaFixar(
                    fixarFilaRevisao[
                    fixarIndiceRevisao
                    ]
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
    // NOVO FIXAR — RESULTADO DO FIXAR
    //
    // Fecha o resultado,
    // limpa os dados da rodada atual
    // e prepara uma nova rodada dentro do próprio Fixar.
    // =====================================================

    if (btnFinalizarFixar) {

        btnFinalizarFixar.addEventListener(
            "click",
            () => {

                // =========================================
                // LIMPA OS RESULTADOS DA RODADA
                // =========================================

                fixarNumeroAtual =
                    fixarInicioAtual;


                fixarErrosRodada =
                    [];


                fixarAcertosRodada =
                    [];


                // =========================================
                // LIMPA A REVISÃO DOS ERROS
                // =========================================

                limparRevisaoErrosFixar();


                // =========================================
                // FECHA O SELETOR DE FAIXAS
                // =========================================

                if (
                    fixarRangeSelector
                ) {

                    fixarRangeSelector.hidden =
                        true;

                }


                if (
                    btnFaixaFixar
                ) {

                    btnFaixaFixar.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }


                // =========================================
                // ESCONDE RESULTADO
                // =========================================

                fixarResult.hidden =
                    true;


                // =========================================
                // PREPARA UMA NOVA RODADA
                // =========================================

                fixarTrainingArea.hidden =
                    false;


                fixarQuestion.hidden =
                    false;


                fixarAnswer.hidden =
                    true;


                fixarEvaluation.hidden =
                    true;


                btnRevelarFixar.hidden =
                    false;


                // =========================================
                // CARREGA NOVAMENTE A FAIXA ATUAL
                // =========================================

                carregarMemoriaFixar(
                    fixarInicioAtual
                );


                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
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
            () => {

                history.back();

            }
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
    // NOVO DESAFIO — RESULTADO DO DESAFIAR
    //
    // Fecha o resultado,
    // limpa os dados da rodada atual
    // e retorna ao estado inicial do próprio Desafiar.
    // =====================================================

    if (btnFinalizarDesafio) {

        btnFinalizarDesafio.addEventListener(
            "click",
            () => {

                // =========================================
                // LIMPA OS RESULTADOS DA RODADA
                // =========================================

                desafiarAcertosRodada =
                    [];


                desafiarErrosRodada =
                    [];


                desafiarNumeroAtual =
                    desafiarInicioAtual;


                // =========================================
                // ESCONDE O RESULTADO
                // =========================================

                desafiarResult.hidden =
                    true;


                // =========================================
                // RETORNA AO ESTADO INICIAL DO DESAFIAR
                // =========================================

                desafiarTrainingArea.hidden =
                    false;


                carregarMemoriaDesafiar(
                    desafiarInicioAtual
                );


                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

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
    // REVISÃO INTELIGENTE — REGISTRAR RESPOSTA
    // =====================================================

    function registrarRespostaRevisao(
        lembrou
    ) {

        const memoriaAtual =
            revisaoFila[
                revisaoIndiceAtual
            ];


        if (
            !memoriaAtual
        ) {

            return;

        }


        // =============================================
        // REGISTRA O RESULTADO DA SESSÃO
        // =============================================

        if (
            lembrou
        ) {

            revisaoAcertos.push(
                memoriaAtual.numero
            );

        }

        else {

            revisaoErros.push(
                memoriaAtual.numero
            );

        }


        // =============================================
        // AVANÇA NA FILA
        // =============================================

        revisaoIndiceAtual++;


        // =============================================
        // AINDA EXISTEM MEMÓRIAS
        // =============================================

        if (
            revisaoIndiceAtual <
            revisaoFila.length
        ) {

            carregarMemoriaRevisao();

            return;

        }


        // =============================================
        // SESSÃO CONCLUÍDA — 100%
        // =============================================

        if (
            revisaoPercentual
        ) {

            revisaoPercentual.textContent =
                "100%";

        }


        if (
            revisaoBarra
        ) {

            revisaoBarra.style.width =
                "100%";

        }


        // =============================================
        // EXIBE O RESULTADO DA SESSÃO
        // =============================================

        mostrarResultadoRevisao();

    }


    // =====================================================
    // REVISÃO INTELIGENTE — MOSTRAR RESULTADO
    // =====================================================

    function mostrarResultadoRevisao() {

        // =============================================
        // ACERTOS E ERROS
        // =============================================

        revisaoResultAcertos.textContent =
            revisaoAcertos.length;


        revisaoResultErros.textContent =
            revisaoErros.length;


        // =============================================
        // LIMPA A LISTA ANTERIOR
        // =============================================

        revisaoResultWeakList.innerHTML =
            "";


        // =============================================
        // EXISTEM MEMÓRIAS PARA REFORÇAR
        // =============================================

        if (
            revisaoErros.length > 0
        ) {

            revisaoResultWeak.hidden =
                false;

            revisaoResultSuccess.hidden =
                true;


            revisaoErros.forEach(
                numero => {

                    const memoria =
                        bancoMemoria.find(
                            item =>
                                item.numero ===
                                numero
                        );


                    if (
                        !memoria
                    ) {

                        return;

                    }


                    const item =
                        document.createElement(
                            "div"
                        );


                    item.className =
                        "revisao-result-weak-item";


                    const numeroElemento =
                        document.createElement(
                            "strong"
                        );


                    numeroElemento.textContent =
                        String(
                            memoria.numero
                        ).padStart(
                            2,
                            "0"
                        );


                    const palavraElemento =
                        document.createElement(
                            "span"
                        );


                    palavraElemento.textContent =
                        memoria.palavra;


                    item.append(
                        numeroElemento,
                        palavraElemento
                    );


                    revisaoResultWeakList.appendChild(
                        item
                    );

                }
            );

        }


        // =============================================
        // LEMBROU DE TODAS
        // =============================================

        else {

            revisaoResultWeak.hidden =
                true;

            revisaoResultSuccess.hidden =
                false;

        }


        // =============================================
        // EXIBE O RESULTADO
        // =============================================

        revisaoTraining.hidden =
            true;

        revisaoResult.hidden =
            false;


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

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