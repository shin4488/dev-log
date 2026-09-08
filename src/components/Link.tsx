import * as React from 'react';
import { localUrl } from '@/lib/site';

type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & { to: string };

export default function Link({ to, children, ...props }: LinkProps) {
  return (
    <a href={localUrl(to)} {...props}>
      {children}
    </a>
  );
}
