import {defineConfig} from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.web.ts'],
    include: ['test/**/*.spec.ts'],
    coverage: {
      enabled: true,
      provider: 'v8',
      include: ['src/**/*.ts'],
      reportsDirectory: 'coverage/vitest-web',
      reporter: ['text', 'lcov'],
    },
  },
});
