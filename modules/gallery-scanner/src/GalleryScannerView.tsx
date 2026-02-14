import { requireNativeView } from 'expo';
import * as React from 'react';

import { GalleryScannerViewProps } from './GalleryScanner.types';

const NativeView: React.ComponentType<GalleryScannerViewProps> =
  requireNativeView('GalleryScanner');

export default function GalleryScannerView(props: GalleryScannerViewProps) {
  return <NativeView {...props} />;
}
