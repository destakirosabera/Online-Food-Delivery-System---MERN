import React, { useState, useCallback } from 'react';
import axios from 'axios';

// A simple markdown renderer
const SimpleMarkdown = ({ text }) => {
    const formatText = (txt) => {
        return txt
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
            .replace(/\*(.*?)\*/g, '<em>$1</em>')       // Italic
            .replace(/`([^`]+)`/g, '<code class="bg-gray-200 rounded px-1 py-0.5 text-sm">$1</code>') // Inline code
            .split('\n').map(line => {
                if (line.startsWith('# ')) return `<h1 class="text-2xl font-bold mt-4 mb-2">${line.substring(2)}</h1>`;
                if (line.startsWith('## ')) return `<h2 class="text-xl font-semibold mt-3 mb-1">${line.substring(3)}</h2>`;
                if (line.startsWith('* ')) return `<li class="ml-6 list-disc">${line.substring(2)}</li>`;
                return line;
            }).join('<br />');
    };

    return (
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: formatText(text) }} />
    );
};


const AdminReportPage = () => {
    const [report, setReport] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // This token is a placeholder for a real JWT token obtained after admin login.
    // In a complete system, this would be retrieved from AuthContext or localStorage.
    const MOCK_ADMIN_JWT = 'mock_admin_token_for_demonstration';

    const generateReport = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setReport('');
        try {
            // The API call is sent to the backend server, which will securely handle the Gemini API interaction.
            const response = await axios.post(
                '/api/report/generate',
                {}, // No body needed for this request
                {
                    // In a real MERN app, the base URL (e.g., http://localhost:5000) would be configured in an axios instance
                    // and the token would be dynamically sourced from an authentication context.
                    headers: {
                        'Authorization': `Bearer ${MOCK_ADMIN_JWT}`
                    }
                }
            );
            setReport(response.data.report);
        } catch (err) {
            console.error("Error generating report:", err);
            const errorMessage = err.response?.data?.message || "An unexpected error occurred. Please ensure the server is running and the API key is configured.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return (
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-4xl mx-auto">
            <div className="border-b pb-4 mb-6">
                <h2 className="text-3xl font-bold text-gray-900">Logistics Intelligence Report</h2>
                <p className="text-md text-gray-600 mt-1">
                    Utilize Google Gemini to generate a textual analysis of recent logistics and delivery data.
                </p>
            </div>
            
            <div className="flex justify-center mb-6">
                <button
                    onClick={generateReport}
                    disabled={isLoading}
                    className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
                >
                    {isLoading ? (
                        <div className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generating Report...
                        </div>
                    ) : 'Generate Intelligence Report'}
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                </div>
            )}
            
            {report && (
                <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">Generated Report:</h3>
                    <div className="text-gray-700 leading-relaxed">
                        <SimpleMarkdown text={report} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminReportPage;