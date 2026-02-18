'use client';

import { useEffect, useState } from 'react';

export default function StyledComponentsRegistry({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Hydration fix - defer mount state update
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Prevents hydration mismatch by not rendering until client-side
  if (!mounted) {
    return null;
  }

  return <>{children}</>;
}
