import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { get, post } from '../../../common/client/fetchApi';
import { errorMessage } from '../../../common/misc/utils';
import ExecuteOperationForm from '../ExecuteOperationForm';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('../../../common/client/fetchApi', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

jest.mock('../../../common/misc/utils', () => ({
  errorMessage: jest.fn(),
}));

describe('ExecuteOperationForm', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the form correctly', async () => {
    get.mockResolvedValue({
      json: jest.fn().mockResolvedValue([
        { id: '1', operationType: 'ADDITION', cost: 10 },
        { id: '2', operationType: 'SUBTRACTION', cost: 5 },
      ]),
    });

    render(<ExecuteOperationForm />);

    await waitFor(() => {
      expect(get).toHaveBeenCalledWith('/operations');
    });

    expect(screen.getByLabelText(/operation/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /execute/i })).toBeInTheDocument();
  });

  it('shows validation error when operation type is not selected', async () => {
    render(<ExecuteOperationForm />);

    fireEvent.click(screen.getByRole('button', { name: /execute/i }));

    await waitFor(() => {
      expect(screen.getByText('Please select operation type')).toBeInTheDocument();
    });

    expect(post).not.toHaveBeenCalled();
  });

  it('shows validation error when operand one is not selected', async () => {
    get.mockResolvedValue({
      json: jest.fn().mockResolvedValue([
        { id: '1', operationType: 'ADDITION', cost: 10 },
      ]),
    });

    render(<ExecuteOperationForm />);

    await waitFor(() => {
      expect(screen.getByLabelText(/operation/i)).toBeInTheDocument();
    });

    fireEvent.mouseDown(screen.getByLabelText(/operation/i));
    const listbox = screen.getByRole('listbox');
    fireEvent.click(within(listbox).getByText(/ADDITION/i));

    fireEvent.click(screen.getByRole('button', { name: /execute/i }));

    await waitFor(() => {
      expect(errorMessage).toHaveBeenCalledWith('Operand one is required');
    });

    expect(post).not.toHaveBeenCalled();
  });

  it('shows validation error when operand two is not selected', async () => {
    get.mockResolvedValue({
      json: jest.fn().mockResolvedValue([
        { id: '1', operationType: 'ADDITION', cost: 10 },
      ]),
    });

    render(<ExecuteOperationForm />);

    await waitFor(() => {
      expect(screen.getByLabelText(/operation/i)).toBeInTheDocument();
    });

    fireEvent.mouseDown(screen.getByLabelText(/operation/i));
    const listbox = screen.getByRole('listbox');
    fireEvent.click(within(listbox).getByText(/ADDITION/i));

    fireEvent.change(screen.getByLabelText(/operand one/i), {
      target: { value: '10' },
    });

    fireEvent.click(screen.getByRole('button', { name: /execute/i }));

    await waitFor(() => {
      expect(errorMessage).toHaveBeenCalledWith('Operand two is required');
    });

    expect(post).not.toHaveBeenCalled();
  });

  it('not show operands in random string operation type', async () => {
    get.mockResolvedValue({
      json: jest.fn().mockResolvedValue([
        { id: '1', operationType: 'RANDOM_STRING', cost: 10 },
      ]),
    });

    render(<ExecuteOperationForm />);

    await waitFor(() => {
      expect(screen.getByLabelText(/operation/i)).toBeInTheDocument();
    });

    fireEvent.mouseDown(screen.getByLabelText(/operation/i));
    const listbox = screen.getByRole('listbox');
    fireEvent.click(within(listbox).getByText(/RANDOM_STRING/i));

    const operandOneField = screen.queryByText('Operand One');
    const operandTwoField = screen.queryByText('Operand Two');

    expect(operandOneField).not.toBeInTheDocument();
    expect(operandTwoField).not.toBeInTheDocument();
  });

  it('show only operand one in square root operation type', async () => {
    get.mockResolvedValue({
      json: jest.fn().mockResolvedValue([
        { id: '1', operationType: 'SQUARE_ROOT', cost: 10 },
      ]),
    });

    render(<ExecuteOperationForm />);

    await waitFor(() => {
      expect(screen.getByLabelText(/operation/i)).toBeInTheDocument();
    });

    fireEvent.mouseDown(screen.getByLabelText(/operation/i));
    const listbox = screen.getByRole('listbox');
    fireEvent.click(within(listbox).getByText(/SQUARE_ROOT/i));

    const operandOneField = screen.queryAllByText('Operand One');
    const operandTwoField = screen.queryByText('Operand Two');
    
    expect(operandOneField[0]).toBeInTheDocument();
    expect(operandTwoField).not.toBeInTheDocument();
  });

  it('submits the form correctly with valid inputs', async () => {
    get.mockResolvedValue({
      json: jest.fn().mockResolvedValue([
        { id: '1', operationType: 'ADDITION', cost: 10 },
      ]),
    });

    post.mockResolvedValue({
      json: jest.fn().mockResolvedValue({ result: 15 }),
    });

    render(<ExecuteOperationForm />);

    await waitFor(() => {
      expect(screen.getByLabelText(/operation/i)).toBeInTheDocument();
    });

    fireEvent.mouseDown(screen.getByLabelText(/operation/i));
    const listbox = screen.getByRole('listbox');
    fireEvent.click(within(listbox).getByText(/ADDITION/i));

    fireEvent.change(screen.getByLabelText(/operand one/i), {
      target: { value: '10' },
    });
    fireEvent.change(screen.getByLabelText(/operand two/i), {
      target: { value: '5' },
    });

    fireEvent.click(screen.getByRole('button', { name: /execute/i }));

    await waitFor(() => {
      expect(post).toHaveBeenCalledWith('/operations', {
        transactionId: expect.any(String),
        operationType: 'ADDITION',
        operands: [10, 5],
      });

      expect(screen.getByText(/result: 15/i)).toBeInTheDocument();
    });
  });
});
