'use client';

import React from 'react';
import VLibras from '@moreiraste/react-vlibras';

export function VLibrasWidget(props: React.ComponentProps<typeof VLibras>) {
  return <VLibras {...props} />;
}
