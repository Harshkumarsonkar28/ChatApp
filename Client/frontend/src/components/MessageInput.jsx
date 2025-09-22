import React, { useState } from 'react';
import { useEffect } from 'react';

const MessageInput = ({ onSend,intialValue }) => {
  const [text, setText] = useState('');

  useEffect(()=>{
   setText(intialValue);
  },[intialValue])
  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText('');
  };

  return (
    <div className="message-input">
      <input
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default MessageInput;
