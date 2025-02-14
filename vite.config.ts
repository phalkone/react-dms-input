/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import dts from 'vite-plugin-dts'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ mode }) => {
  const isDemoBuild = mode === 'demo'

  return {
    base: isDemoBuild ? './' : '/',
    plugins: [react(), !isDemoBuild && dts({ rollupTypes: true })],
    test: {
      globals: true,
      environment: 'jsdom',
      include: [
        'lib/__tests__/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'
      ]
    },
    build: isDemoBuild
      ? {
          outDir: 'demo-dist'
        }
      : {
          lib: {
            entry: resolve(__dirname, 'lib/main.ts'),
            name: 'react-dms-input',
            fileName: 'react-dms-input',
            formats: ['es', 'umd']
          },
          sourcemap: true,
          rollupOptions: {
            external: ['react'],
            output: {
              globals: {
                react: 'React'
              }
            }
          }
        }
  }
})
