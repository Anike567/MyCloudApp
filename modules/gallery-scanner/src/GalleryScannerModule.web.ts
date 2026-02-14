import { registerWebModule, NativeModule } from 'expo';

import { ChangeEventPayload } from './GalleryScanner.types';

type GalleryScannerModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
}

class GalleryScannerModule extends NativeModule<GalleryScannerModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
};

export default registerWebModule(GalleryScannerModule, 'GalleryScannerModule');
