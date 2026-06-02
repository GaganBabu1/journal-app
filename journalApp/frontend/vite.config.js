import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
	plugins: [react()],
	server: {
		port: Number(process.env.VITE_PORT) || 3000,
		proxy: {
			'/api': {
				target: 'http://localhost:8080',
				changeOrigin: true,
			},
		},
	},
	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: './src/test/setup.js',
		include: ['src/**/*.test.{js,jsx}'],
		exclude: ['**/node_modules/**', '**/dist/**'],
		pool: 'threads',
		poolOptions: {
			threads: {
				minThreads: 1,
				maxThreads: 1,
			},
		},
	},
});
