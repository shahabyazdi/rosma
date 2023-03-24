import { useEffect } from 'react';

export default function useClickOutside(ref, callback) {
  useEffect(() => {
    window.addEventListener('click', handleClickOutside);

    function handleClickOutside(event) {
      if (!ref.current?.contains?.(event.target)) callback();
    }

    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);
}
