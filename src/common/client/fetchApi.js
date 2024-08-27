import { errorMessage, resolveOnStorage } from '../misc/utils';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_URL;
const jwtToken = resolveOnStorage('jwtToken');

async function fetchApi(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (jwtToken) {
    defaultHeaders['Authorization'] = `Bearer ${jwtToken}`;
  }

  const config = {
    headers: { ...defaultHeaders, ...options.headers },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok && !response.created) {
        if (response.status === 401 || response.status === 403) {
            errorMessage('Your session has expired, please login again');
            redirectToLogin();
        } else {
            const errorData = await response.json();
            errorMessage(errorData.message);
        }

        return null;
    }

    return await response.json();
  } catch (error) {
    errorMessage();
  }
}

function redirectToLogin() {
    const navigate = useNavigate();
    navigate('/login');
}

export function get(endpoint, options = {}) {
  return fetchApi(endpoint, {
    method: 'GET',
    ...options,
  });
}

export function post(endpoint, body, options = {}) {
  return fetchApi(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
    ...options,
  });
}

export function put(endpoint, body, options = {}) {
  return fetchApi(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body),
    ...options,
  });
}

export function del(endpoint, options = {}) {
  return fetchApi(endpoint, {
    method: 'DELETE',
    ...options,
  });
}
