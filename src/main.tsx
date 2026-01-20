import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Hotfix definitivo para crash "removeChild" disparado por bibliotecas de UI com Portals.
// Evita lançar NotFoundError quando o nó já foi removido em outro ciclo de cleanup.
// Importante: não altera regra de negócio; apenas torna a remoção idempotente.
(() => {
  const originalRemoveChild = Node.prototype.removeChild;

  // Evita aplicar duas vezes (HMR / reexecução)
  if ((Node.prototype.removeChild as any).__safe_patched__) return;

  const safeRemoveChild: typeof Node.prototype.removeChild = function (this: Node, child: Node) {
    try {
      // Só remove se o nó realmente pertence a este parent
      if (child && child.parentNode === this) {
        return originalRemoveChild.call(this, child);
      }
      return child;
    } catch (err) {
      // Swallow apenas o erro clássico do Radix/portal race
      if (err instanceof DOMException && err.name === "NotFoundError") {
        return child;
      }
      throw err;
    }
  };

  (safeRemoveChild as any).__safe_patched__ = true;
  Node.prototype.removeChild = safeRemoveChild;
})();

createRoot(document.getElementById("root")!).render(<App />);
