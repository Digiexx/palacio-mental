(() => {
    'use strict';
    const PB = globalThis.PalacioBiblico, m = PB.cenarioJoao;
    const linhas = [];
    let falhas = 0;
    const assert = (v, mensagem) => { if (!v) throw new Error(mensagem); };
    const perto = (a, b) => Math.abs(a - b) < 1e-7;
    function testar(nome, fn) {
        try { fn(); linhas.push(`OK: ${nome}`); }
        catch (e) { ++falhas; linhas.push(`FALHOU: ${nome}: ${e.message}`); }
    }
    const valido = r => [r.x, r.y, r.largura, r.altura].every(Number.isFinite) &&
        r.x >= 0 && r.y >= 0 && r.largura > 0 && r.altura > 0 && r.x + r.largura <= 1 && r.y + r.altura <= 1;
    const sobrepoe = (a, b) => Math.min(a.x + a.largura, b.x + b.largura) > Math.max(a.x, b.x) &&
        Math.min(a.y + a.altura, b.y + b.altura) > Math.max(a.y, b.y);
    testar('IDs únicos, geometria normalizada e catálogo imutável', () => {
        const ids = [m.id, ...m.regioes.map(r => r.id), ...m.objetos.map(o => o.id)];
        assert(new Set(ids).size === ids.length, 'IDs repetidos');
        assert(Object.isFrozen(m) && Object.isFrozen(m.objetos[0].toque), 'Catálogo mutável');
        for (const r of m.regioes) assert(valido(r.toque) && valido(r.enquadramento), 'Região inválida');
        for (const o of m.objetos) assert(valido(o.toque) && m.regioes.some(r => r.id === o.regiaoId), 'Objeto inválido');
    });
    testar('regiões cobrem a imagem sem sobreposição de toque', () => {
        const ordenadas = [...m.regioes].sort((a, b) => a.toque.x - b.toque.x);
        let fim = 0;
        for (const r of ordenadas) {
            assert(perto(r.toque.x, fim) && r.toque.y === 0 && r.toque.altura === 1, 'Lacuna ou sobreposição');
            fim = r.toque.x + r.toque.largura;
        }
        assert(perto(fim, 1), 'Cobertura incompleta');
    });
    testar('quatro objetos e ausência de conflito entre seus retângulos', () => {
        assert(m.objetos.length === 4, 'Quantidade inesperada');
        for (let i = 0; i < m.objetos.length; i++) for (let j = i + 1; j < m.objetos.length; j++) {
            assert(!sobrepoe(m.objetos[i].toque, m.objetos[j].toque), 'Objetos sobrepostos');
        }
    });
    for (const [w, h] of [[360, 432], [430, 503.28], [800, 300], [240, 290]]) {
        testar(`panorama integral e proporcional em ${w} × ${h}`, () => {
            const c = PB.geometriaCenario.calcularCamera(w, h, m);
            assert(c.escala === 1 && c.x >= -1e-7 && c.y >= -1e-7, 'Panorama cortado');
            assert(c.x + c.baseLargura <= w + 1e-7 && c.y + c.baseAltura <= h + 1e-7, 'Panorama excede área');
            assert(perto(c.baseLargura / c.baseAltura, m.largura / m.altura), 'Imagem distorcida');
        });
        testar(`objetos visíveis e alinhados em suas regiões: ${w} × ${h}`, () => {
            for (const r of m.regioes) {
                const c = PB.geometriaCenario.calcularCamera(w, h, m, r);
                for (const o of m.objetos.filter(o => o.regiaoId === r.id)) {
                    const x = c.x + (o.toque.x + o.toque.largura / 2) * c.baseLargura * c.escala;
                    const y = c.y + (o.toque.y + o.toque.altura / 2) * c.baseAltura * c.escala;
                    assert(x >= 0 && x <= w && y >= 0 && y <= h, `${o.nome} fora da região visível`);
                    if (w === 360 || w === 430) {
                        assert(o.toque.largura * c.baseLargura * c.escala >= 44 && o.toque.altura * c.baseAltura * c.escala >= 44, 'Alvo menor que 44 px');
                    }
                }
            }
        });
    }
    testar('ampliação limitada e coordenadas originais preservadas', () => {
        const antes = JSON.stringify(m);
        const c = PB.geometriaCenario.calcularCamera(360, 432, m, {...m.regioes[0], ampliacao: 20});
        assert(c.escala === 3, 'Ampliação sem limite');
        assert(JSON.stringify(m) === antes, 'Âncoras modificadas');
    });
    linhas.push(`RESULTADO: ${falhas} falhas. Interação, navegação e offline exigem testes no aplicativo.`);
    document.getElementById('resultado').textContent = linhas.join('\n');
    document.documentElement.dataset.resultado = falhas ? 'falhou' : 'passou';
})();
