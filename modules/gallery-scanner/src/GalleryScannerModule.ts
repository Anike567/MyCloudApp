import { NativeModule, requireNativeModule } from 'expo';

import { GalleryScannerModuleEvents } from './GalleryScanner.types';

declare class GalleryScannerModule extends NativeModule<GalleryScannerModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<GalleryScannerModule>('GalleryScanner');
