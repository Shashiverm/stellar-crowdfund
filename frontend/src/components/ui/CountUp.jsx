import { useEffect, useState } from 'react';
import { animate } from 'framer-motion';

export default function CountUp({ value = 0, decimals = 1, suffix = '' }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(0, Number(value || 0), {
      duration: 1.5,
      onUpdate(latest) {
        setDisplay(latest);
      },
    });
    return () => controls.stop();
  }, [value]);

  return <span>{display.toFixed(decimals)}{suffix}</span>;
}