import * as React from 'react';

import { DeviceIdViewProps } from './DeviceId.types';

export default function DeviceIdView(props: DeviceIdViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
