import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { get, patch } from '../../../common/client/fetchApi';
import RecordList from '../RecordList';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('../../../common/client/fetchApi', () => ({
  get: jest.fn(),
  patch: jest.fn(),
}));

jest.mock('../../../components/common/CustomPagination', () => ({ onChangePage, onChangeLimit, paginationConfig }) => (
  <div>
    <button onClick={() => onChangePage(null, 2)}>Next Page</button>
    <button onClick={(e) => onChangeLimit(e)}>Change Limit</button>
  </div>
));
jest.mock('../../../components/common/DeleteModal', () => ({ onCancel, onSubmit }) => (
  <div>
    <button onClick={onCancel}>Cancel</button>
    <button onClick={onSubmit}>Submit</button>
  </div>
));

describe('RecordList', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    get.mockResolvedValueOnce({ json: jest.fn().mockResolvedValue({ content: [], totalPages: 1, totalElements: 0 }) });
  
    render(<RecordList />);
  
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
