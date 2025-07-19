import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function EditForm() {
  const { id } = useParams();
  const { token,logout } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`https://forms-production-0d19.up.railway.app/forms/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setForm(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching form', err);
        setLoading(false);
      });
  }, [id, token]);

  const handleSave = () => {
    if (!form.questions.length) {
      alert('Form needs at least one question.');
      return;
    }

    for (const q of form.questions) {
      if (q.type === 'mcq' && (!q.options || q.options.length === 0)) {
        alert('Each MCQ question must have at least one option.');
        return;
      }
    }

    axios
      .put(
        `https://forms-production-0d19.up.railway.app/forms/${id}`,
        { ...form },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        alert('Form updated!');
        navigate('/dashboard');
      })
      .catch((err) => {
        console.error('Update error', err);
      });
  };
    const handleLogout = () => {
        logout();
        navigate('/');
    };
    

  if (loading) return <p className="p-4">Loading...</p>;
  if (!form) return <p className="p-4 text-red-500">Form not found</p>;

  return (
  <div className="p-6 max-w-3xl mx-auto">
    <div className="flex justify-between mb-4">
      <button
        onClick={() => navigate('/dashboard')}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Go to Dashboard
      </button>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>

    <h1 className="text-2xl font-bold mb-4">Edit Form</h1>

    <label className="block mb-2 font-medium">Form Title</label>
    <input
      value={form.title}
      onChange={(e) => setForm({ ...form, title: e.target.value })}
      className="w-full p-2 border border-gray-300 rounded mb-4"
    />

    <button
      onClick={() => {
        const newQuestion = {
          text: 'New question',
          type: 'mcq',
          options: ['Option 1'],
          required: false,
        };
        setForm({ ...form, questions: [...form.questions, newQuestion] });
      }}
      className="mb-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
    >
      + Add Question
    </button>

    {form.questions.map((q, index) => (
      <div
        key={index}
        className="border p-3 rounded shadow-sm bg-white mb-4 relative"
      >
       
          <span className="text-gray-500 font-semibold">Question {index + 1}</span>
          <div className="flex gap-2">
            <button
              disabled={index === 0}
              onClick={() => {
                if (index > 0) {
                  const updated = [...form.questions];
                  [updated[index], updated[index - 1]] = [updated[index - 1], updated[index]];
                  setForm({ ...form, questions: updated });
                }
              }}
              className="text-sm px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              ↑
            </button>
            <button
              disabled={index === form.questions.length - 1}
              onClick={() => {
                if (index < form.questions.length - 1) {
                  const updated = [...form.questions];
                  [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
                  setForm({ ...form, questions: updated });
                }
              }}
              className="text-sm px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              ↓
            </button>
          </div>
     

        <button
          onClick={() => {
            const updated = [...form.questions];
            updated.splice(index, 1);
            if (updated.length === 0) {
              alert("Form needs at least one question.");
              return;
            }
            setForm({ ...form, questions: updated });
          }}
          className="absolute top-2 right-2 text-sm bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
        >
          Delete
        </button>

        <label className="block mb-1 font-semibold mt-2">Question Text</label>
        <input
          value={q.text}
          onChange={(e) => {
            const updated = [...form.questions];
            updated[index].text = e.target.value;
            setForm({ ...form, questions: updated });
          }}
          className="w-full p-2 border border-gray-300 rounded mb-2"
        />

        <div className="flex justify-between items-center mb-2">
          <div>
            <label className="block font-semibold">Type</label>
            <select
              value={q.type}
              onChange={(e) => {
                const updated = [...form.questions];
                updated[index].type = e.target.value;
                if (e.target.value === 'mcq') {
                  updated[index].options = ['Option 1'];
                } else {
                  delete updated[index].options;
                }
                setForm({ ...form, questions: updated });
              }}
              className="p-2 border rounded"
            >
              <option value="mcq">Multiple Choice</option>
              <option value="text">Text</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="font-semibold">Required</label>
            <input
              type="checkbox"
              checked={q.required}
              onChange={(e) => {
                const updated = [...form.questions];
                updated[index].required = e.target.checked;
                setForm({ ...form, questions: updated });
              }}
            />
          </div>
        </div>

        {q.type === 'mcq' && (
          <>
            <label className="block mb-1 font-semibold">Options</label>
            {q.options.map((opt, optIdx) => (
              <div key={optIdx} className="flex items-center gap-2 mb-1">
                <input
                  value={opt}
                  onChange={(e) => {
                    const updated = [...form.questions];
                    updated[index].options[optIdx] = e.target.value;
                    setForm({ ...form, questions: updated });
                  }}
                  className="w-full p-1 border border-gray-300 rounded"
                />
                <button
                  onClick={() => {
                    const updated = [...form.questions];
                    updated[index].options.splice(optIdx, 1);
                    if (updated[index].options.length === 0) {
                      alert("MCQ must have at least one option.");
                      return;
                    }
                    setForm({ ...form, questions: updated });
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
                >
                  ✕
                </button>
                <button
                  disabled={optIdx === 0}
                  onClick={() => {
                    const updated = [...form.questions];
                    const opts = updated[index].options;
                    [opts[optIdx], opts[optIdx - 1]] = [opts[optIdx - 1], opts[optIdx]];
                    setForm({ ...form, questions: updated });
                  }}
                  className="text-sm px-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  ↑
                </button>
                <button
                  disabled={optIdx === q.options.length - 1}
                  onClick={() => {
                    const updated = [...form.questions];
                    const opts = updated[index].options;
                    [opts[optIdx], opts[optIdx + 1]] = [opts[optIdx + 1], opts[optIdx]];
                    setForm({ ...form, questions: updated });
                  }}
                  className="text-sm px-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  ↓
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                const updated = [...form.questions];
                updated[index].options.push(`Option ${q.options.length + 1}`);
                setForm({ ...form, questions: updated });
              }}
              className="mt-2 text-sm bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
            >
              + Add Option
            </button>
          </>
        )}
      </div>
    ))}

    <button
      onClick={handleSave}
      className="mt-6 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
    >
      Save Changes
    </button>
  </div>
);
}
