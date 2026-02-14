import * as React from 'react';

import { GalleryScannerViewProps } from './GalleryScanner.types';

export default function GalleryScannerView(props: GalleryScannerViewProps) {
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
