const CACHE_NAME =
    "palacio-mental-v1.0.14";


const ARQUIVOS_CACHE = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./manifest.json",
    "./assets/icons/icon-192.png",
    "./assets/icons/icon-512.png",
    "./assets/icons/icon-512-maskable.png"
];


// =====================================================
// INSTALAÇÃO
// =====================================================

self.addEventListener(
    "install",
    event => {

        event.waitUntil(
            caches
                .open(
                    CACHE_NAME
                )
                .then(
                    async cache => {

                        // =====================================
                        // FORÇA A BUSCA DOS ARQUIVOS MAIS NOVOS
                        // DURANTE A INSTALAÇÃO DO SERVICE WORKER
                        // =====================================

                        const requisicoes =
                            ARQUIVOS_CACHE.map(
                                arquivo =>
                                    new Request(
                                        arquivo,
                                        {
                                            cache:
                                                "reload"
                                        }
                                    )
                            );


                        await cache.addAll(
                            requisicoes
                        );

                    }
                )
        );


        // =================================================
        // NÃO DEIXA O NOVO SERVICE WORKER ESPERANDO
        // =================================================

        self.skipWaiting();

    }
);


// =====================================================
// ATIVAÇÃO
// =====================================================

self.addEventListener(
    "activate",
    event => {

        event.waitUntil(
            caches
                .keys()
                .then(
                    nomes =>
                        Promise.all(
                            nomes.map(
                                nome => {

                                    // =================================
                                    // REMOVE CACHES DE VERSÕES ANTERIORES
                                    // =================================

                                    if (
                                        nome !==
                                        CACHE_NAME
                                    ) {

                                        return caches.delete(
                                            nome
                                        );

                                    }


                                    return Promise.resolve();

                                }
                            )
                        )
                )
                .then(
                    () =>
                        self.clients.claim()
                )
        );

    }
);


// =====================================================
// FETCH
//
// ESTRATÉGIA:
// NETWORK FIRST
//
// 1. Tenta buscar a versão mais recente na internet.
// 2. Se encontrar, atualiza o cache.
// 3. Se estiver offline ou a rede falhar,
//    utiliza a última versão salva.
// =====================================================

self.addEventListener(
    "fetch",
    event => {

        if (
            event.request.method !==
            "GET"
        ) {

            return;

        }


        const url =
            new URL(
                event.request.url
            );


        // =================================================
        // GERENCIA SOMENTE ARQUIVOS DO PRÓPRIO APP
        // =================================================

        if (
            url.origin !==
            self.location.origin
        ) {

            return;

        }


        event.respondWith(

            fetch(
                new Request(
                    event.request,
                    {
                        cache:
                            "no-store"
                    }
                )
            )
                .then(
                    respostaRede => {

                        // =========================================
                        // SE A RESPOSTA FOR VÁLIDA,
                        // GUARDA A VERSÃO MAIS NOVA NO CACHE
                        // =========================================

                        if (
                            respostaRede &&
                            respostaRede.ok
                        ) {

                            const copiaResposta =
                                respostaRede.clone();


                            caches
                                .open(
                                    CACHE_NAME
                                )
                                .then(
                                    cache => {

                                        cache.put(
                                            event.request,
                                            copiaResposta
                                        );

                                    }
                                );

                        }


                        // =========================================
                        // ENTREGA A VERSÃO DA REDE
                        // =========================================

                        return respostaRede;

                    }
                )
                .catch(
                    async () => {

                        // =========================================
                        // SEM INTERNET:
                        // PROCURA A ÚLTIMA VERSÃO NO CACHE
                        // =========================================

                        const respostaCache =
                            await caches.match(
                                event.request
                            );


                        if (
                            respostaCache
                        ) {

                            return respostaCache;

                        }


                        // =========================================
                        // PARA NAVEGAÇÃO, TENTA O INDEX
                        // =========================================

                        if (
                            event.request.mode ===
                            "navigate"
                        ) {

                            const paginaInicial =
                                await caches.match(
                                    "./index.html"
                                );


                            if (
                                paginaInicial
                            ) {

                                return paginaInicial;

                            }

                        }


                        return Response.error();

                    }
                )

        );

    }
);