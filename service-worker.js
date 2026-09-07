const CACHE_NAME =
    "palacio-mental-v1.0.11";


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
                    cache =>
                        cache.addAll(
                            ARQUIVOS_CACHE
                        )
                )
        );


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

                                    if (
                                        nome !==
                                        CACHE_NAME
                                    ) {

                                        return caches.delete(
                                            nome
                                        );

                                    }

                                }
                            )
                        )
                )
        );


        self.clients.claim();

    }
);


// =====================================================
// FETCH
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


        event.respondWith(
            caches
                .match(
                    event.request
                )
                .then(
                    respostaCache => {

                        if (
                            respostaCache
                        ) {

                            return respostaCache;

                        }


                        return fetch(
                            event.request
                        );

                    }
                )
        );

    }
);