import React, { useCallback, useRef } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  useReactFlow
} from 'react-flow-renderer';
import CustomNode from './CustomNode';
import './App.css';

const initialNodes = [
  {
    id: '1',
    type: 'default',
    data: { label: '', duration: '', onChange: () => {} },
    position: { x: 250, y: 5 },
    style: { width: 250 },
  },
];

const nodeTypes = {
  default: CustomNode
};

const DnDFlow = () => {
  const reactFlowWrapper = useRef(null);
  const connectingNodeId = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { project } = useReactFlow();

  const handleNodeChange = (id, field, value) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              [field]: value,
            },
          };
        }
        return node;
      })
    );
  };

  const onConnect = useCallback(
    (params) => {
      connectingNodeId.current = null;
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

  const onConnectStart = useCallback((_, { nodeId }) => {
    connectingNodeId.current = nodeId;
  }, []);

  const onConnectEnd = useCallback(
    (event) => {
      if (!connectingNodeId.current) return;

      const targetIsPane = event.target.classList.contains('react-flow__pane');

      if (targetIsPane) {
        const id = getId();
        const newNode = {
          id,
          position: project({
            x: event.clientX,
            y: event.clientY,
          }),
          data: { label: ``, duration: '', onChange: handleNodeChange },
          type: 'default',
          style: { width: 250 },
        };

        setNodes((nds) => nds.concat(newNode));
        setEdges((eds) => eds.concat({ id, source: connectingNodeId.current, target: id }));
      }
    },
    [project, setNodes, setEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = event.target.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');
      const position = project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: '', duration: '', onChange: handleNodeChange },
        style: { width: 250 },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [project, setNodes]
  );

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const exportToJson = () => {
    const flowData = {
      nodes: nodes.map(node => ({ id: node.id, label: node.data.label, duration: node.data.duration })),
      edges: edges,
    };
    const json = JSON.stringify(flowData, null, 2);
    navigator.clipboard.writeText(json).then(() => {
      alert('Flow data copied to clipboard');
    });
  };

  return (
    <div className="dndflow" ref={reactFlowWrapper}>
      <button className="copy-json-button" onClick={exportToJson}>
        Copy JSON
      </button>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodeTypes={nodeTypes}
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
      <div className="sidebar">
        <div className="dndnode" onDragStart={(event) => onDragStart(event, 'default')} draggable>
          Add Node
        </div>
      </div>
    </div>
  );
};

let id = 0;
const getId = () => `dndnode_${id++}`;

const App = () => (
  <ReactFlowProvider>
    <DnDFlow />
  </ReactFlowProvider>
);

export default App;


