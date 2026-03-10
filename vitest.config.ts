import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        include: ['src/**/tests/*.test.ts', 'src/**/tests/*.integration.test.ts'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html'],
            include: ['src/**/*.ts'],
            exclude: ['src/**/tests/*.test.ts'],
        },
    },
    esbuild: {
        target: 'node18',
    },
});
