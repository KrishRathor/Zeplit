import React, { useCallback, useEffect, useState } from "react";
import ReactFlow, { Background, Controls, MiniMap, addEdge, applyEdgeChanges, applyNodeChanges, useEdges } from "reactflow";
import 'reactflow/dist/style.css';

const initialNodes = [
    { id: '1', data: { label: 'Parent' }, position: { x: 400, y: 100 } },
    { id: '2', data: { label: 'Child' }, position: { x: 400, y: 300 } },
    { id: '3', data: { label: 'Child2' }, position: { x: 400, y: 600 } },
];

const initialEdges: any = [];

export const Flow: React.FC = () => {

    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);

    const onNodesChange = useCallback((changes: any) => {
        setNodes(nds => applyNodeChanges(changes, nds));
    }, []);

    const onEdgeChange = useCallback((changes: any) => {
        setEdges(eds => applyEdgeChanges(changes, eds));
    }, [])

    const onConnect = useCallback((params: any) => {
        setEdges(eds => addEdge(params, eds))
    }, [])

    useEffect(() => {console.log(nodes, edges)}, [nodes, edges]);

    return (
        <div className=" w-[60vw] h-[100vh] m-0 p-0" >
            <ReactFlow 
                nodes={nodes}
                edges={edges}
                className=" bg-[#191919]"
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgeChange}
                onConnect={onConnect}
            >
                <Background />
                <Controls />
                <MiniMap />
            </ReactFlow>
        </div>
    )
}