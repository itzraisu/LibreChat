import { render, fireEvent } from '@testing-library/react';
import Button from '../Button';

describe('Button', () => {
  const renderButton = (type, onClick, children) => {
    return render(
      <Button type={type} onClick={onClick}>
        {children}
      </Button>
    );
  };

  it('renders with the correct type and children', () => {
    const { getByTestId, getByText } = renderButton(
      'regenerate',
      () => {},
      'Regenerate'
    );
    expect(getByTestId('regenerate-generation-button')).toBeInTheDocument();
    expect(getByText('Regenerate')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    const { getByText } = renderButton('continue', handleClick, 'Continue');
    fireEvent.click(getByText('Continue'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
