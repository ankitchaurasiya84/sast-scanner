// CodeScanner.js
import React, { useState } from 'react';
import scanCode from 'sast-scan'; // Import your npm package
import jsPDF from 'jspdf'; // Import jsPDF for PDF generation
import './CodeScanner.css'; // Import the CSS file

const CodeScanner = () => {
    const [code, setCode] = useState('');
    const [results, setResults] = useState([]);
    const [file, setFile] = useState(null);

    const handleScan = () => {
        const vulnerabilities = [];

        // Capture console.log output
        const originalConsoleLog = console.log;
        console.log = (message) => vulnerabilities.push(message);

        try {
            scanCode(code); // Call the scanCode function with the code to be scanned
        } catch (error) {
            vulnerabilities.push(`Error: ${error.message}`);
        }

        // Restore console.log
        console.log = originalConsoleLog;

        setResults(vulnerabilities);
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        const reader = new FileReader();
        reader.onload = (event) => {
            setCode(event.target.result); // Set the file contents as code
        };
        reader.readAsText(selectedFile);
    };

    const downloadReport = () => {
        const doc = new jsPDF(); // Create a new PDF document

        doc.setFontSize(12);
        doc.text('Code Scan Results', 10, 10); // Title for the PDF
        doc.setFontSize(10);

        let yOffset = 20; // Initial vertical position for vulnerability text
        results.forEach((result, index) => {
            doc.text(`${index + 1}. ${result}`, 10, yOffset); // Numbered vulnerabilities
            yOffset += 10; // Move text down for each subsequent result
        });

        // Save the PDF with the name 'scan_results.pdf'
        doc.save('scan_results.pdf');
    };

    return (
        <div className="container">
            <h1>Code Scanner</h1>
            <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter code to scan"
            />
            <input
                type="file"
                accept=".js,.txt,.java,.py,.ts" // Restrict to code file formats
                onChange={handleFileChange}
            />
            <button onClick={handleScan}>Scan Code</button>
            {results.length > 0 && (
                <button onClick={downloadReport}>Download Report</button>
            )}
            <div className="results">
                {results.map((result, index) => (
                    <p key={index}>{result}</p>
                ))}
            </div>
        </div>
    );
};

export default CodeScanner;
// import React, { useState } from 'react';
// import scanCode from 'sast-scan'; // Import your npm package

// const CodeScanner = () => {
//     const [code, setCode] = useState('');
//     const [results, setResults] = useState([]);

//     const handleScan = () => {
//         let vulnerabilities = [];

  

//         //  const originalConsoleLog = console.log;
//         //  console.log = (message) => vulnerabilities.push(message);

//         try {
//           vulnerabilities= scanCode(code); // Call the scanCode function with the code to be scanned
//         } catch (error) {
//             //vulnerabilities.push(`Error: ${error.message}`);
//         }

//         //console.log(vulnerabilities)
//         setResults(vulnerabilities);
//     };

//     return (
//         <div>
//             <h1>Code Scanner</h1>
//             <textarea
//                 value={code}
//                 onChange={(e) => setCode(e.target.value)}
//                 placeholder="Enter code to scan"
//             />
//             <button onClick={handleScan}>Scan Code</button>
//             <div>
//                 {results.map((result, index) => (
//                     <div key={index}>
//                     <p >{result.message}</p>
//                     <p >{result.fix}</p>
//                     <p >{result.lineNumber}</p>
//                     </div>
//                 ))}
               
//             </div>
//         </div>
//     );
// };

// export default CodeScanner;



