(() => {
    'use strict';
    const PB = globalThis.PalacioBiblico;
    const NOME_BANCO = 'palacio-mental-biblico';
    const VERSAO_SCHEMA = 1; // Versão do schema, não do aplicativo.
    function requisicao(req) {
        return new Promise((resolve, reject) => {
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    }
    function abrirBanco({nome = NOME_BANCO, fabrica = globalThis.indexedDB} = {}) {
        return new Promise((resolve, reject) => {
            if (!fabrica) { reject(new Error('IndexedDB indisponível')); return; }
            let bloqueado = false;
            const req = fabrica.open(nome, VERSAO_SCHEMA);
            req.onblocked = () => { bloqueado = true; reject(new Error('Banco bloqueado: feche outras abas')); };
            req.onerror = () => reject(req.error);
            req.onupgradeneeded = () => {
                if (bloqueado) { req.transaction.abort(); return; }
                const db = req.result;
                // Migrações futuras devem ser aditivas e condicionadas a oldVersion.
                for (const tipo of PB.tipos) {
                    const store = db.createObjectStore(tipo, {keyPath: 'id'});
                    store.createIndex('proprietario', 'proprietarioLocalId');
                    if (tipo === 'vinculos') {
                        for (const campo of ['objetoId', 'versiculoId', 'associacaoId']) {
                            store.createIndex(campo, ['proprietarioLocalId', campo], {unique: true});
                        }
                    }
                    if (tipo === 'versiculos') store.createIndex('referencia', ['proprietarioLocalId', 'livroId', 'capitulo', 'inicio', 'fim', 'traducao'], {unique: true});
                }
                db.createObjectStore('metadados', {keyPath: 'id'});
                const fila = db.createObjectStore('operacoes', {keyPath: 'id'});
                fila.createIndex('proprietario', 'proprietarioLocalId');
            };
            req.onsuccess = () => {
                const db = req.result;
                if (bloqueado) { db.close(); return; }
                db.onversionchange = () => db.close();
                resolve(db);
            };
        });
    }
    // O resultado só é entregue após commit. Não aguardar rede/timers no callback.
    function transacao(db, stores, modo, executar) {
        return new Promise((resolve, reject) => {
            let tx;
            try { tx = db.transaction(stores, modo); } catch (erro) { reject(erro); return; }
            let resultado, falha;
            tx.oncomplete = () => resolve(resultado);
            tx.onabort = () => reject(falha || tx.error || new Error('Transação abortada'));
            tx.onerror = () => {}; // Abort padrão preservado; rejeição em onabort.
            Promise.resolve().then(() => executar(tx)).then(r => { resultado = r; }, erro => {
                falha = erro;
                try { tx.abort(); } catch { reject(erro); }
            });
        });
    }
    Object.assign(PB, {NOME_BANCO, VERSAO_SCHEMA, requisicao, abrirBanco, transacao});
})();
