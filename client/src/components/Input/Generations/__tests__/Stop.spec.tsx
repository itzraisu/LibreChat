import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Stop from '../Stop';

describe('Stop', () => {
  it('should render the Stop button', () => {
    const { getByText } = render(<Stop />);
    expect(getByText('Stop')).toBeInTheDocument();
  });

  it('should call onClick when the button is clicked', () => {
    const handleClick = jest.fn();
    const { getByText } = render(<Stop onClick={handleClick} />);
    fireEvent.click(getByText('Stop'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should not call onClick when the button is disabled and clicked', () => {
    const handleClick = jest.fn();
    const { getByText } = render(<Stop onClick={handleClick} disabled={true} />);
    fireEvent.click(getByText('Stop'));
    expect(handleClick).toHaveBeenCalledTimes(0);
  });
});

