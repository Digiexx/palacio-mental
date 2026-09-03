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


    const telaAprenderMemoria =
        document.getElementById(
            "telaAprenderMemoria"
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

        telaMemoriaNumerica.hidden =
            false;


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    // =====================================================
    // ABRIR TELA APRENDER
    // =====================================================

    function abrirAprendizado() {

        telaMemoriaNumerica.hidden =
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


        if (!proximaMemoria) {

            console.log(
                `Faixa ${String(
                    faixaInicioAtual
                ).padStart(2, "0")}–${String(
                    faixaFimAtual
                ).padStart(2, "0")} concluída.`
            );

            return;

        }


        indiceMemoriaAtual =
            proximoIndice;


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


    if (btnVoltarMemoria) {

        btnVoltarMemoria.addEventListener(
            "click",
            voltarParaMemoria
        );

    }


    if (btnVoltarCentralMemoria) {

        btnVoltarCentralMemoria.addEventListener(
            "click",
            voltarParaMemoria
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
    // ESCOLHER FAIXA — 01–10, 21–30 ETC.
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


    if (btnVoltarHome) {

        btnVoltarHome.addEventListener(
            "click",
            voltarParaHome
        );

    }

});