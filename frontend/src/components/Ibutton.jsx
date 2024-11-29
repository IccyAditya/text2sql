import React, { useState } from 'react';


const Ibutton = () => {
  const [showText, setShowText] = useState(false);

  const handleToggle = () => {
    setShowText(!showText);
  };

  const columnInfo = {
    loan_id: {
      datatype: "INT",
      possible_condition_flags: ["EQUALS", "ABOVE", "BELOW", "IN", "BETWEEN"]
    },
    borrower_name: {
      datatype: "VARCHAR",
      possible_condition_flags: ["EQUALS", "IN"]
    },
    loan_amount: {
      datatype: "DECIMAL",
      possible_condition_flags: ["EQUALS", "ABOVE", "BELOW", "IN", "BETWEEN"]
    },
    interest_rates: {
      datatype: "DECIMAL",
      possible_condition_flags: ["EQUALS", "ABOVE", "BELOW", "IN", "BETWEEN"]
    },
    loan_term_years: {
      datatype: "INT",
      possible_condition_flags: ["EQUALS", "ABOVE", "BELOW", "IN", "BETWEEN"]
    },
    loan_start_date: {
      datatype: "DATE",
      possible_condition_flags: ["EQUALS", "BETWEEN"]
    },
    loan_end_date: {
      datatype: "DATE",
      possible_condition_flags: ["EQUALS", "BETWEEN"]
    },
    payment_frequency: {
      datatype: "VARCHAR",
      possible_condition_flags: ["EQUALS", "IN"]
    },
    monthly_payment: {
      datatype: "DECIMAL",
      possible_condition_flags: ["EQUALS", "ABOVE", "BELOW", "IN", "BETWEEN"]
    },
    loan_status: {
      datatype: "VARCHAR",
      possible_condition_flags: ["EQUALS", "IN"]
    },
    credit_score: {
      datatype: "INT",
      possible_condition_flags: ["EQUALS", "ABOVE", "BELOW", "IN", "BETWEEN"]
    },
    borrower_income: {
      datatype: "DECIMAL",
      possible_condition_flags: ["EQUALS", "ABOVE", "BELOW", "IN", "BETWEEN"]
    },
    guarantor: {
      datatype: "VARCHAR",
      possible_condition_flags: ["EQUALS", "IN"]
    },
    loan_type: {
      datatype: "VARCHAR",
      possible_condition_flags: ["EQUALS", "IN"]
    },
    loan_balance: {
      datatype: "DECIMAL",
      possible_condition_flags: ["EQUALS", "ABOVE", "BELOW", "IN", "BETWEEN"]
    },
    payment_date: {
      datatype: "DATE",
      possible_condition_flags: ["EQUALS", "BETWEEN"]
    }
  };

  const formatColumnInfo = (info) => {
    return Object.entries(info).map(([key, value], index) => (
      <div key={index} style={{ marginBottom: '15px' }}>
        <div style={{ fontWeight: 'bold', color: '#FBFBFB', marginBottom: '5px' }}>
          {key}
        </div>
        <div style={{ marginLeft: '10px', color: '#A0A0A0', fontStyle: 'italic' }}>
          Datatype: {value.datatype}
        </div>
        <div style={{ marginLeft: '10px', color: '#A0A0A0', fontStyle: 'italic' }}>
          Conditions: {value.possible_condition_flags.join(', ')}
        </div>
      </div>
    ));
  };

  return (
    <div style={{ position: 'relative' }}>
      <img 
        src="./Iicon.jpeg" 
        alt="Info Icon" 
        style={{
          position: 'absolute', 
          top: '10px', 
          right: '10px', 
          cursor: 'pointer',
          width: '40px', 
          height: '40px'
        }} 
        onClick={handleToggle} 
      />
      <div 
        style={{
          position: 'absolute',
          top: '60px', 
          right: '10px',
          backgroundColor: '#1A1A1D',
          padding: '15px',
          width: '350px',
          maxHeight: '500px',
          overflowY: 'auto',
          borderRadius: '8px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
          opacity: showText ? 1 : 0,
          visibility: showText ? 'visible' : 'hidden',
          transition: 'opacity 0.5s ease, visibility 0.5s ease',
          fontSize: '15px',
          color: 'white'
        }}
      >
        {formatColumnInfo(columnInfo)}
      </div>
    </div>
  );
};

export default Ibutton;
