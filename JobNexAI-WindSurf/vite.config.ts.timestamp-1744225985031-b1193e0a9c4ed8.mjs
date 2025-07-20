// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { sentryVitePlugin } from "file:///home/project/node_modules/@sentry/vite-plugin/dist/esm/index.mjs";
import viteCompression from "file:///home/project/node_modules/vite-plugin-compression/dist/index.mjs";
var plugins = [
  react(),
  viteCompression({
    algorithm: "gzip",
    ext: ".gz"
  }),
  viteCompression({
    algorithm: "brotliCompress",
    ext: ".br"
  })
];
plugins.push(
  sentryVitePlugin({
    org: "myself-0sq",
    project: "jobnexus-frontend",
    authToken: "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"
  })
);
var vite_config_default = defineConfig({
  plugins,
  optimizeDeps: {
    include: ["@tanstack/react-virtual"]
  },
  build: {
    sourcemap: true,
    target: "esnext",
    // Set the build target to esnext to support top-level await
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          ui: ["@headlessui/react", "@heroicons/react"],
          i18n: ["i18next", "react-i18next"],
          motion: ["framer-motion"]
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuaW1wb3J0IHsgc2VudHJ5Vml0ZVBsdWdpbiB9IGZyb20gJ0BzZW50cnkvdml0ZS1wbHVnaW4nXG5pbXBvcnQgdml0ZUNvbXByZXNzaW9uIGZyb20gJ3ZpdGUtcGx1Z2luLWNvbXByZXNzaW9uJ1xuXG4vLyBDcmVhdGUgcGx1Z2lucyBhcnJheSB3aXRoIHJlcXVpcmVkIHBsdWdpbnNcbmNvbnN0IHBsdWdpbnMgPSBbXG4gIHJlYWN0KCksXG4gIHZpdGVDb21wcmVzc2lvbih7XG4gICAgYWxnb3JpdGhtOiAnZ3ppcCcsXG4gICAgZXh0OiAnLmd6JyxcbiAgfSksXG4gIHZpdGVDb21wcmVzc2lvbih7XG4gICAgYWxnb3JpdGhtOiAnYnJvdGxpQ29tcHJlc3MnLFxuICAgIGV4dDogJy5icicsXG4gIH0pLFxuXVxuXG4vLyBBZGQgU2VudHJ5IHBsdWdpbiB3aXRoIHRoZSBwcm92aWRlZCBhdXRoIHRva2VuXG5wbHVnaW5zLnB1c2goXG4gIHNlbnRyeVZpdGVQbHVnaW4oe1xuICAgIG9yZzogXCJteXNlbGYtMHNxXCIsXG4gICAgcHJvamVjdDogXCJqb2JuZXh1cy1mcm9udGVuZFwiLFxuICAgIGF1dGhUb2tlbjogXCJzbnRyeXNfZXlKcFlYUWlPakUzTkRReU1USTJOakF1TlRnek5USTBMQ0oxY213aU9pSm9kSFJ3Y3pvdkwzTmxiblJ5ZVM1cGJ5SXNJbkpsWjJsdmJsOTFjbXdpT2lKb2RIUndjem92TDNWekxuTmxiblJ5ZVM1cGJ5SXNJbTl5WnlJNkltMTVjMlZzWmkwd2MzRWlmUT09X3FFWEw1SlBhVDVnMVdGdGZBV0RONFZWdm9paDJiMGhVL1I1YkROU2RvYThcIixcbiAgfSlcbilcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2lucyxcbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgaW5jbHVkZTogWydAdGFuc3RhY2svcmVhY3QtdmlydHVhbCddLFxuICB9LFxuICBidWlsZDoge1xuICAgIHNvdXJjZW1hcDogdHJ1ZSxcbiAgICB0YXJnZXQ6ICdlc25leHQnLCAvLyBTZXQgdGhlIGJ1aWxkIHRhcmdldCB0byBlc25leHQgdG8gc3VwcG9ydCB0b3AtbGV2ZWwgYXdhaXRcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgbWFudWFsQ2h1bmtzOiB7XG4gICAgICAgICAgdmVuZG9yOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbScsICdyZWFjdC1yb3V0ZXItZG9tJ10sXG4gICAgICAgICAgdWk6IFsnQGhlYWRsZXNzdWkvcmVhY3QnLCAnQGhlcm9pY29ucy9yZWFjdCddLFxuICAgICAgICAgIGkxOG46IFsnaTE4bmV4dCcsICdyZWFjdC1pMThuZXh0J10sXG4gICAgICAgICAgbW90aW9uOiBbJ2ZyYW1lci1tb3Rpb24nXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn0pIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF5TixTQUFTLG9CQUFvQjtBQUN0UCxPQUFPLFdBQVc7QUFDbEIsU0FBUyx3QkFBd0I7QUFDakMsT0FBTyxxQkFBcUI7QUFHNUIsSUFBTSxVQUFVO0FBQUEsRUFDZCxNQUFNO0FBQUEsRUFDTixnQkFBZ0I7QUFBQSxJQUNkLFdBQVc7QUFBQSxJQUNYLEtBQUs7QUFBQSxFQUNQLENBQUM7QUFBQSxFQUNELGdCQUFnQjtBQUFBLElBQ2QsV0FBVztBQUFBLElBQ1gsS0FBSztBQUFBLEVBQ1AsQ0FBQztBQUNIO0FBR0EsUUFBUTtBQUFBLEVBQ04saUJBQWlCO0FBQUEsSUFDZixLQUFLO0FBQUEsSUFDTCxTQUFTO0FBQUEsSUFDVCxXQUFXO0FBQUEsRUFDYixDQUFDO0FBQ0g7QUFFQSxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQjtBQUFBLEVBQ0EsY0FBYztBQUFBLElBQ1osU0FBUyxDQUFDLHlCQUF5QjtBQUFBLEVBQ3JDO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxXQUFXO0FBQUEsSUFDWCxRQUFRO0FBQUE7QUFBQSxJQUNSLGVBQWU7QUFBQSxNQUNiLFFBQVE7QUFBQSxRQUNOLGNBQWM7QUFBQSxVQUNaLFFBQVEsQ0FBQyxTQUFTLGFBQWEsa0JBQWtCO0FBQUEsVUFDakQsSUFBSSxDQUFDLHFCQUFxQixrQkFBa0I7QUFBQSxVQUM1QyxNQUFNLENBQUMsV0FBVyxlQUFlO0FBQUEsVUFDakMsUUFBUSxDQUFDLGVBQWU7QUFBQSxRQUMxQjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
