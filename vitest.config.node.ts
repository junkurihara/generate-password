import {defineConfig} from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['test/**/*.spec.ts'],
    coverage: {
      enabled: true,
      provider: 'v8',
      include: ['src/**/*.ts'],
      reportsDirectory: 'coverage/vitest-node',
      reporter: ['text', 'lcov'],
    },
  },
});
