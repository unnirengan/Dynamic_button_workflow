import React, { useState, useEffect, useRef } from 'react';

export default function OutputPage() {
  const [config, setConfig] = useState(null);
  const [outputTexts, setOutputTexts] = useState([]);
  const [buttonStyle, setButtonStyle] = useState({});
  const [disabled, setDisabled] = useState(false);
  const buttonRef = useRef(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('buttonConfig'));
    if (stored) setConfig(stored);
  }, []);

  const executeAction = async (action) => {
    switch (action.type) {
      case 'Alert':
        alert(action.value || 'Alert!');
        break;

      case 'Show Text':
        setOutputTexts(prev => [...prev, action.value || 'Hello']);
        break;

      case 'Show Image':
        setOutputTexts(prev => [...prev, <img key={prev.length} src={action.value} alt="user" style={{ maxWidth: '200px' }} />]);
        break;

      case 'Refresh Page':
        window.location.reload();
        break;

      case 'Set LocalStorage':
        const [key, value] = (action.value || '').split(',');
        if (key && value) localStorage.setItem(key.trim(), value.trim());
        break;

      case 'Get LocalStorage':
        const getVal = localStorage.getItem(action.value);
        setOutputTexts(prev => [...prev, getVal ? `${action.value}: ${getVal}` : `${action.value} not found`]);
        break;

      case 'Increase Button Size':
        setButtonStyle(prev => {
          const currentSize = parseInt(prev.fontSize || '16');
          return { ...prev, fontSize: `${currentSize + 4}px` };
        });
        break;

      case 'Close Window':
        window.close();
        break;

      case 'Prompt and Show':
        const input = prompt(action.value || 'Enter something');
        setOutputTexts(prev => [...prev, input ? input : 'No input']);
        break;

      case 'Change Button Color':
        const color = action.value || `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        setButtonStyle(prev => ({ ...prev, backgroundColor: color }));
        break;

      case 'Disable Button':
        setDisabled(true);
        break;

      default:
        break;
    }
  };

  const handleClick = async () => {
    for (const action of config.actions) {
      await executeAction(action);
    }
  };

  if (!config) return <p>Loading...</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Output Page</h2>
      <button
        ref={buttonRef}
        style={{ padding: '1rem', ...buttonStyle }}
        onClick={handleClick}
        disabled={disabled}
      >
        {config.label || 'Click Me!'}
      </button>

      <div style={{ marginTop: '2rem' }}>
        {outputTexts.map((text, idx) => (
          <div key={idx}>{text}</div>
        ))}
      </div>
    </div>
  );
}
