import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { post } from '../../../common/client/fetchApi';
import { saveOnStorage } from '../../../common/misc/utils';
import LoginForm from '../LoginForm';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('../../../common/client/fetchApi', () => ({
  post: jest.fn(),
}));

jest.mock('../../../common/misc/utils', () => ({
  saveOnStorage: jest.fn(),
}));

describe('LoginForm', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the login form', () => {
    render(<LoginForm />);
    
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('shows validation errors when form is submitted empty', async () => {
    render(<LoginForm />);
    
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    expect(await screen.findByText(/please enter your username/i)).toBeInTheDocument();
    expect(screen.getByText(/please enter your password/i)).toBeInTheDocument();
  });

  it('submits the form successfully when inputs are valid', async () => {
    const mockResponse = {
      json: jest.fn().mockResolvedValue({ token: 'mockToken' }),
    };
    post.mockResolvedValue(mockResponse);
    
    render(<LoginForm />);
    
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    await waitFor(() => {
      expect(post).toHaveBeenCalledWith('/auth/login', { username: 'testuser', password: 'password123' });
      expect(mockResponse.json).toHaveBeenCalled();
      expect(saveOnStorage).toHaveBeenCalledWith('jwtToken', 'mockToken');
    });
  });

  it('does not submit the form when validation fails', async () => {
    render(<LoginForm />);
    
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: '' } });
    
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    await waitFor(() => {
      expect(post).not.toHaveBeenCalled();
    });
  });
});
