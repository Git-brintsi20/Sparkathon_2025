import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// Use the 'url' module for modern path resolution
import { fileURLToPath, URL } from 'url';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import tailwindcssNesting from 'tailwindcss/nesting';

// Change defineConfig to a function to allow synchronous logic before returning the config
export default defineConfig(() => {
  // Read package.json to get the version
  // Ensure the path to package.json is correct relative to where vite.config.ts is run


  // Now, return the configuration object
  return {
   plugins: [react()], 


    resolve: {
      alias: {
        // CORRECTED: Use the modern ESM way to resolve paths.
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
        '@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
        '@hooks': fileURLToPath(new URL('./src/hooks', import.meta.url)),
        '@utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
        '@services': fileURLToPath(new URL('./src/services', import.meta.url)),
        '@contexts': fileURLToPath(new URL('./src/contexts', import.meta.url)),
        '@config': fileURLToPath(new URL('./src/config', import.meta.url)),
        '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
        '@styles': fileURLToPath(new URL('./src/styles', import.meta.url)),
        '@types': fileURLToPath(new URL('./src/types', import.meta.url))
      }
    },

   css: {
    postcss: {
      plugins: [
        // The nesting plugin MUST come before Tailwind CSS
        tailwindcssNesting(),
        tailwindcss(),
        autoprefixer(),
      ],
    },
  },

    server: {
      port: 3000,
      host: true,
      open: true,
      cors: true,
    },

    build: {
      outDir: 'dist',
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'ui-vendor': ['framer-motion', 'lucide-react'],
            'chart-vendor': ['recharts', 'd3'],
            'utils-vendor': ['lodash', 'date-fns']
          }
        }
      },
      chunkSizeWarningLimit: 1000
    },

    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'framer-motion',
        'lucide-react',
        'recharts',
        'lodash',
        'date-fns',
        'axios'
      ]
    },

// TEMPORARILY COMMENT THIS OUT
// define: {
//   __APP_VERSION__: JSON.stringify(version),
//   __BUILD_DATE__: JSON.stringify(new Date().toISOString())
// },

    preview: {
      port: 3000,
      host: true,
      cors: true
    }
  };
});
