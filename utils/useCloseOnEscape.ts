import { useEffect } from 'react';

const useCloseOnEscape = (onClose: () => void): void => {
  const handleKeyPress = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);
};

export default useCloseOnEscape;