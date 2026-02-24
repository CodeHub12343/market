'use client';

import { useEffect, useState } from 'react';
import { StyleSheetManager } from 'styled-components';

export default function StyledComponentsRegistry({ children }) {
  const [mounted, setMounted] = useState(false);
  const [styledTarget, setStyledTarget] = useState(null);

  useEffect(() => {
    // Prevent styled-components from breaking in browser
    setMounted(true);
  }, []);

  if (!mounted) return <>{children}</>;

  return (
    <StyleSheetManager shouldForwardProp={(prop) => !prop.startsWith('$')}>
      {children}
    </StyleSheetManager>
  );
}
