'use client'

import { useEffect, useState } from "react"
import SQLEditor from "@/src/components/sqlEditor"
import { useDatabaseStore } from "@/src/store/useDatabaseStore" 
import ErdViewer from "@/src/components/erd"
import { useRouter } from "next/navigation"
import axios from "axios"
import CreateDatabseModal from "@/src/components/createDatabase"



export default function Dashboard(){
    const {
        tables,
        selectedTable,
        tableData,
        activeTab,
        setActivetab,
        fetchTables,
        setSelectedTable
    } = useDatabaseStore()

    const [exiting, setExiting] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() =>{
        fetchTables()
    },[fetchTables])

    // const router = useRouter()
    const handleExit = async () =>{
        setExiting(true)
        try {
            await axios.post('/api/auth/exit')
            window.location.href='/'
        }catch(err){
            console.log(err)
            setExiting(false)
        }
    }


    const columns = (Array.isArray(tableData) && tableData.length > 0) ? Object.keys(tableData[0]) : []
    
    return (
        <main className="relative min-h-screen overflow-hidden bg-[#f3edda] px-4 py-8 text-[#172923] sm:px-6 lg:px-10">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#1729230c_1px,transparent_1px),linear-gradient(to_bottom,#1729230c_1px,transparent_1px)] bg-size-[28px_28px]" />
            <div className="relative mx-auto max-w-7xl">
                <header className="mb-7 flex flex-wrap items-center justify-between gap-4 font-mono text-xs font-bold uppercase">
                    <span className="flex items-center gap-2"><span className="size-2.5 bg-[#e75b3d]" /> PG / LITE STUDIO</span>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setActivetab('browser')}
                            className={`border-2 border-[#172923] px-3 py-2 font-mono text-[10px] font-black uppercase transition-colors sm:px-4 sm:text-xs ${
                                activeTab === 'browser'
                                    ? 'bg-[#d6e7a3] text-[#172923] shadow-[3px_3px_0_0_#e75b3d]'
                                    : 'bg-[#fffdf5] text-[#52615a] hover:bg-[#f3edda]'
                            }`}
                        >
                            Schema Browser
                        </button>
                        <button
                            onClick={()=>setActivetab('editor')}
                            className={`border-2 border-[#172923] px-3 py-2 font-mono text-[10px] font-black uppercase transition-colors sm:px-4 sm:text-xs ${
                                activeTab === 'editor'
                                    ? 'bg-[#d6e7a3] text-[#172923] shadow-[3px_3px_0_0_#e75b3d]'
                                    : 'bg-[#fffdf5] text-[#52615a] hover:bg-[#f3edda]'
                            }`}
                        >
                            SQL Query Editor
                        </button>
                        <button
                            onClick={() => setActivetab('erd')}
                            className={`border-2 border-[#172923] px-3 py-2 font-mono text-[10px] font-black uppercase transition-colors sm:px-4 sm:text-xs ${
                                activeTab === 'erd'
                                    ? 'bg-[#d6e7a3] text-[#172923] shadow-[3px_3px_0_0_#e75b3d]'
                                    : 'bg-[#fffdf5] text-[#52615a] hover:bg-[#f3edda]'
                            }`}
                        >
                            ERD Diagram
                        </button>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="border-2 border-[#172923] bg-[#fffdf5] px-3 py-2 font-mono text-[10px] font-black uppercase text-[#52615a] shadow-[3px_3px_0_0_#172923] hover:bg-[#f3edda] transition-colors sm:px-4 sm:text-xs"
                        >
                            New DB
                        </button>
                    </div>
                    <span className="border-2 border-[#172923] bg-[#d6e7a3] px-2 py-1">Database / 01</span>
                    <button onClick={()=>handleExit()} disabled={exiting} className="border-2 border-[#172923] bg-[#e75b3d] px-3 py-2 font-mono text-[10px] font-black uppercase text-[#fffdf5] transition-colors hover:bg-[#172923] sm:px-4 sm:text-xs">
                        Exit
                    </button>
                </header>

                <div className="mb-7">
                    <p className="mb-2 font-mono text-xs font-bold uppercase text-[#e75b3d]">Workspace / {activeTab === 'browser' ? 'Schema browser' : activeTab === 'editor' ? 'SQL Query Editor': 'ERD Diagram'}</p>
                    <h1 className="font-mono text-3xl font-black uppercase leading-tight sm:text-4xl">{activeTab === 'browser' ? 'Database tables' : activeTab === 'editor' ? 'Query Console' : 'Database Schema Relations'}</h1>
                    <p className="mt-2 text-sm leading-6 text-[#52615a]">Browse tables and inspect their records.</p>
                </div>

                <div className="grid items-start gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
                    <aside className="border-2 border-[#172923] bg-[#fffdf5] shadow-[5px_5px_0_0_#172923] sm:shadow-[7px_7px_0_0_#172923]">
                        <div className="flex items-center justify-between border-b-2 border-[#172923] bg-[#172923] px-4 py-3 font-mono text-xs font-bold uppercase text-[#d6e7a3]">
                            <h2>Tables</h2>
                            <span className="text-[#fffdf5]">{String(tables.length).padStart(2, '0')}</span>
                        </div>
                        <ul className="space-y-1 p-3">
                            {tables.map((table) =>(
                                <li key={table.table_name} onClick={() => setSelectedTable(table.table_name)} className={`flex cursor-pointer items-center justify-between border-2 px-3 py-2.5 font-mono text-xs font-bold uppercase transition-colors ${
                                        selectedTable === table.table_name && activeTab === 'browser'
                                            ? 'border-[#172923] bg-[#d6e7a3] text-[#172923]'
                                            : 'border-transparent text-[#52615a] hover:border-[#172923] hover:bg-[#f3edda]'
                                    }`}>
                                    <span>{table.table_name}</span>
                                    <span aria-hidden="true">-&gt;</span>
                                </li>
                            ))}
                        </ul>
                    </aside>

                    <section className="min-w-0 border-2 border-[#172923] bg-[#fffdf5] shadow-[5px_5px_0_0_#172923] sm:shadow-[7px_7px_0_0_#172923]">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#172923] bg-[#172923] px-5 py-3 font-mono text-xs font-bold uppercase text-[#d6e7a3]">
                            <span>
                                {activeTab === 'browser' 
                                    ? (selectedTable ? 'Table / ' + selectedTable : 'Table viewer') 
                                    : 'SQL Editor Console'}
                            </span>
                            <span className="text-[#fffdf5]">
                                {activeTab === 'browser' ? (selectedTable ? 'Records' : 'Awaiting selection') : 'Active'}
                            </span>
                        </div>
                        <div className="p-4 sm:p-6">
                            {activeTab === 'browser' ? (selectedTable ? (
                                <div>
                                    <h2 className="mb-5 font-mono text-xl font-black uppercase sm:text-2xl">
                                        <span className="text-[#e75b3d]">Table:</span> {selectedTable}
                                    </h2>
                                    {!tableData || tableData.length === 0 ?(
                                        <div className="border-2 border-dashed border-[#a9b29e] bg-[#f3edda]/60 px-5 py-10 text-center">
                                            <p className="font-mono text-sm font-bold uppercase">Table is empty</p>
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto border-2 border-[#172923]">
                                            <table className="w-full border-collapse text-left font-mono text-xs">
                                                <thead className="bg-[#d6e7a3]">
                                                    <tr>
                                                        {
                                                            columns.map((colum) =>(
                                                                <th key={colum} className="whitespace-nowrap border-b-2 border-r border-[#172923] px-4 py-3 font-black uppercase last:border-r-0">{colum}</th>
                                                            )
                                                        )}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {tableData.map((row, index)=>(
                                                        <tr key={index} className="border-b border-[#d8d7c8] last:border-b-0 even:bg-[#f3edda]/60">
                                                            {columns.map((colum) => {
                                                                const cellValue = row[colum] !== null ? String(row[colum]) : null;
                                                                return (
                                                                    <td 
                                                                        key={colum} 
                                                                        title={cellValue || ''} // 👈 Ավելացվել է title հուշման համար
                                                                        className="max-w-[180px] truncate border-r border-[#d8d7c8] px-4 py-3 align-top text-[#34443b] last:border-r-0"
                                                                        style={{
                                                                            maxWidth: '180px',
                                                                            whiteSpace: 'nowrap',
                                                                            overflow: 'hidden',
                                                                            textOverflow: 'ellipsis'
                                                                        }}
                                                                    >
                                                                        {cellValue !== null ? cellValue : <span className="font-bold uppercase text-[#e75b3d]">NULL</span>}
                                                                    </td>
                                                                );
                                                            })}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            )  :(
                                <div className="flex min-h-64 flex-col items-center justify-center border-2 border-dashed border-[#a9b29e] bg-[#f3edda]/60 px-5 py-10 text-center">
                                    <span className="mb-3 font-mono text-2xl font-black text-[#e75b3d]">-&gt;</span>
                                    <p className="font-mono text-sm font-bold uppercase">Select a table from the sidebar</p>
                                    <p className="mt-2 text-sm text-[#52615a]">Its rows will appear here.</p>
                                </div>
                            )
                            ):  activeTab === 'editor' ? (
                                <SQLEditor />
                            ):(
                                <ErdViewer />
                            )}
                        </div>
                    </section>
                </div>
                <footer className="mt-6 flex items-center justify-between font-mono text-[10px] font-bold uppercase text-[#52615a]">
                    <span>Data browser</span><span>Session / Active</span>
                </footer>
            </div>
            <CreateDatabseModal
                isOpen = {isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreated={() => fetchTables()}    
            />
        </main>
    )
}