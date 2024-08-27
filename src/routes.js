import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './pages/auth/Login';
import Records from './pages/record/Records';
import ExecuteOperation from './pages/operation/ExecuteOperation';

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Records />} />
        <Route path="/login" element={<Login />} />
        <Route path="/operation/execute-operation" element={<ExecuteOperation />} />
      </Routes>
    </BrowserRouter>
  )
}
