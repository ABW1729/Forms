import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateForm from './pages/CreateForm';
import PublicForm from './pages/PublicForm';
import { AuthProvider } from './context/AuthContext';
import Responses from './pages/Responses';
import Register from './pages/Register';
import EditForm from './pages/EditForm';
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/responses/:formId" element={<Responses />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/edit/:id" element={<EditForm />} />
          <Route path="/create" element={<CreateForm />} />
          <Route path="/form/:id" element={<PublicForm />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
export default App;
