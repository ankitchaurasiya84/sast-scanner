import React, { useState } from 'react';
import scanCode from 'sast-scan'; 
import jsPDF from 'jspdf'; 
import './CodeScanner.css'; 

const CodeScanner = () => {
    const [code, setCode] = useState('');
    const [results, setResults] = useState([]);

    const handleFileChange = (e) => {
        const file = e.target.files[0]; 
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setCode(event.target.result); 
            };
            reader.readAsText(file); 
        }
    };

    const handleScan = () => {
        let vulnerabilities = [];

        try {
            vulnerabilities = scanCode(code); 
        } catch (error) {
            vulnerabilities.push(`Error: ${error.message}`);
        }

        setResults(vulnerabilities);
    };

    const downloadReport = () => {
        const doc = new jsPDF(); 

        doc.setFontSize(12);
        doc.text('SAST Report || Code Scan Results', 70, 10); 
        doc.text('_____________________________________________________________________________', 10, 12); 
        // doc.text('_____________________________________________________________________________', 10, 350)
        doc.setFontSize(10);

        let yOffset = 20; // Initial vertical position for vulnerability text
        results.forEach((result, index) => {
            doc.text(`${index + 1}. ${result.message}`, 10, yOffset); 
            yOffset += 10; 
            doc.text(`${result.lineNumber}`, 14, yOffset);
            yOffset += 10; 
            doc.text(`${result.fix}`, 14, yOffset); 

            yOffset += 10; // Move text down for each subsequent result
        });


        doc.save('scan_results.pdf');
    };

    return (
        <div className="container">
            <h1>Code Scanner</h1>

    
            <input type="file" accept=".js,.txt,.ts" onChange={handleFileChange} className="file-input" />

        
            <div className="code-editor-wrapper">
                <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter code or paste file content to scan"
                    className="code-editor"
                />
            </div>


            <button className="scan-button" onClick={handleScan}>Scan Code</button>

            <div className="results">
                {results.map((result, index) => (
                    <div key={index}>
                        <p>{result.message}</p>
                        <p>{result.fix}</p>
                        <p>{result.lineNumber}</p>
                    </div>
                ))}
            </div>

        
            {results.length > 0 && (
                <button className="report-button" onClick={downloadReport}>Download Report</button>
            )}
        </div>
    );
};

export default CodeScanner;