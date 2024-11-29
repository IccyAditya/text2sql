import React from 'react';
import ChartTable from './ChartTable'

const NewMessage = ({ content, type }) => {
  if (type === 'response' && content.preview) {
      return (<div style={{color:"black", width:"100%",display:"flex",flexDirection:"column",gap:".8rem"}}>
                <h6 style={{textDecoration:"underline",fontFamily:"Fira Code",fontSize:"19px", wordSpacing:"-4px"}}>
                Here is a preview for the data you requested.
                </h6>
                <ChartTable data={content.preview} />
                <ul style={{ fontSize:"19px",marginLeft:".5rem"}}>
                    <li>To access the complete results , please execute the query .</li>
                </ul>
                <hr style={{marginTop:"1rem",marginBottom:"3rem"}}></hr>
              </div> );
  }
  if (type === 'response' && content.error) {
     return (
        <div style={{  color:"black",width:"100%",display:"flex",flexDirection:"column",gap:"1rem"}}>
            <h6 style={{textDecoration:"underline",fontFamily:"Fira Code",fontSize:"19px", wordSpacing:"-4px"}}>
            Please review the input and make the appropriate changes to proceed.
            </h6>
            <pre style={{boxShadow:"rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",fontFamily:"Fira Code",width:"fit-content", background:"#95D2B3", padding:"1rem" , border:"1px solid grey" , fontSize:"22px",textWrap:"stable"}}>
              {content.error}
            </pre>
            <ul style={{ fontSize: "19px", marginLeft: ".5rem" ,display:"flex", flexDirection:"column" , gap:"4px" }}>
                <li>View Column and Type Information: Click the <strong>Information button</strong> to get details about the columns.</li>
                <li>Use Instruction Mode: Open the dropdown menu below and select <strong>Instruction Mode</strong>.</li>
                <li>Get Format: In the input area, type the columns name and execute to know the correct format of using the columns.</li>
                <li>Check Correct Format: Ensure that format is correct and execute in <strong>SQL Mode</strong> to get your query.</li>
            </ul>
            <hr style={{marginTop:"1rem",marginBottom:"3rem"}}></hr>
      </div>
     );
  }
  if (type === 'response' && content.query) {
    return (        
        <div style={{  color:"black",width:"100%",display:"flex",flexDirection:"column",gap:"1rem"}}>
            <h6 style={{textDecoration:"underline",fontFamily:"Fira Code",fontSize:"19px", wordSpacing:"-4px"}}>
            Here is the SQL statement for your query.
            </h6>
            <pre style={{boxShadow:"rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",fontFamily:"Fira Code",width:"fit-content", background:"#95D2B3", padding:"1rem" , border:"1px solid grey" , fontSize:"22px",textWrap:"stable"}}>
            {content.query}
            </pre>
            <ul style={{ fontSize: "19px", marginLeft: ".5rem" ,display:"flex", flexDirection:"column" , gap:"4px" }}>
            <li>Use Preview Mode: If you just want to preview the data .</li>
            <li>Select <strong>Preview Mode</strong> , paste the <strong>SQL Statement</strong> to view a sample of the results without exporting.</li>
            <li>Use Execute Mode: If you want to get the full data as a CSV file.</li> 
            <li>Select <strong>Execute Mode</strong> , paste the <strong>SQL Statement</strong> to download the results in CSV format.</li>
            </ul>
            <hr style={{marginTop:"1rem",marginBottom:"3rem"}}></hr>
        </div>
    );
 }
  if (type === 'user') {
    return (
      <div
        style={{
          boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px',
          fontFamily: 'Fira Code',
          color: 'black',
          width: 'auto',
          minWidth:"100px",
          display: 'flex',
          background: '#55AD9B',
          padding: '1rem',
          border: '1px solid grey',
          borderRadius: '8px',
          fontSize: '19px',
          marginBottom: '4rem',
          alignSelf: 'flex-end',
          whiteSpace: 'pre-wrap',
        }}
      >
        {content.text || 'User message missing'}
      </div>
    );
  }
  if (type === 'response' && content.instructions) {
    return (
      <div
        style={{
          color: 'black',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}
      >
        {content.instructions.map((instruction, index) => {
          const { header, data } = instruction;
  
          return (
            <div
              key={index}
              style={{
                color: 'black',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
              }}
            >
              {header && (
                <h6
                  className="message-header"
                  style={{ textDecoration: 'underline',fontFamily:"Fira Code",fontSize:"19px", wordSpacing:"-4px" }}
                >
                  {header}
                </h6>
              )}
              {data.map((item, ind) => {
                return (
                  <div key={ind}>
                    {item.code && (
                      <pre
                        key={ind}
                        className="message-code"
                        style={{
                          boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
                          fontFamily: "Fira Code",
                          width: "fit-content",
                          background: "#95D2B3",
                          padding: "1rem",
                          border: "1px solid grey",
                          fontSize: "22px",
                          wordWrap: "break-word", // Added to handle wrapping
                        }}
                      >
                        {item.code}
                      </pre>
                    )}
                    {item.explanation && (
                      <ul
                        key={ind}
                        className="message-text"
                        style={{ fontSize: "19px", marginLeft: "1rem" }}
                      >
                        <li>{item.explanation}</li>
                      </ul>
                    )}
                  </div>
                );
              })}
              <hr
                style={{
                  marginTop: '1rem',
                  marginBottom: '3rem',
                }}
              />
            </div>
          );
        })}
      </div>
    );
  }  
  return null;
};

export default NewMessage;
