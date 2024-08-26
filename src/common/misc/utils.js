import { toast } from 'react-toastify';

export const resolveOnStorage = item => {
  if (typeof sessionStorage !== 'undefined') {
    return sessionStorage && !!sessionStorage.getItem(item) ? JSON.parse(sessionStorage.getItem(item)) : null;
  }
};

export const saveOnStorage = (name, item) => {
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.setItem(name, JSON.stringify(item));
  }
};

export const clearFromStorage = name => {
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.removeItem(name);
  }
}

export const errorMessage = (msg = 'Internal server error, please try again later.') => {
  toast(msg, {type: 'error'});
};

export const replaceAll = (text, toRemove, toReplace) => {
  return text.split(toRemove).join(toReplace);
};

export default {
  resolveOnStorage,
  saveOnStorage,
  errorMessage
}
