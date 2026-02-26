// Reexport the native module. On web, it will be resolved to GalleryScannerModule.web.ts
// and on native platforms to GalleryScannerModule.ts
export { default } from './src/GalleryScannerModule';
// export { default as GalleryScannerView } from './src/GalleryScannerView';
export * from  './src/GalleryScanner.types';
