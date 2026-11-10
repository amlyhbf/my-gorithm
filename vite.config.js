import {defineConfig,loadEnv} from 'vite';
export default defineConfig(({mode})=>({
  plugins:[{
    name:'firebase-release-manifest',
    generateBundle(){
      const env=loadEnv(mode,process.cwd(),'VITE_');
      const emulator=(process.env.VITE_FIREBASE_EMULATORS||env.VITE_FIREBASE_EMULATORS)==='true';
      this.emitFile({type:'asset',fileName:'release.json',source:JSON.stringify({
        projectId:emulator?'demo-mamgorithm-merge':'my-gorithm',emulator,classificationReviewApplied:false,cards:73
      },null,2)});
    }
  }]
}));
