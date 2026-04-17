import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'motion/react';
import { GraphData, GraphNode, GraphLink } from '../types';
import { 
  Maximize2, 
  Minimize2, 
  RefreshCw, 
  ZoomIn, 
  ZoomOut, 
  Zap, 
  ArrowRight, 
  ExternalLink, 
  Link2,
  FileText,
  Hash,
  User 
} from 'lucide-react';

const MOCK_GRAPH: GraphData = {
  nodes: [
    { id: '1', label: '深度学习基础', type: 'page', val: 25 },
    { id: '2', label: '神经网络架构', type: 'page', val: 22 },
    { id: '3', label: 'Transformer模型', type: 'page', val: 20 },
    { id: '4', label: 'Attention机制', type: 'tag', val: 12 },
    { id: '5', label: '自然语言处理', type: 'tag', val: 15 },
    { id: '6', label: '计算机视觉', type: 'tag', val: 14 },
    { id: '7', label: 'CNN', type: 'page', val: 16 },
    { id: '8', label: 'RNN', type: 'page', val: 16 },
    { id: '9', label: 'GANs', type: 'page', val: 18 },
    { id: '10', label: 'Ian Goodfellow', type: 'author', val: 14 },
    { id: '11', label: '强化学习', type: 'page', val: 18 },
    { id: '12', label: '卷积核', type: 'tag', val: 10 },
    { id: '13', label: '激活函数', type: 'tag', val: 10 },
  ],
  links: [
    { source: '1', target: '2', type: 'citation' },
    { source: '2', target: '3', type: 'citation' },
    { source: '3', target: '4', type: 'tag' },
    { source: '3', target: '5', type: 'tag' },
    { source: '7', target: '6', type: 'tag' },
    { source: '8', target: '5', type: 'tag' },
    { source: '9', target: '10', type: 'author' },
    { source: '9', target: '6', type: 'tag' },
    { source: '2', target: '7', type: 'citation' },
    { source: '2', target: '8', type: 'citation' },
    { source: '7', target: '12', type: 'tag' },
    { source: '2', target: '13', type: 'tag' },
    { source: '1', target: '11', type: 'citation' },
  ]
};

interface KnowledgeGraphProps {
  onNodeClick?: (node: GraphNode) => void;
}

