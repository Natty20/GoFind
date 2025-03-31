import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from './Button';

test('le bouton affiche le bon texte', () => {
  render(<Button label="Clique moi" />);
  expect(screen.getByText('Clique moi')).toBeInTheDocument();
});
