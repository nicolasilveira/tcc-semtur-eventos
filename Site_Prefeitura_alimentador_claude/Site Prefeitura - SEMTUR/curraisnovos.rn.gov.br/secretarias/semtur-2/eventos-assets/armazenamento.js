/* Camada de armazenamento (hoje: navegador). Para usar um servidor no futuro, troque só este arquivo. */
(function () {
  const K = 'semtur_dados_v1';
  const base = () => JSON.parse(JSON.stringify({ eventos: window.EVENTOS || [], roteiros: window.ROTEIROS || [] }));
  window.Dados = {
    carregar() { try { const j = JSON.parse(localStorage.getItem(K)); if (j && Array.isArray(j.eventos) && Array.isArray(j.roteiros)) return j; } catch (e) {} return base(); },
    salvar(d) { try { localStorage.setItem(K, JSON.stringify(d)); return true; } catch (e) { return false; } },
    restaurar() { try { localStorage.removeItem(K); } catch (e) {} }
  };
})();