export default function KnowledgeGraph({ onNodeClick }: KnowledgeGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [neighbors, setNeighbors] = useState<GraphNode[]>([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const simulationRef = useRef<d3.Simulation<GraphNode, GraphLink> | null>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  const getNeighborsWithLinks = (nodeId: string) => {
    return MOCK_GRAPH.links
      .filter(link => link.source === nodeId || link.target === nodeId)
      .map(link => {
        const neighborId = link.source === nodeId ? link.target : link.source;
        const neighbor = MOCK_GRAPH.nodes.find(n => n.id === neighborId);
        return {
          ...neighbor!,
          connectionType: link.type
        };
      });
  };

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g');

    // Zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 8])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    zoomRef.current = zoom;
    svg.call(zoom);

    // Initial simulation data
    const nodes = MOCK_GRAPH.nodes.map(d => ({ ...d }));
    const links = MOCK_GRAPH.links.map(d => ({ ...d }));

    const simulation = d3.forceSimulation<GraphNode>(nodes)
      .force('link', d3.forceLink<GraphNode, GraphLink>(links).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(d => (d as GraphNode).val + 10));

    simulationRef.current = simulation;

    // Draw links
    const link = g.append('g')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', '#E2E8F0')
      .attr('stroke-width', 1.5)
      .attr('stroke-opacity', 0.6);

    // Draw nodes
    const node = g.append('g')
      .selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .call(d3.drag<SVGGElement, GraphNode>()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        })
      )
      .on('mouseenter', (event, d) => {
        setHoveredNode(d);
        d3.select(event.currentTarget).select('circle').transition().duration(200).attr('r', d.val + 5);
      })
      .on('mouseleave', (event, d) => {
        setHoveredNode(null);
        d3.select(event.currentTarget).select('circle').transition().duration(200).attr('r', d.val);
      })
      .on('click', (event, d) => {
        setSelectedNode(d);
        const neighborsWithTypes = getNeighborsWithLinks(d.id);
        setNeighbors(neighborsWithTypes as GraphNode[]);
      });

    // Node circles
    node.append('circle')
      .attr('r', d => d.val)
      .attr('fill', d => {
        if (d.type === 'page') return '#2563EB';
        if (d.type === 'tag') return '#10B981';
        return '#F59E0B';
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .attr('class', 'shadow-sm');

    // Node labels
    node.append('text')
      .attr('dy', d => d.val + 15)
      .attr('text-anchor', 'middle')
      .text(d => d.label)
      .attr('class', 'text-[10px] font-bold fill-slate-600 pointer-events-none')
      .style('text-shadow', '0 1px 2px rgba(255,255,255,0.8)');

    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as any).x)
        .attr('y1', d => (d.source as any).y)
        .attr('x2', d => (d.target as any).x)
        .attr('y2', d => (d.target as any).y);

      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    // Handle Resize
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries.length === 0) return;
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) {
        simulation.force('center', d3.forceCenter(width / 2, height / 2));
        simulation.alpha(0.3).restart();
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      simulation.stop();
      resizeObserver.disconnect();
    };
  }, [onNodeClick]);

  const resetZoom = () => {
    if (!svgRef.current || !zoomRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.transition().duration(750).call(zoomRef.current.transform, d3.zoomIdentity);
  };

  const handleZoom = (delta: number) => {
    if (!svgRef.current || !zoomRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.transition().duration(300).call(zoomRef.current.scaleBy, delta);
  };

  return (
    <div 
      ref={containerRef} 
      className={`relative w-full h-full bg-[#f8fafc] overflow-hidden ${isFullScreen ? 'fixed inset-0 z-50 bg-white' : ''}`}
    >
      <svg 
        ref={svgRef} 
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Controls Overlay */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <div className="flex bg-white/80 backdrop-blur-md rounded-xl border border-slate-200 p-1 shadow-sm">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsFullScreen(!isFullScreen);
            }} 
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
          >
            {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              resetZoom();
            }} 
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <div className="w-px bg-slate-200 mx-1"></div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleZoom(1.3);
            }} 
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleZoom(0.7);
            }} 
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-xl rounded-2xl border border-slate-200 p-4 shadow-xl ring-1 ring-slate-900/5 transition-all hover:scale-[1.02]">
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">图谱图例标识</div>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-lg bg-blue-100 flex items-center justify-center">
              <FileText className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-black text-slate-800 uppercase tracking-tight">知识页面</span>
              <span className="text-[9px] font-bold text-slate-400">核心文档节点</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Hash className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-black text-slate-800 uppercase tracking-tight">关联标签</span>
              <span className="text-[9px] font-bold text-slate-400">语义分类维度</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-lg bg-amber-100 flex items-center justify-center">
              <User className="h-4 w-4 text-amber-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-black text-slate-800 uppercase tracking-tight">主要作者</span>
              <span className="text-[9px] font-bold text-slate-400">内容贡献主体</span>
            </div>
          </div>
        </div>
      </div>

      {/* Info Panel Overlay */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="absolute top-4 left-4 w-72 bg-white/95 backdrop-blur-lg rounded-2xl border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col max-h-[calc(100%-120px)] z-[100]"
          >
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
               <div className="flex items-center gap-3">
                 <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-white ${
                   selectedNode.type === 'page' ? 'bg-blue-600' : 
                   selectedNode.type === 'tag' ? 'bg-emerald-500' : 'bg-amber-500'
                 }`}>
                   <Zap className="h-4 w-4" />
                 </div>
                 <div>
                   <h4 className="text-sm font-bold text-slate-900 leading-tight">{selectedNode.label}</h4>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{selectedNode.type}</p>
                 </div>
               </div>
               <button 
                 onClick={() => {
                   setSelectedNode(null);
                   setNeighbors([]);
                 }}
                 className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 transition-colors"
               >
                 <RefreshCw className="h-3.5 w-3.5" />
               </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
              <div className="grid grid-cols-2 gap-3">
                 <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-center">
                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">节点标识</div>
                    <div className="text-xs font-mono font-bold text-slate-700 truncate">#{selectedNode.id}</div>
                 </div>
                 <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-center">
                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">核心权重</div>
                    <div className="text-lg font-bold text-slate-700">{selectedNode.val}</div>
                 </div>
              </div>

              {neighbors.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Link2 className="h-3 w-3" /> 直接关联 ({neighbors.length})
                  </div>
                  <div className="space-y-2">
                    {neighbors.map(neighbor => (
                      <div 
                        key={neighbor.id}
                        className="group flex items-center gap-2"
                      >
                        <button 
                          onClick={() => {
                            setSelectedNode(neighbor);
                            setNeighbors(getNeighborsWithLinks(neighbor.id) as GraphNode[]);
                          }}
                          className="flex-1 flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-white hover:border-blue-200 hover:shadow-sm transition-all text-left"
                        >
                          <div className="flex flex-col gap-0.5 min-w-0">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <div className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                                neighbor.type === 'page' ? 'bg-blue-500' : 
                                neighbor.type === 'tag' ? 'bg-emerald-500' : 'bg-amber-500'
                              }`}></div>
                              <span className="text-xs font-bold text-slate-700 truncate">{neighbor.label}</span>
                            </div>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight ml-3">
                              关系: {neighbor.connectionType === 'citation' ? '学术引用' : neighbor.connectionType === 'tag' ? '语义描述' : '贡献作者'}
                            </span>
                          </div>
                        </button>
                        {neighbor.type === 'page' && (
                          <button 
                            onClick={() => onNodeClick?.(neighbor)}
                            className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-all shrink-0"
                            title="跳转至 Wiki 页面"
                          >
                            <ArrowRight className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50/50 border-t border-slate-100">
              <button 
                onClick={() => onNodeClick?.(selectedNode)}
                className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                进入页面 <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        )}

        {hoveredNode && !selectedNode && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white px-4 py-2 rounded-full text-xs font-medium backdrop-blur-md shadow-lg pointer-events-none"
          >
            {hoveredNode.label} ({hoveredNode.type})
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
