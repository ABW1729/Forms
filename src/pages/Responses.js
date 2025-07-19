import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);
export default function Responses() {
  const { token,logout } = useAuth();
  const { formId } = useParams();
  const navigate = useNavigate();
  const [responses, setResponses] = useState([]);
 const [summary, setSummary] = useState([]);
 const [showSummary, setShowSummary] = useState(false);

   useEffect(() => {
    axios.get(`https://forms-production-0d19.up.railway.app/forms/${formId}/submissions`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => setResponses(res.data))
    .catch(err => console.error(err));
  }, [formId, token]);

  const fetchSummary = async () => {
      const res = await axios.get(`https://forms-production-0d19.up.railway.app/forms/summary/${formId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSummary(res.data);
    
    setShowSummary(true);
  };

  const downloadCSV = async (id) => {
    try {
      const res = await axios.get(`https://forms-production-0d19.up.railway.app/export/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'responses.csv');
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error('CSV Download Error:', err);
    }
};
  
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
         <h1 className="text-2xl font-bold text-gray-800 mb-4">Form Responses</h1>
          <button
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
            onClick={logout} 
          >
            Logout
          </button>
         </div>
      <div className="flex justify-between items-center mb-4">
        <button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
            onClick={() => navigate('/dashboard')} 
          >
            Go to Dashboard
          </button>

         
        {responses.length > 0 && (
        <button
            className={`${
            showSummary ? 'bg-gray-600 hover:bg-gray-700' : 'bg-indigo-600 hover:bg-indigo-700'
            } text-white px-4 py-2 rounded transition`}
            onClick={() => {
            if (showSummary) {
                setShowSummary(false);
            } else {
                fetchSummary();
            }
            }}
        >
            {showSummary ? 'Back to Table View' : 'Show Summary View'}
        </button>
        )}
            <button
            onClick={() => downloadCSV(formId)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
            >
            Export CSV
            </button>
      </div>

            {!showSummary ? (
        responses.length === 0 ? (
            <div className="text-center text-gray-600 text-lg mt-10">
            No responses yet.
            </div>
        ) : (
            <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                <tr className="bg-gray-100">
                    <th className="px-4 py-2 border">#</th>
                    <th className="px-4 py-2 border">Name</th>
                    <th className="px-4 py-2 border">Submitted On</th>
                    {responses[0]?.answers.map((ans, idx) => (
                    <th key={idx} className="px-4 py-2 border">
                        {ans.question}
                    </th>
                    ))}
                </tr>
                </thead>

                <tbody>
                {responses.map((res, index) => (
                    <tr key={index} className="border-t">
                    <td className="px-4 py-2 border text-center">{index + 1}</td>
                    <td className="px-4 py-2 border">{res.name}</td>
                    <td className="px-4 py-2 border">
                        {new Date(res.createdAt).toLocaleString()}
                    </td>
                    {res.answers.map((ans, i) => (
                        <td key={i} className="px-4 py-2 border">
                        {Array.isArray(ans.answer) ? ans.answer.join(', ') : ans.answer}
                        </td>
                    ))}
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        )
        ) : (
        <div className="mt-6 space-y-6">

            {summary.map((q, idx) => (
            <div key={idx} className="mb-8 border p-4 rounded-lg bg-white shadow">
                <h2 className="font-semibold text-gray-800 mb-2">{`Q.${idx + 1} ${q.question}`}</h2>

                {q.type === 'text' ? (
                <ul className="list-disc ml-5">
                    {q.answers.map((ans, i) => (
                    <li key={i}>{ans}</li>
                    ))}
                </ul>
                ) : (
                <>
                    <div className="mb-4 space-y-2">
                    {Object.entries(q.counts).map(([option, count]) => (
                        <div key={option} className="flex items-center gap-2">
                        <span className="w-32 text-sm">{option}:</span>
                        <div className="flex-1 bg-gray-200 h-4 rounded">
                            <div
                            className="bg-blue-500 h-4 rounded"
                            style={{
                                width: `${(count / Math.max(...Object.values(q.counts))) * 100}%`,
                            }}
                            />
                        </div>
                        <span className="text-sm">{count}</span>
                        </div>
                    ))}
                    </div>

                    <div className="w-full md:w-1/2 mx-auto">
                    <Pie
                        data={{
                        labels: Object.keys(q.counts),
                        datasets: [
                            {
                            label: 'Responses',
                            data: Object.values(q.counts),
                            backgroundColor: [
                                '#60a5fa',
                                '#fbbf24',
                                '#34d399',
                                '#f87171',
                                '#a78bfa',
                                '#f472b6',
                                '#facc15',
                            ],
                            borderWidth: 1,
                            },
                        ],
                        }}
                    />
                    </div>
                </>
                )}
            </div>
            ))}

        </div>
      )}
    </div>
  );

}
