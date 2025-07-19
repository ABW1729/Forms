import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CreateForm() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([
    { text: '', type: 'text', options: [''], required: false }
  ]);

  const addQuestion = () => {
    setQuestions([...questions, { text: '', type: 'text', options: [''], required: false }]);
  };

  const removeQuestion = (index) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  const moveQuestionUp = (index) => {
    if (index === 0) return;
    const updated = [...questions];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    setQuestions(updated);
  };

  const moveQuestionDown = (index) => {
    if (index === questions.length - 1) return;
    const updated = [...questions];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    setQuestions(updated);
  };

  const handleChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;

    if (field === 'type' && value === 'text') {
      updated[index].options = [''];
    } else if (field === 'type' && value === 'mcq') {
      updated[index].options = ['', ''];
    }

    setQuestions(updated);
  };


 const Logout = () => {
  logout();
  navigate('/');
};
  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  const addOption = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].options.push('');
    setQuestions(updated);
  };

  const removeOption = (qIndex, optIndex) => {
    const updated = [...questions];
    updated[qIndex].options.splice(optIndex, 1);
    setQuestions(updated);
  };

  const createForm = async () => {
    if (!title.trim()) {
      alert("Please enter a form title.");
      return;
    }

    try {
      await axios.post('https://forms-production-0d19.up.railway.app/forms', { title, questions }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/dashboard');
    } catch (error) {
      console.error("Error creating form:", error);
      alert("Failed to create form");
    }
  };

const handleSubmit = () => {
  if (questions.length === 0) {
    alert('Form must contain at least one question.');
    return;
  }

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    if (!q.question || q.question.trim() === '') {
      alert(`Question ${i + 1} must have a title.`);
      return;
    }
    if (q.type === 'mcq') {
      const validOptions = q.options.filter(opt => opt.trim() !== '');
      if (validOptions.length === 0) {
        alert(`Question ${i + 1} must have at least one valid option.`);
        return;
      }
    }
  }

  createForm();
};



  const moveOptionUp = (qIndex, optIndex) => {
  if (optIndex === 0) return;
  const updated = [...questions];
  const opts = updated[qIndex].options;
  [opts[optIndex - 1], opts[optIndex]] = [opts[optIndex], opts[optIndex - 1]];
  setQuestions(updated);
};

const moveOptionDown = (qIndex, optIndex) => {
  const updated = [...questions];
  const opts = updated[qIndex].options;
  if (optIndex >= opts.length - 1) return;
  [opts[optIndex + 1], opts[optIndex]] = [opts[optIndex], opts[optIndex + 1]];
  setQuestions(updated);
};

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded mt-10">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Create Feedback Form</h2>
        <div className="flex gap-3">
          <button
            className="text-sm text-blue-600 underline"
            onClick={() => navigate('/dashboard')}
          >
            Go to Dashboard
          </button>
          <button
            className="text-sm text-red-600 underline"
            onClick={Logout}
          >
            Logout
          </button>
        </div>
      </div>

      <input
        className="border border-gray-300 p-2 w-full mb-6 rounded"
        placeholder="Form Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      {questions.map((q, i) => (
        <div key={i} className="mb-6 p-4 border border-gray-200 rounded bg-gray-50">
          <div className="flex justify-between items-center mb-2">
            <label className="font-semibold text-gray-700">Question {i + 1}</label>
            <div className="flex gap-2">
              <button
                onClick={() => moveQuestionUp(i)}
                className="text-sm bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
              >
                ↑
              </button>
              <button
                onClick={() => moveQuestionDown(i)}
                className="text-sm bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
              >
                ↓
              </button>
              <button
                onClick={() => removeQuestion(i)}
                className="text-sm bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>

          <input
            className="border p-2 w-full mb-3 rounded"
            placeholder="Question Text"
            value={q.text}
            onChange={e => handleChange(i, 'text', e.target.value)}
          />

          <div className="flex items-center gap-4 mb-3">
            <select
              className="border p-2 rounded"
              value={q.type}
              onChange={e => handleChange(i, 'type', e.target.value)}
            >
              <option value="text">Text</option>
              <option value="mcq">Multiple Choice</option>
            </select>

            <label className="flex items-center gap-1 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={q.required}
                onChange={e => handleChange(i, 'required', e.target.checked)}
              />
              Required
            </label>
          </div>

          {q.type === 'mcq' && (
            <div>
              <label className="block text-sm text-gray-600 mb-1">Options:</label>
                    {q.options.map((opt, optIndex) => (
            <div key={optIndex} className="flex items-center gap-2 mb-2">
                <input
                className="border p-2 w-full rounded"
                placeholder={`Option ${optIndex + 1}`}
                value={opt}
                onChange={e => handleOptionChange(i, optIndex, e.target.value)}
                />
                <button
                disabled={optIndex === 0}
                onClick={() => moveOptionUp(i, optIndex)}
                className="px-2 py-1 text-sm bg-gray-300 rounded disabled:opacity-50"
                title="Move Up"
                >
                ↑
                </button>

                <button
                disabled={optIndex === q.options.length - 1}
                onClick={() => moveOptionDown(i, optIndex)}
                className="px-2 py-1 text-sm bg-gray-300 rounded disabled:opacity-50"
                title="Move Down"
                >
                ↓
                </button>
                {q.options.length > 1 && (
                <button
                    className="px-2 py-1 text-sm bg-red-500 text-white rounded"
                    onClick={() => removeOption(i, optIndex)}
                    title="Remove Option"
                >
                    ✕
                </button>
                )}
            </div>
            ))}

              <button
                className="mt-2 px-3 py-1 text-sm bg-blue-500 text-white rounded"
                onClick={() => addOption(i)}
              >
                + Add Option
              </button>
            </div>
          )}
        </div>
      ))}

      <div className="flex gap-4">
        <button
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
          onClick={addQuestion}
        >
          + Add Question
        </button>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={handleSubmit}
        >
          Create Form
        </button>
      </div>
    </div>
  );
}
