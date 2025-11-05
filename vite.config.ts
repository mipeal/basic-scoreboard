import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import sourceIdentifierPlugin from 'vite-plugin-source-identifier'
import type { Connect } from 'vite'

const isProd = process.env.BUILD_MODE === 'prod'

// Custom proxy middleware to handle dynamic CTFd URLs
const ctfdProxyMiddleware: Connect.NextHandleFunction = async (req, res, next) => {
  if (!req.url?.startsWith('/ctfd-api/')) {
    return next();
  }

  const ctfdUrl = req.headers['x-ctfd-url'] as string;
  if (!ctfdUrl) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Missing X-CTFd-URL header' }));
    return;
  }

  try {
    // Remove /ctfd-api prefix from path
    const targetPath = req.url.replace('/ctfd-api', '');
    const targetUrl = `${ctfdUrl}${targetPath}`;
    
    console.log(`\n🔄 Proxying request:`);
    console.log(`   From: ${req.url}`);
    console.log(`   To: ${targetUrl}`);
    console.log(`   Auth: ${req.headers['authorization'] ? '✓ Present' : '✗ Missing'}`);

    // Forward the request
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Authorization': req.headers['authorization'] || '',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    console.log(`   Response: ${response.status} ${response.statusText}`);

    // Copy response headers
    const responseHeaders: Record<string, string> = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-CTFd-URL',
    };

    const contentType = response.headers.get('Content-Type');
    if (contentType) {
      responseHeaders['Content-Type'] = contentType;
    }

    res.writeHead(response.status, responseHeaders);

    // Stream response body
    const body = await response.text();
    console.log(`   Body length: ${body.length} bytes\n`);
    res.end(body);
  } catch (error: any) {
    console.error('❌ Proxy error:', error.message);
    res.writeHead(502, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Proxy error: ' + error.message }));
  }
};

export default defineConfig({
  base: '/basic-scoreboard/',
  plugins: [
    react(), 
    sourceIdentifierPlugin({
      enabled: !isProd,
      attributePrefix: 'data-matrix',
      includeProps: true,
    }),
    {
      name: 'ctfd-proxy',
      configureServer(server) {
        server.middlewares.use(ctfdProxyMiddleware);
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
  },
})
