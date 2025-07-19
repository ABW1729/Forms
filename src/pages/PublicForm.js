import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function PublicForm() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [name, setName] = useState('');
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`http://13.217.199.166:5000/forms/${id}`).then(res => {
      setForm(res.data);
      setAnswers(res.data.questions.map(() => ''));
    });
  }, [id]);

  const handleSubmit = async () => {
    if (answers.some(ans => !ans.trim())) {
      setError('Please fill all fields before submitting.');
      return;
    }

    const payload = form.questions.map((q, i) => ({ question: q.text, answer: answers[i] }));
    await axios.post(`http://13.217.199.166:5000/forms/${id}/submit`, {  name:name,answers: payload });
    setSubmitted(true);
    setError('');
  };

  if (!form) return <div className="text-center p-4">Loading...</div>;

  if (submitted)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-green-700 bg-green-100 border border-green-400 px-6 py-4 rounded">
          Thank you! Your feedback has been submitted.
        </div>
      </div>
    );

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-4 text-center">{form.title}</h2>

      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
            <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="mb-4 p-2 border rounded w-full"
        />
    {form.questions.map((q, i) => (
    <div key={i} className="mb-4">
                    <label className="block text-gray-700 font-medium mb-1">
            Q.{i + 1} {q.text}
            </label>

        {q.type === 'text' ? (
        <input
            type="text"
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring focus:ring-blue-300"
            value={answers[i]}
            onChange={e => {
            const updated = [...answers];
            updated[i] = e.target.value;
            setAnswers(updated);
            }}
            required
        />
        ) : (
        <div className="space-y-2">
            {q.options.map((opt, idx) => (
            <label key={idx} className="flex items-center space-x-2">
                <input
                type="radio"
                name={`question-${i}`}
                value={opt}
                checked={answers[i] === opt}
                onChange={() => {
                    const updated = [...answers];
                    updated[i] = opt;
                    setAnswers(updated);
                }}
                className="form-radio text-blue-600"
                />
                <span>{opt}</span>
            </label>
            ))}
        </div>
        )}
    </div>
    ))}

      <button
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  );
}
