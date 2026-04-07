import React from 'react';

// Minimal next/link mock for Storybook (no Next.js router available)
const Link = ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href?: string }) => (
  <a href={href} {...props}>{children}</a>
);

export default Link;
