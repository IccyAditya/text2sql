import React, { useRef, useState } from 'react';
import { cibMinutemailer, cibDiscover } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { useChatContext } from './ChatContext';

import Dropdown from 'react-bootstrap/Dropdown';

const IconToggle = ({text, onClear}) => {
  const [activeIcon, setActiveIcon] = useState('jira');
  const [endpoint, setendpoint] = useState('instruction');
  const { updateInputText, updateapiResponse } = useChatContext();

  const handleClick = async () => {
    if(text !== ''){
        updateInputText(text);
        setActiveIcon('');
        await fetch(`http://127.0.0.1:5000/${endpoint}?prompt=${encodeURIComponent(text)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json , text/csv',
            },
        }).then(response => {
            if (response.ok) {
                const contentType = response.headers.get('Content-Type');
                
                if (contentType && contentType.includes('text/csv')) {
                    return response.blob();
                } else {
                    return response.json(); 
                }
            } else {
                   return response.json();
            }
        }).then(data => {
            if (data instanceof Blob) {
                const url = URL.createObjectURL(data);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'data.csv'; 
                link.click(); 
                URL.revokeObjectURL(url);
            } else {
                updateapiResponse(data);
            }
            onClear();
        }).catch(error => {
            console.error('Error:', error);
        });
        
    }
    setActiveIcon('jira');
  };

  return (
    <div style={{width:"100%", marginBottom:".5rem", display:"flex", justifyContent:"space-between"}}>
        <Dropdown onSelect={(eventKey)=>{setendpoint(eventKey)}}>
        <Dropdown.Toggle style={{background:"lightgreen",color:"black",border:"none"}} id="dropdown-basic">
            {endpoint==="query"?"SQL":(endpoint==="execute"?"EXECUTE": (endpoint==="preview"?"PREVIEW":"INSTRUCTION"))}
        </Dropdown.Toggle>

        <Dropdown.Menu>
            <Dropdown.Item eventKey={"query"}>SQL</Dropdown.Item>
            <Dropdown.Item eventKey={"instruction"}>INSTRUCTION</Dropdown.Item>
            <Dropdown.Item eventKey={"execute"}>EXECUTE</Dropdown.Item>
            <Dropdown.Item eventKey={"preview"}>PREVIEW</Dropdown.Item>
        </Dropdown.Menu>
        </Dropdown>
        <div
        onClick={handleClick}
        style={{
            width: '2.5rem',
            height: '2.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'transform 0.2s, background-color 0.3s',
        }}
        onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.9)'} 
        onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'} 
        >
        <div
            style={{
            transition: 'opacity 0.3s ease, transform 0.3s ease',
            opacity: 1,
            transform: activeIcon === 'jira' ? 'rotate(0deg)' : 'rotate(180deg)',
            }}
        >
        </div>
        <CIcon icon={activeIcon === 'jira' ? cibMinutemailer : cibDiscover} />
        </div>
    </div>
  );
};

const SearchBar = () => {
  const textAreaRef = useRef(null);
  const [SearchText, setSearchText] = useState("");

  const handleInput = (e) => {
    const textArea = textAreaRef.current;
    if (textArea) {
      textArea.style.height = 'auto';
      textArea.style.height = `${textArea.scrollHeight}px`;
    }
    setSearchText(e.target.value);
  };

  const handleClear = () => {
    if (textAreaRef.current) {
      textAreaRef.current.value = '';
      setSearchText('');
    }
  };

  return (
    <div className='S-container'>
      <textarea
        ref={textAreaRef}
        className="Search-container"
        rows={1}
        onInput={handleInput}
        value={SearchText}
      />
      <IconToggle text={SearchText} onClear={handleClear}/>
    </div>
  );
};

export default SearchBar;