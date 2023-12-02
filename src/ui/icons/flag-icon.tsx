import type { SVGAttributes } from 'react';
import React from 'react';

type Props = SVGAttributes<SVGElement>;

export function FlagIcon(props: Props) {
  return (
    <svg viewBox="0 0 48 48" {...props}>
      <line x1="8" x2="8" y1="47" y2="1" />
      <path d="M8,3S18.13,0.06,27,4,44,2,44,2V22s-8.12,5.94-17,2S8,23,8,23" />
    </svg>
  );
}
