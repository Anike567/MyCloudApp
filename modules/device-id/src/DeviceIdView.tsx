import { requireNativeView } from 'expo';
import * as React from 'react';

import { DeviceIdViewProps } from './DeviceId.types';

const NativeView: React.ComponentType<DeviceIdViewProps> =
  requireNativeView('DeviceId');

export default function DeviceIdView(props: DeviceIdViewProps) {
  return <NativeView {...props} />;
}
