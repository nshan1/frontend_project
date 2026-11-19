'use client'

import { Background, Controls, Handle, Position, ReactFlow, useEdgesState, useNodesState } from "@xyflow/react"
import '@xyflow/react/dist/style.css'
import { useEffect, useState } from "react"

const Table = ({ data }: { data: any }) => {
    return (
        <div style={{
            background: '#fffdf5',
            border: '2px solid #172923',
            boxShadow: '4px 4px 0 0 #172923',
            minWidth: '240px',
            fontFamily: 'monospace',
            fontSize: '11px',
            overflow: 'hidden'
        }}>
            <div style={{
                background: '#172923',
                color: '#d6e7a3',
                padding: '8px 10px',
                fontWeight: 'bold',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '2px solid #172923',
                textTransform: 'uppercase'
            }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span>🗂️</span> {data.tableName}
                </span>
                <span style={{ fontSize: '9px', color: '#fffdf5' }}>Table</span>
            </div>
            
            <div style={{ background: '#fffdf5', padding: '2px 0' }}>
                {data.columns.map((col: any) => {
                    const isPK = data.primaryKeys.includes(col.column_name)

                    return (
                        <div key={col.column_name} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '5px 10px',
                            borderBottom: '1px solid #d8d7c8',
                            transition: 'background 0.1s'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                {isPK ? <span title="Primary Key">🔑</span> : <span style={{ width: '12px', display: 'inline-block' }}></span>}
                                <span style={{ fontWeight: isPK ? 'bold' : 'normal', color: isPK ? '#e75b3d' : '#172923' }}>
                                    {col.column_name}
                                </span>
                            </div>
                            <span style={{ fontSize: '10px', color: '#52615a', fontStyle: 'italic' }}>{col.data_type}</span>
                        </div>
                    )
                })}
            </div>
            <Handle type="target" position={Position.Left} style={{ background: '#e75b3d', border: '1px solid #172923', width: '8px', height: '8px', borderRadius: '50%' }} />
            <Handle type="source" position={Position.Right} style={{ background: '#e75b3d', border: '1px solid #172923', width: '8px', height: '8px', borderRadius: '50%' }} />
        </div>
    )
}

const nodeTypes = { tableNode: Table }

export default function ErdViewer() {
    const [nodes, setNodes, onNodesChange] = useNodesState<any>([])
    const [edges, setEdges, onEdgesChange] = useEdgesState<any>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchRelations = async () => {
            try {
                const response = await fetch('/api/schema/relations')
                const data = await response.json()

                if (data.success) {
                    const { columns, primaryKeys, foreignKeys } = data

                    const tablesMap: { [key: string]: any[] } = {}

                    columns.forEach((col: any) => {
                        if (!tablesMap[col.table_name]) {
                            tablesMap[col.table_name] = []
                        }
                        tablesMap[col.table_name].push(col)
                    })

                    const tableNames = Object.keys(tablesMap)

                    const generatedNodes = tableNames.map((tableName, index) => {
                        const pkList = primaryKeys.filter((pk: any) => pk.table_name === tableName).map((pk: any) => pk.column_name)

                        const x = (index % 3) * 340 + 50
                        const y = Math.floor(index / 3) * 380 + 50

                        return {
                            id: tableName,
                            type: 'tableNode',
                            position: { x, y },
                            data: {
                                tableName,
                                columns: tablesMap[tableName],
                                primaryKeys: pkList
                            }
                        }
                    })

                    const generatedEdges = foreignKeys.map((fk: any, index: any) => ({
                        id: `edge-${index}`,
                        source: fk.source_table,
                        target: fk.target_table,
                        animated: false,
                        style: { stroke: '#e75b3d', strokeWidth: 2 },
                        label: `${fk.source_column} -> ${fk.target_column}`,
                        labelStyle: { fill: '#172923', fontWeight: 600, fontSize: 10 }
                    }))

                    setNodes(generatedNodes)
                    setEdges(generatedEdges)
                }
                
            } catch (error) {
                console.log('Failed loaded Erd schema', error)
            } finally {
                setLoading(false)
            }
        }

        fetchRelations()
    }, [])

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '500px', fontFamily: 'monospace', color: '#52615a' }}>
                Loading ER Diagram...
            </div>
        )
    }

    return (
        <div style={{ width: '100%', height: '650px', background: '#f3edda', border: '2px solid #172923' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                fitView
            >
                <Background gap={20} size={1} color="#d8d7c8" />
                <Controls />
            </ReactFlow>
        </div>
    )
}