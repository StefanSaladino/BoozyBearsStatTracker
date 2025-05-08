/// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { configDefaults } from 'vitest/config';
export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: 'src/setupTests.ts', // or .ts/.tsx/.js depending on your setup
        exclude: [...configDefaults.exclude, 'e2e/*']
    }
});
