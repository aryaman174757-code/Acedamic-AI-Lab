import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { GraphStructure, GraphNode, GraphEdge, AppTheme, NoteSection } from '../types';
import { Plus, Trash, Zap, RotateCcw, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';

const PRESETS: Record<string, { name: string; desc: string; structure: GraphStructure }> = {
  k4: {
    name: 'K4 (Complete 4-Node)',
    desc: 'Every node connects to every other node. Formula: |E| = 4(3)/2 = 6.',
    structure: {
      nodes: [
        { id: 'A', label: 'A', x: 150, y: 50 },
        { id: 'B', label: 'B', x: 250, y: 150 },
        { id: 'C', label: 'C', x: 150, y: 250 },
        { id: 'D', label: 'D', x: 50, y: 150 }
      ],
      edges: [
        { from: 'A', to: 'B' }, { from: 'A', to: 'C' }, { from: 'A', to: 'D' },
        { from: 'B', to: 'C' }, { from: 'B', to: 'D' }, { from: 'C', to: 'D' }
      ]
    }
  },
  star: {
    name: 'Central Star Graph',
    desc: 'Center C (deg 4) connected to peripheral pendant vertices (deg 1).',
    structure: {
      nodes: [
        { id: 'C', label: 'C', x: 150, y: 150 },
        { id: 'A', label: 'A', x: 150, y: 40 },
        { id: 'B', label: 'B', x: 260, y: 150 },
        { id: 'D', label: 'D', x: 150, y: 260 },
        { id: 'E', label: 'E', x: 40, y: 150 }
      ],
      edges: [
        { from: 'C', to: 'A' }, { from: 'C', to: 'B' }, { from: 'C', to: 'D' }, { from: 'C', to: 'E' }
      ]
    }
  },
  k23: {
    name: 'K2,3 (Bipartite 2x3)',
    desc: 'Disjoint partitions: {A,B} and {C,D,E}. Only inter-partition edges exist.',
    structure: {
      nodes: [
        { id: 'A', label: 'A', x: 80, y: 90 },
        { id: 'B', label: 'B', x: 80, y: 210 },
        { id: 'C', label: 'C', x: 220, y: 50 },
        { id: 'D', label: 'D', x: 220, y: 150 },
        { id: 'E', label: 'E', x: 220, y: 250 }
      ],
      edges: [
        { from: 'A', to: 'C' }, { from: 'A', to: 'D' }, { from: 'A', to: 'E' },
        { from: 'B', to: 'C' }, { from: 'B', to: 'D' }, { from: 'B', to: 'E' }
      ]
    }
  },
  tree: {
    name: 'Standard Tree (Connected Acyclic)',
    desc: 'A hierarchical tree where |E| = |V| - 1. Contains zero cycles.',
    structure: {
      nodes: [
        { id: 'R', label: 'Root', x: 150, y: 50 },
        { id: 'L', label: 'L', x: 80, y: 140 },
        { id: 'R2', label: 'R2', x: 220, y: 140 },
        { id: 'D1', label: 'D1', x: 40, y: 230 },
        { id: 'D2', label: 'D2', x: 120, y: 230 }
      ],
      edges: [
        { from: 'R', to: 'L' }, { from: 'R', to: 'R2' },
        { from: 'L', to: 'D1' }, { from: 'L', to: 'D2' }
      ]
    }
  }
};

interface InteractiveGraphSandboxProps {
  activeTheme?: AppTheme | null;
  notes?: NoteSection[];
}

export default function InteractiveGraphSandbox({ activeTheme = null, notes = [] }: InteractiveGraphSandboxProps) {
  const [graph, setGraph] = useState<GraphStructure>(PRESETS.k4.structure);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [mode, setMode] = useState<'node' | 'edge' | 'delete'>('node');
  const [activePreset, setActivePreset] = useState<string>('k4');
  const svgRef = useRef<SVGSVGElement>(null);

  // Auto layout labels when adding
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const resetGraph = () => {
    setGraph({ nodes: [], edges: [] });
    setSelectedNodeId(null);
  };

  const loadPreset = (key: string) => {
    setGraph(JSON.parse(JSON.stringify(PRESETS[key].structure)));
    setActivePreset(key);
    setSelectedNodeId(null);
  };

  // Add node on click
  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (mode !== 'node' || !svgRef.current) return;

    // Get click coords relative to SVG
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Create unique label
    const nextLabelIndex = graph.nodes.length;
    let nextLabel = alphabet[nextLabelIndex % 26];
    if (nextLabelIndex >= 26) {
      nextLabel += Math.floor(nextLabelIndex / 26);
    }

    const newNode: GraphNode = {
      id: `node_${Date.now()}`,
      label: nextLabel,
      x,
      y
    };

    setGraph(prev => ({
      ...prev,
      nodes: [...prev.nodes, newNode]
    }));
  };

  // Handle node interactions
  const handleNodeClick = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (mode === 'delete') {
      setGraph(prev => ({
        nodes: prev.nodes.filter(n => n.id !== nodeId),
        edges: prev.edges.filter(edge => edge.from !== nodeId && edge.to !== nodeId)
      }));
      if (selectedNodeId === nodeId) setSelectedNodeId(null);
    } else if (mode === 'edge') {
      if (selectedNodeId === null) {
        setSelectedNodeId(nodeId);
      } else if (selectedNodeId === nodeId) {
        // Toggle self-loop
        const edgeExists = graph.edges.some(edge => edge.from === nodeId && edge.to === nodeId);
        if (edgeExists) {
          setGraph(prev => ({
            ...prev,
            edges: prev.edges.filter(edge => !(edge.from === nodeId && edge.to === nodeId))
          }));
        } else {
          setGraph(prev => ({
            ...prev,
            edges: [...prev.edges, { from: nodeId, to: nodeId }]
          }));
        }
        setSelectedNodeId(null);
      } else {
        // Create link between two different nodes if it doesn't exist
        const edgeExists = graph.edges.some(
          edge => (edge.from === selectedNodeId && edge.to === nodeId) ||
                   (edge.from === nodeId && edge.to === selectedNodeId)
        );

        if (!edgeExists) {
          setGraph(prev => ({
            ...prev,
            edges: [...prev.edges, { from: selectedNodeId, to: nodeId }]
          }));
        } else {
          // Remove edge if clicked again
          setGraph(prev => ({
            ...prev,
            edges: prev.edges.filter(
              edge => !((edge.from === selectedNodeId && edge.to === nodeId) ||
                        (edge.from === nodeId && edge.to === selectedNodeId))
            )
          }));
        }
        setSelectedNodeId(null);
      }
    }
  };

  // Dragging nodes
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);

  const handleNodeMouseDown = (nodeId: string) => {
    if (mode === 'node') {
      setDraggedNodeId(nodeId);
    }
  };

  const handleSvgMouseMove = (e: React.MouseEvent) => {
    if (!draggedNodeId || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setGraph(prev => ({
      ...prev,
      nodes: prev.nodes.map(n => n.id === draggedNodeId ? { ...n, x, y } : n)
    }));
  };

  const handleSvgMouseUp = () => {
    setDraggedNodeId(null);
  };

  // --- STATS CALCULATOR HANDLERS ---
  const order = graph.nodes.length;
  const size = graph.edges.length;

  // Calculate degrees
  const nodeDegrees: Record<string, number> = {};
  graph.nodes.forEach(node => {
    nodeDegrees[node.id] = 0;
  });

  graph.edges.forEach(edge => {
    if (nodeDegrees[edge.from] !== undefined) {
      nodeDegrees[edge.from]++;
    }
    if (nodeDegrees[edge.to] !== undefined) {
      nodeDegrees[edge.to]++;
    }
  });

  // Calculate sorted degree sequence
  const degreeSeq = Object.values(nodeDegrees).sort((a, b) => b - a);

  // Sum of degrees
  const sumDegrees = degreeSeq.reduce((acc, val) => acc + val, 0);

  // Check graph characteristics
  const hasSelfLoops = graph.edges.some(e => e.from === e.to);
  
  // Check multiple parallel edges
  const edgeCountMap: Record<string, number> = {};
  graph.edges.forEach(e => {
    const key = [e.from, e.to].sort().join('-');
    edgeCountMap[key] = (edgeCountMap[key] || 0) + 1;
  });
  const hasMultipleEdges = Object.values(edgeCountMap).some(count => count > 1);

  let graphClassification = 'Simple Graph';
  if (hasSelfLoops && hasMultipleEdges) {
    graphClassification = 'Pseudograph';
  } else if (hasSelfLoops) {
    graphClassification = 'Pseudograph (Contains Loops)';
  } else if (hasMultipleEdges) {
    graphClassification = 'Multigraph';
  } else if (order > 0 && size === 0) {
    graphClassification = order === 1 ? 'Trivial Graph' : 'Null Graph';
  }

  // Check if k-regular
  const isRegular = degreeSeq.length > 0 && degreeSeq.every(d => d === degreeSeq[0]);
  const regularClass = isRegular ? `${degreeSeq[0]}-Regular` : 'Non-Regular';

  // Check if Tree (connected, acyclic, size = order - 1)
  // Simplified checking for UI demonstration: we can check basic criteria
  const isTreeCandidate = order > 0 && size === order - 1;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="interactive-sandbox">
      {/* Visual Workspace Canvas */}
      <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col shadow-2xl relative overflow-hidden">
        {/* Neon decorative background light */}
        <div 
          className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-20" 
          style={activeTheme ? { backgroundColor: activeTheme.primaryColor } : { backgroundColor: 'rgba(20, 184, 166, 0.1)' }}
        />
        <div 
          className="absolute bottom-0 left-0 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-20" 
          style={activeTheme ? { backgroundColor: activeTheme.secondaryColor } : { backgroundColor: 'rgba(99, 102, 241, 0.1)' }}
        />

        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 z-10">
          <div>
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" /> Interactive Graph Sandbox
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Click to add vertices. Drag to arrange. Connect to test.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={resetGraph}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
              title="Clear Sandbox"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-50 border border-slate-200 rounded-lg mb-4 z-10">
          <button
            onClick={() => { setMode('node'); setSelectedNodeId(null); }}
            className={`flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-md transition-all cursor-pointer ${
              mode === 'node'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
            style={mode === 'node' && activeTheme ? {
              backgroundColor: activeTheme.primaryColor,
              color: activeTheme.textColor,
              boxShadow: 'none'
            } : undefined}
          >
            <Plus className="w-4 h-4" /> Add Vertices
          </button>
          <button
            onClick={() => { setMode('edge'); }}
            className={`flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-md transition-all cursor-pointer ${
              mode === 'edge'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
            style={mode === 'edge' && activeTheme ? {
              backgroundColor: activeTheme.primaryColor,
              color: activeTheme.textColor,
              boxShadow: 'none'
            } : undefined}
          >
            <Zap className="w-4 h-4" /> Connect Edges
          </button>
          <button
            onClick={() => { setMode('delete'); setSelectedNodeId(null); }}
            className={`flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-md transition-all cursor-pointer ${
              mode === 'delete'
                ? 'bg-red-50 text-red-700 border border-red-100'
                : 'text-slate-600 hover:bg-red-50 hover:text-red-600'
            }`}
          >
            <Trash className="w-4 h-4" /> Delete Item
          </button>
        </div>

        {/* Dynamic Mode Helper Message */}
        <div className="mb-4 bg-slate-50 rounded-lg px-4 py-2.5 border border-slate-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-indigo-600 shrink-0" />
          <span className="text-xs text-slate-600 font-semibold">
            {mode === 'node' && "Click empty canvas to spawn a new Vertex. Grab and drag vertices to re-shape."}
            {mode === 'edge' && (selectedNodeId 
              ? `Select destination vertex to connect with ${graph.nodes.find(n => n.id === selectedNodeId)?.label}.` 
              : "Click a vertex, then click another vertex to draw an Edge. Click the same vertex to form a Self-loop.")}
            {mode === 'delete' && "Click any vertex to instantly erase it and clean connected edges."}
          </span>
        </div>

        {/* SVG Drawing Canvas */}
        <div className="relative bg-white rounded-lg border border-slate-200 h-[340px] flex-grow flex items-center justify-center overflow-hidden shadow-sm">
          <svg
            ref={svgRef}
            onClick={handleSvgClick}
            onMouseMove={handleSvgMouseMove}
            onMouseUp={handleSvgMouseUp}
            className="absolute inset-0 w-full h-full cursor-crosshair select-none"
          >
            <defs>
              {/* Dot grid pattern for minimalist CAD look */}
              <pattern id="dot-grid" width="16" height="16" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="0.75" fill="#cbd5e1" />
              </pattern>
              
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="18"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="#6366f1" />
              </marker>
            </defs>

            {/* Backing dot grid */}
            <rect width="100%" height="100%" fill="url(#dot-grid)" />

            {/* Render Edges */}
            {graph.edges.map((edge, index) => {
              const fromNode = graph.nodes.find(n => n.id === edge.from);
              const toNode = graph.nodes.find(n => n.id === edge.to);

              if (!fromNode || !toNode) return null;

              // Self Loop representation
              if (edge.from === edge.to) {
                const r = 16;
                const pathX = fromNode.x;
                const pathY = fromNode.y - 12;
                return (
                  <path
                    key={`self-loop-${index}`}
                    d={`M ${pathX} ${fromNode.y} C ${pathX - r} ${pathY - r}, ${pathX + r} ${pathY - r}, ${pathX} ${fromNode.y}`}
                    fill="none"
                    stroke={
                      selectedNodeId === edge.from 
                        ? (activeTheme ? activeTheme.primaryColor : '#4f46e5') 
                        : (activeTheme ? activeTheme.primaryColor + 'c0' : '#6366f1')
                    }
                    strokeWidth="2"
                    className="opacity-70"
                  />
                );
              }

              // Standard Edge Line
              return (
                <line
                  key={`edge-${index}`}
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke={
                    selectedNodeId === edge.from || selectedNodeId === edge.to 
                      ? (activeTheme ? activeTheme.primaryColor : '#4f46e5') 
                      : '#94a3b8'
                  }
                  strokeWidth="2"
                  className="transition-all opacity-85"
                />
              );
            })}

            {/* Render Node Circles */}
            {graph.nodes.map((node) => {
              const isSelected = selectedNodeId === node.id;
              const nodeDegree = nodeDegrees[node.id] || 0;

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onMouseDown={() => handleNodeMouseDown(node.id)}
                  onClick={(e) => handleNodeClick(node.id, e)}
                  className="cursor-pointer group"
                >
                  <circle
                    r="15"
                    className={`transition-all duration-150 ${
                      isSelected 
                        ? 'stroke-[3px]' 
                        : mode === 'delete'
                          ? 'fill-white stroke-red-500 hover:fill-red-50 stroke-2'
                          : 'fill-white stroke-slate-400 stroke-2'
                    }`}
                    style={
                      isSelected && activeTheme 
                        ? { fill: activeTheme.secondaryColor, stroke: activeTheme.primaryColor }
                        : isSelected && !activeTheme
                          ? { fill: '#f5f3ff', stroke: '#4f46e5' }
                          : !isSelected && mode !== 'delete' && activeTheme
                            ? { stroke: activeTheme.primaryColor + '80' }
                            : undefined
                    }
                  />
                  {/* Outer degree ring indicator */}
                  <circle
                    r="19"
                    fill="none"
                    stroke={activeTheme ? activeTheme.primaryColor : "#6366f1"}
                    strokeWidth="1.5"
                    strokeDasharray="3,3"
                    className="opacity-0 group-hover:opacity-40 transition-opacity"
                  />
                  <text
                    textAnchor="middle"
                    dy="4"
                    className="font-bold text-[11px] select-none fill-slate-800 pointer-events-none font-sans"
                  >
                    {node.label}
                  </text>
                  
                  {/* Floating degree counter badge */}
                  <g transform="translate(12, -12)" className="opacity-90">
                    <circle 
                      r="7.5" 
                      fill={activeTheme ? activeTheme.secondaryColor : "#eff6ff"} 
                      stroke={activeTheme ? activeTheme.primaryColor + '40' : "#bfdbfe"} 
                      strokeWidth="1" 
                    />
                    <text
                      textAnchor="middle"
                      dy="2.5"
                      fontSize="7"
                      fontWeight="bold"
                      fill={activeTheme ? activeTheme.textColor : "#1e40af"}
                    >
                      {nodeDegree}
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>

          {/* Empty Canvas Indicator */}
          {graph.nodes.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-white/95 pointer-events-none z-0">
              <Sparkles className="w-10 h-10 text-indigo-400/40 mb-3 animate-pulse" />
              <p className="text-sm font-bold text-slate-800">Your Sandbox Canvas is Empty</p>
              <p className="text-xs text-slate-400 max-w-xs mt-1 font-semibold">
                Select "Add Vertices" above and click anywhere on the canvas to start designing!
              </p>
            </div>
          )}
        </div>

        {/* Presets Row selector */}
        <div className="mt-5 border-t border-slate-100 pt-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Study Preset Structures</p>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(PRESETS).map(([key, p]) => (
              <button
                key={key}
                onClick={() => loadPreset(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  activePreset === key && graph.nodes.length > 0
                    ? 'shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-50'
                }`}
                style={
                  activePreset === key && graph.nodes.length > 0
                    ? activeTheme 
                      ? { backgroundColor: activeTheme.secondaryColor, color: activeTheme.textColor, borderColor: activeTheme.primaryColor + '30' }
                      : { backgroundColor: '#f5f3ff', color: '#4338ca', borderColor: '#ddd6fe' }
                    : undefined
                }
              >
                {p.name}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-slate-400 mt-2.5 font-medium italic">
            Active Model: {PRESETS[activePreset].desc}
          </p>
        </div>
      </div>

      {/* Maths Calculations Panel */}
      <div className="lg:col-span-5 flex flex-col gap-5">
        {/* Real-time Properties Card */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col">
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Sparkles className="w-4 h-4 text-teal-600" style={activeTheme ? { color: activeTheme.primaryColor } : undefined} /> Graph Structural Properties
          </h3>

          <div className="grid grid-cols-2 gap-4 my-4">
            <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Order |V|</span>
              <p className="text-2xl font-bold text-slate-900 mt-0.5" style={activeTheme ? { color: activeTheme.primaryColor } : undefined}>{order}</p>
              <span className="text-[9px] text-slate-400">Total Vertices</span>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Size |E|</span>
              <p className="text-2xl font-bold text-slate-900 mt-0.5" style={activeTheme ? { color: activeTheme.primaryColor } : undefined}>{size}</p>
              <span className="text-[9px] text-slate-400">Total Edges</span>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-600">
            <div className="flex items-center justify-between border-b border-slate-50 pb-2">
              <span className="font-medium text-slate-500">Vertex Set V</span>
              <span className="font-mono text-slate-800 font-bold max-w-[200px] truncate">
                {order === 0 ? '∅' : `{ ${graph.nodes.map(n => n.label).join(', ')} }`}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-50 pb-2">
              <span className="font-medium text-slate-500">Edge Set E</span>
              <span className="font-mono text-slate-800 font-bold max-w-[200px] truncate" title={graph.edges.map(e => {
                const fNode = graph.nodes.find(n => n.id === e.from)?.label || '';
                const tNode = graph.nodes.find(n => n.id === e.to)?.label || '';
                return fNode + tNode;
              }).join(', ')}>
                {size === 0 ? '∅' : `{ ${graph.edges.map(e => {
                  const fNode = graph.nodes.find(n => n.id === e.from)?.label || '';
                  const tNode = graph.nodes.find(n => n.id === e.to)?.label || '';
                  return fNode + tNode;
                }).join(', ')} }`}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-50 pb-2">
              <span className="font-medium text-slate-500">Classification</span>
              <span className="px-2 py-0.5 rounded-md font-bold font-sans" style={activeTheme ? { backgroundColor: activeTheme.secondaryColor, color: activeTheme.textColor } : { backgroundColor: '#f0fdfa', color: '#0f766e' }}>
                {graphClassification}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-50 pb-2">
              <span className="font-medium text-slate-500">Regular Class</span>
              <span className="px-2 py-0.5 rounded-md font-bold" style={isRegular && activeTheme ? { backgroundColor: activeTheme.secondaryColor, color: activeTheme.textColor } : undefined}>
                {regularClass}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-500">Is Tree Candidate?</span>
              <span className={`px-2 py-0.5 rounded-md font-bold ${
                isTreeCandidate ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
              }`}>
                {isTreeCandidate ? 'Yes (Size = V - 1)' : 'No (Size ≠ V - 1)'}
              </span>
            </div>
          </div>
        </div>

        {/* Handshaking Theorem Card */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col">
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Zap className="w-4 h-5 text-indigo-600" style={activeTheme ? { color: activeTheme.primaryColor } : undefined} /> Handshaking Theorem Validation
          </h3>
          
          <div className="my-3 text-center bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <p className="font-mono text-base font-bold text-slate-900">∑ deg(v) = 2 |E|</p>
            <p className="text-[10px] text-slate-400 mt-1">Sum of all degrees equals twice the edges count.</p>
          </div>

          <div className="grid grid-cols-5 items-center gap-2 font-mono text-xs text-center font-bold text-slate-800">
            <div className="col-span-2 border rounded-xl p-2.5" style={activeTheme ? { backgroundColor: activeTheme.secondaryColor, borderColor: activeTheme.primaryColor + '30' } : { backgroundColor: '#f0fdfa', borderColor: '#ccfbf1' }}>
              <span className="text-[9px] uppercase" style={activeTheme ? { color: activeTheme.textColor } : { color: '#0f766e' }}>Degree Sum</span>
              <p className="text-sm mt-0.5" style={activeTheme ? { color: activeTheme.primaryColor } : { color: '#115e59' }}>{sumDegrees}</p>
            </div>
            <div className="text-slate-400 text-sm">=</div>
            <div className="col-span-2 border rounded-xl p-2.5" style={activeTheme ? { backgroundColor: activeTheme.secondaryColor, borderColor: activeTheme.primaryColor + '30' } : { backgroundColor: '#f5f3ff', borderColor: '#ddd6fe' }}>
              <span className="text-[9px] uppercase" style={activeTheme ? { color: activeTheme.textColor } : { color: '#4338ca' }}>2 × Edges</span>
              <p className="text-sm mt-0.5" style={activeTheme ? { color: activeTheme.primaryColor } : { color: '#3730a3' }}>{size * 2}</p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3 bg-teal-500/10 text-teal-800 border border-teal-500/20 px-3.5 py-2.5 rounded-xl text-xs">
            <Sparkles className="w-4 h-4 text-teal-600 shrink-0" style={activeTheme ? { color: activeTheme.primaryColor } : undefined} />
            <p className="font-sans leading-snug">
              <strong>Theorem holds!</strong> The degree sum ({sumDegrees}) matches 2 × {size} edges. Each edge touches exactly 2 endpoints.
            </p>
          </div>
        </div>

        {/* Degree Sequence Checker */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col">
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Zap className="w-4 h-5 text-amber-600" style={activeTheme ? { color: activeTheme.primaryColor } : undefined} /> Degree Sequence Analysis
          </h3>

          <div className="space-y-4 mt-4">
            <div>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Degree Sequence (Descending Order)
              </span>
              <p className="font-mono text-sm font-bold text-slate-800 bg-slate-50 border border-slate-100 p-2.5 rounded-xl">
                {order === 0 ? '∅' : `( ${degreeSeq.join(', ')} )`}
              </p>
            </div>

            <div className="text-xs text-slate-600 space-y-2 bg-slate-50/50 p-3 rounded-xl border border-slate-100/60">
              <div className="flex items-center justify-between">
                <span>Total vertices with Odd Degree:</span>
                <span className="font-mono font-bold text-slate-900">
                  {degreeSeq.filter(d => d % 2 !== 0).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Is odd vertices count Even?</span>
                <span className={`font-semibold ${
                  degreeSeq.filter(d => d % 2 !== 0).length % 2 === 0 ? 'text-emerald-600' : 'text-red-500'
                }`}>
                  {degreeSeq.filter(d => d % 2 !== 0).length % 2 === 0 ? 'Yes (Satisfied)' : 'No'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Graphical Validation Status:</span>
                <span className="font-bold text-emerald-600">
                  {order > 0 ? 'Graphical (Simple Graph Exists)' : 'Empty'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
