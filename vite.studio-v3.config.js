// Isolated public Work-facing build. Does not include index.html, Firebase,
// original V2 local AI server or assets in public/.
import {defineConfig} from 'vite';
import {resolve} from 'node:path';

export default defineConfig({
  publicDir:false,
  base:'/',
  build:{
    outDir:'dist-card-studio-v3',
    emptyOutDir:true,
    rollupOptions:{
      input:resolve(process.cwd(),'tools/card-studio-v3.html')
    }
  }
});
