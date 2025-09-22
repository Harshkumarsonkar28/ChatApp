import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
const Message = ({ message, meId,onDelete,onEdit }) => {
  const isMine = message.sender._id === meId;
  return (
    <div className={`message ${isMine ? 'mine' : ''}`}>
   
      <div className="content">
        {message.content}
       {isMine && (
           <span className="actions">
            <FontAwesomeIcon className="icon edit-icon" icon={faEdit}  onClick={()=>onEdit(message)}/>
            <FontAwesomeIcon  className="icon delete-icon" icon={faTrash} onClick={()=>onDelete(message._id)}  />
          </span>
       )}

      </div>
      <div className="meta">{message.sender.username}</div>
    </div>
  );
};

export default Message;
