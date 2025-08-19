
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import InputArea from './InputArea';

describe('InputArea', () => {
  it('renders the input field and buttons', () => {
    render(<InputArea onPlaceSubmit={() => {}} onGiveUp={() => {}} disabled={false} />);
    expect(screen.getByPlaceholderText('Enter a place name')).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();
    expect(screen.getByText('Give Up')).toBeInTheDocument();
  });

  it('updates the input value on change', () => {
    render(<InputArea onPlaceSubmit={() => {}} onGiveUp={() => {}} disabled={false} />);
    const input = screen.getByPlaceholderText('Enter a place name');
    fireEvent.change(input, { target: { value: 'London' } });
    expect(input.value).toBe('London');
  });

  it('calls the onPlaceSubmit callback with the trimmed value when the form is submitted', () => {
    const onPlaceSubmit = jest.fn();
    render(<InputArea onPlaceSubmit={onPlaceSubmit} onGiveUp={() => {}} disabled={false} />);
    const input = screen.getByPlaceholderText('Enter a place name');
    const form = input.closest('form');

    fireEvent.change(input, { target: { value: '  London  ' } });
    fireEvent.submit(form);

    expect(onPlaceSubmit).toHaveBeenCalledWith('London');
  });

  it('calls the onGiveUp callback when the "Give Up" button is clicked', () => {
    const onGiveUp = jest.fn();
    render(<InputArea onPlaceSubmit={() => {}} onGiveUp={onGiveUp} disabled={false} />);
    fireEvent.click(screen.getByText('Give Up'));
    expect(onGiveUp).toHaveBeenCalled();
  });

  it('disables the input and buttons when disabled prop is true', () => {
    render(<InputArea onPlaceSubmit={() => {}} onGiveUp={() => {}} disabled={true} />);
    expect(screen.getByPlaceholderText('Enter a place name')).toBeDisabled();
    expect(screen.getByText('Submit')).toBeDisabled();
    expect(screen.getByText('Give Up')).toBeDisabled();
  });
});
