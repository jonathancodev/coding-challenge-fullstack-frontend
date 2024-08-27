import { clearFromStorage, errorMessage, resolveOnStorage } from '../misc/utils';

const API_BASE_URL = process.env.REACT_APP_API_URL;

async function fetchApi(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  const jwtToken = resolveOnStorage('jwtToken');

  if (jwtToken) {
    defaultHeaders['Authorization'] = `Bearer ${jwtToken}`;
  }

  const config = {
    headers: { ...defaultHeaders, ...options.headers },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (response.status !== 200 && response.status !== 201) {
        if (response.status === 401 || response.status === 403) {
            errorMessage('Your session has expired, please login again');
            redirectToLogin();
        } else {
            const errorData = await response.json();
            errorMessage(errorData.message);
        }

        return null;
    }

    return response;
  } catch (error) {
    console.error(error);
    errorMessage();
  }
}

function redirectToLogin() {
    clearFromStorage('jwtToken');
    setTimeout(() => {
        window.location = '/login';
    }, 2000);
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

export function patch(endpoint, body, options = {}) {
  return fetchApi(endpoint, {
    method: 'PATCH',
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
