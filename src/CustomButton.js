import React from 'react';
import { Handle } from 'react-flow-renderer';

const CustomNode = ({ data }) => (
  <div>
    <Handle type="target" position="left" style={{ borderRadius: 0 }} />
    <div>
      <input
        type="text"
        placeholder="Task Name"
        value={data.label}
        onChange={(event) => data.onChange(event, data.id, 'label')}
      />
      <input
        type="text"
        placeholder="Duration"
        value={data.duration}
        onChange={(event) => data.onChange(event, data.id, 'duration')}
      />
    </div>
    <Handle type="source" position="right" style={{ borderRadius: 0 }} />
  </div>
);

export default CustomNode;
