import React, { useState, useEffect, useCallback } from 'react';
import { Handle, Position } from 'react-flow-renderer';

const CustomNode = ({ id, data, isConnectable }) => {
  const [label, setLabel] = useState(data.label);
  const [duration, setDuration] = useState(data.duration);

  const handleLabelChange = useCallback((evt) => {
    setLabel(evt.target.value);
    data.onChange(id, 'label', evt.target.value);
  }, [id, data]);

  const handleDurationChange = useCallback((evt) => {
    setDuration(evt.target.value);
    data.onChange(id, 'duration', evt.target.value);
  }, [id, data]);

  return (
    <div className="custom-node">
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#555', width: '12px', height: '24px', left: '-20px', borderRadius: '40%', bakground: "red" }}
        isConnectable={isConnectable}
      />
      <div className="node-content">
        <input
          type="text"
          placeholder="Task Name"
          value={label}
          onChange={handleLabelChange}
          className="nodrag"
          style={{ width: '100%', marginBottom: '5px' }}
        />
        <input
          type="text"
          placeholder="Duration"
          value={duration}
          onChange={handleDurationChange}
          className="nodrag"
          style={{ width: '100%' }}
        />
      </div>
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: '#555', width: '12px', height: '24px', right: '-20px', borderRadius: '40%' }}
        isConnectable={isConnectable}
      />
    </div>
  );
};

export default CustomNode;
