import React, { useState } from 'react';

const Instructions = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleInstructions = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <img 
        src="/instruction.png" 
        alt="Toggle Instructions" 
        onClick={toggleInstructions} 
        className={`cursor-pointer transition-opacity 
          ${isOpen ? 'opacity-50' : 'opacity-100'}
          hover:opacity-75`} 
        style={{
          position: 'absolute', 
          top: '10px', 
          left: '10px', 
          cursor: 'pointer',
          width: '90px', 
          height: '90px',
          zIndex: 10
        }} 
      />

      {isOpen && (
        <div 
          className={`fixed top-16 left-28  bg-white shadow-lg rounded-lg 
            p-5 z-50 overflow-y-auto transition-all duration-300 ease-in-out
            ${isOpen 
              ? 'opacity-100 scale-100 translate-y-0' 
              : 'opacity-0 scale-95 -translate-y-5'}`}
          style={{width:"600px",height:"90vh" , zIndex:"100"}}
        >
          <h2 className="text-center text-xl font-semibold text-gray-700 
            border-b-2 border-gray-100 pb-3 mb-4">
            Instructions
          </h2>

          <div className="space-y-4" style={{width:"500px", height:"600px", fontSize:"20px"}}>
            <section>
              <h3 className="font-bold text-gray-600 mb-2" style={{fontSize:"20px"}}>Basic Queries</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700" style={{fontSize:"18px"}}>
                <li>Provide me data of <strong>table_name</strong> (Can be modified only to include a few columns using only includes)</li>
                <li>Provide me data of <strong>table_name</strong> whose <strong>column_name</strong> condition (can be extended to multiple columns using <strong>AND/OR</strong>)</li>
              </ul>
            </section>

            <hr></hr>

            <section>
              <h3 className="font-bold text-gray-600 mb-2" style={{fontSize:"20px"}}>Aggregations</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700" style={{fontSize:"18px"}}>
                <li>Provide me data on <strong>(SUM/COUNT/MAX/MIN/AVG)</strong> <strong>column_name</strong> in <strong>table_name</strong></li>
                <li>Provide me data on <strong>(SUM/COUNT/MAX/MIN/AVG)</strong> <strong>column_name1</strong> for each <strong>column_name2</strong> (whose condition) in <strong>table_name</strong></li>
              </ul>
            </section>

            <hr></hr>

            <section>
              <h3 className="font-bold text-gray-600 mb-2" style={{fontSize:"20px"}}>Sort & Limit</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700" style={{fontSize:"18px"}}>
                <li>Provide me data of <strong>table_name</strong> <strong>SORT</strong> column_name in ASC|DESC <strong>LIMIT</strong> value</li>
                <li>Provide me data of <strong>table_name</strong> <strong>SORT</strong> column_name1 in ASC|DESC , column_name2 in ASC|DESC <strong>LIMIT</strong> value</li>
              </ul>
            </section>

            <hr></hr>
          </div>
        </div>
      )}
    </div>
  );
};

export default Instructions;