import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { token, logout } = useAuth();
  const [forms, setForms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('https://forms-production-0d19.up.railway.app/forms', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setForms(res.data))
      .catch((err) => console.error('Error fetching forms', err));
  }, [token]);



  const handleDelete = async (id) => {
  if (!window.confirm('Are you sure you want to delete this form?')) return;
  try {
    await axios.delete(`https://forms-production-0d19.up.railway.app/forms/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setForms(forms.filter((form) => form._id !== id));
  } catch (err) {
    console.error('Error deleting form:', err);
  }
};


  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Your Forms</h1>

          <div className="flex items-center gap-4">
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded transition"
              onClick={() => navigate('/create')}
            >
              + Create New Form
            </button>
            <button
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded transition"
              onClick={() => {
                logout();         
                navigate('/'); 
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Forms List */}
        {forms.length === 0 ? (
          <p className="text-gray-500">No forms created yet.</p>
        ) : (
          <ul className="space-y-4">
            {forms.map((form) => (
              <li
                key={form._id}
                className="p-4 bg-white shadow-sm border border-gray-200 rounded-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-lg font-medium text-gray-900">{form.title}</p>
                    <a
                      className="text-blue-600 hover:underline text-sm mt-1 block"
                      href={`/form/${form._id}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View/Share Link
                    </a>
                  </div>
                  <div className="mt-3 sm:mt-0 flex gap-2">
                
                    <button
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 rounded text-sm transition"
                      onClick={() => navigate(`/responses/${form._id}`)}
                    >
                      View Responses
                    </button>
                                    <button
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1.5 rounded text-sm transition"
                    onClick={() => navigate(`/edit/${form._id}`)}
                >
                    Edit
                            </button>
                            <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded text-sm transition"
                onClick={() => handleDelete(form._id)}
            >
                Delete
            </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
