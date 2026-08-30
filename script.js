// =====================================================
// PALÁCIO MENTAL
// SCRIPT PRINCIPAL
// =====================================================


// =====================================================
// BANCO DE MEMÓRIA NUMÉRICA
// =====================================================

const bancoMemoria = [

    {
        numero: 1,
        codigo: "T",
        palavra: "Teia",
        categoria: "objeto",
        imagem: "assets/imagens/memoria-numerica/numeros/01-teia.webp",
        dominado: false
    },

    {
        numero: 2,
        codigo: "N",
        palavra: "Noé",
        categoria: "personagem",
        imagem: "assets/imagens/memoria-numerica/numeros/02-noe.webp",
        dominado: false
    },

    {
        numero: 3,
        codigo: "M",
        palavra: "Mãe",
        categoria: "personagem",
        imagem: "assets/imagens/memoria-numerica/numeros/03-mae.webp",
        dominado: false
    },

    {
        numero: 4,
        codigo: "C",
        palavra: "Cão",
        categoria: "animal",
        imagem: "assets/imagens/memoria-numerica/numeros/04-cao.webp",
        dominado: false
    },

    {
        numero: 5,
        codigo: "L",
        palavra: "Lua",
        categoria: "objeto",
        imagem: "assets/imagens/memoria-numerica/numeros/05-lua.webp",
        dominado: false
    },

    {
        numero: 6,
        codigo: "S",
        palavra: "Asa",
        categoria: "símbolo",
        imagem: "assets/imagens/memoria-numerica/numeros/06-asa.webp",
        dominado: false
    },

    {
        numero: 7,
        codigo: "F",
        palavra: "Fio",
        categoria: "objeto",
        imagem: "assets/imagens/memoria-numerica/numeros/07-fio.webp",
        dominado: false
    },

    {
        numero: 8,
        codigo: "G",
        palavra: "Água",
        categoria: "elemento",
        imagem: "assets/imagens/memoria-numerica/numeros/08-agua.webp",
        dominado: false
    },

    {
        numero: 9,
        codigo: "P",
        palavra: "Pião",
        categoria: "objeto",
        imagem: "assets/imagens/memoria-numerica/numeros/09-piao.webp",
        dominado: false
    },

    {
        numero: 10,
        codigo: "TR",
        palavra: "Touro",
        categoria: "animal",
        imagem: "assets/imagens/memoria-numerica/numeros/10-touro.webp",
        dominado: false
    }

];


document.addEventListener("DOMContentLoaded", () => {

    // =====================================================
    // ANIMAÇÃO INICIAL DA HOME
    // =====================================================

    const elementosAnimados = document.querySelectorAll(
        ".hero-card, .module-card, .stat-card"
    );

    elementosAnimados.forEach((elemento, index) => {

        elemento.style.opacity = "0";
        elemento.style.transform = "translateY(24px)";

        setTimeout(() => {

            elemento.style.transition =
                "opacity 600ms ease, transform 600ms ease";

            elemento.style.opacity = "1";
            elemento.style.transform = "translateY(0)";

        }, 120 * index);

    });


    // =====================================================
    // PROGRESSO GERAL
    // =====================================================

    const progressoGeral = 12;

    const textoProgresso =
        document.getElementById("progressoGeral");

    const barraProgresso =
        document.getElementById("barraProgressoGeral");


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

    const elementosClicaveis = document.querySelectorAll(
        ".module-card, .primary-button, .nav-item"
    );

    elementosClicaveis.forEach((elemento) => {

        elemento.addEventListener("pointerdown", () => {

            elemento.style.transform =
                "scale(0.97)";

        });


        elemento.addEventListener("pointerup", () => {

            elemento.style.transform =
                "";

        });


        elemento.addEventListener("pointerleave", () => {

            elemento.style.transform =
                "";

        });

    });

    // =====================================================
    // NAVEGAÇÃO — MEMÓRIA NUMÉRICA
    // =====================================================

    const btnMemoriaNumerica =
        document.getElementById("btnMemoriaNumerica");

    const btnVoltarHome =
        document.getElementById("btnVoltarHome");

    const btnIniciarAprendizado =
        document.getElementById("btnIniciarAprendizado");

    const btnVoltarMemoria =
        document.getElementById("btnVoltarMemoria");

    const telaMemoriaNumerica =
        document.getElementById("telaMemoriaNumerica");

    const telaAprenderMemoria =
        document.getElementById("telaAprenderMemoria");

    const heroHome =
        document.querySelector(".hero-card");

    const modulosHome =
        document.querySelector(".modules-section");

    const resumoHome =
        document.querySelector(".summary-section");

            const btnComecarAprendizado =
        document.getElementById("btnComecarAprendizado");

    const memoryLearningStage =
        document.getElementById("memoryLearningStage");

    const learnContent =
        document.querySelector(".learn-content");

            const learningNumero =
        document.getElementById("learningNumero");

    const learningCodigo =
        document.getElementById("learningCodigo");

    const learningPalavra =
        document.getElementById("learningPalavra");

    const learningImagem =
        document.getElementById("learningImagem");
        
        const learningProgress =
    document.getElementById("learningProgress");

    const btnProximaMemoria =
        document.getElementById("btnProximaMemoria");


    function abrirMemoriaNumerica() {

        heroHome.hidden = true;
        modulosHome.hidden = true;
        resumoHome.hidden = true;

        telaAprenderMemoria.hidden = true;
        telaMemoriaNumerica.hidden = false;

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    function abrirAprendizado() {

        telaMemoriaNumerica.hidden = true;
        telaAprenderMemoria.hidden = false;

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    function voltarParaMemoria() {

        telaAprenderMemoria.hidden = true;
        telaMemoriaNumerica.hidden = false;

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    function comecarAprendizado() {

        learnContent.hidden = true;
        memoryLearningStage.hidden = false;

        indiceMemoriaAtual = 0;

        mostrarMemoria(
            indiceMemoriaAtual
        );

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


      function mostrarMemoria(indice) {

        const memoria =
            bancoMemoria[indice];


        learningProgress.textContent =
            `${String(indice + 1).padStart(2, "0")} / ${String(bancoMemoria.length).padStart(2, "0")}`;


        learningNumero.textContent =
            String(memoria.numero).padStart(2, "0");

        learningCodigo.textContent =
            memoria.codigo;

        learningPalavra.textContent =
            memoria.palavra.toUpperCase();

        learningImagem.src =
            memoria.imagem;

        learningImagem.alt =
            `Associação visual do número ${
                String(memoria.numero).padStart(2, "0")
            } — ${memoria.palavra}`;

    }


    let indiceMemoriaAtual = 0;


    function avancarMemoria() {

        const proximoIndice =
            indiceMemoriaAtual + 1;

        const proximaMemoria =
            bancoMemoria[proximoIndice];


        if (!proximaMemoria) {

            console.log(
                "Aprendizado concluído."
            );

            return;

        }


        if (!proximaMemoria.imagem) {

            console.log(
                `A imagem do número ${
                    String(proximaMemoria.numero).padStart(2, "0")
                } ainda não foi adicionada.`
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


    function voltarParaHome() {

        telaMemoriaNumerica.hidden = true;

        heroHome.hidden = false;
        modulosHome.hidden = false;
        resumoHome.hidden = false;

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


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


    if (btnComecarAprendizado) {

        btnComecarAprendizado.addEventListener(
            "click",
            comecarAprendizado
        );

    }


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
