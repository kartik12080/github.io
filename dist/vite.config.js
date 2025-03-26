import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../index.html'),
                statistics: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../views/statistics.html')
            }
        }
    }
});
//# sourceMappingURL=vite.config.js.map