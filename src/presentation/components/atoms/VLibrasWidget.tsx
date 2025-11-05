'use client';

import React from 'react';
import VLibras from '@moreiraste/react-vlibras';

// Use the component's own props type if available; fallback to unknown if not.
export function VLibrasWidget(props: React.ComponentProps<typeof VLibras>) {
  return <VLibras {...props} />;
}
