import { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [showTable, setShowTable] = useState(false);
  const textareaRef = useRef(null);

  const handleChange = (e) => {
    setInputText(e.target.value);
    setShowTable(false); // Hide table when input changes
  };

  // Auto-resize function for the textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputText]);

  const handleSubmit = () => {
    setOutputText(inputText);
    // Show table only for a specific input query (you can customize this condition)
    if (inputText.toLowerCase().includes('show all employees who joined after 2020')) {
      setShowTable(true);
    } else {
      setShowTable(false);
    }
  };

  return (
    <div className="app-container">
      <div className="sidebar">
        <h2>History</h2>
        <button>Logout</button>
      </div>
      <div className="content">
        <h1>Text to SQL</h1>
        <div className="input-section">
          <textarea
            ref={textareaRef}
            value={inputText}
            onChange={handleChange}
            placeholder="Enter your text"
            rows="1" // Start with 1 row by default
          />
          <button onClick={handleSubmit}>Submit</button>
        </div>
        <div className="output-section">
          <textarea
            value={outputText}
            readOnly
            placeholder=""
            rows="5"
          />
        </div>
        {showTable && (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>id</th>
                  <th>name</th>
                  <th>hire_date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>2</td>
                  <td>Jane Smith</td>
                  <td>2021-03-15</td>
                </tr>
                <tr>
                  <td>4</td>
                  <td>Emily Davis</td>
                  <td>2022-07-19</td>
                </tr>
                <tr>
                  <td>5</td>
                  <td>Michael Brown</td>
                  <td>2021-12-30</td>
                </tr>
                <tr>
                  <td>6</td>
                  <td>Lisa Wilson</td>
                  <td>2023-02-08</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
