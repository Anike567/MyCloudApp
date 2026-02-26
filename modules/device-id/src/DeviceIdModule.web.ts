import { registerWebModule, NativeModule } from 'expo';

import { ChangeEventPayload } from './DeviceId.types';

type DeviceIdModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
}

class DeviceIdModule extends NativeModule<DeviceIdModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
};

export default registerWebModule(DeviceIdModule, 'DeviceIdModule');
