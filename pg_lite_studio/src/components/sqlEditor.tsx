"use client"

import { useState } from "react"
import { useDatabaseStore } from "../store/useDatabaseStore"

export default function SQLEditor(){
    const [queryError, setQueryError] = useState<string | null>(null)
    const [isExecuting, setIsExecuting] = useState<boolean>(false)
    const [SqlQuery, setSqlQuery] = useState<string>('')
    const [queryResult, setQueryResult] = useState<any[]>([])

    const {fetchTables, fetchTableData, selectedTable} = useDatabaseStore()
     
    const handleQuery = async() => {
        setQueryError(null)
        setIsExecuting(true)

        try {
            const response = await fetch('/api/query', {
                method:'POST',
                headers:{
                    'Content-Type':'Application/json'
                },
                body:JSON.stringify({query:SqlQuery})
            })

            const data = await response.json()

            if(data.success){
                setQueryResult(data.rows)

                await fetchTables()
                if(selectedTable){
                    await fetchTableData(selectedTable)
                }
            } else {
                setQueryError(data.error)
                setQueryResult([])
            }
        } catch(err:any){
            setQueryError(err.message)
        } finally {
            setIsExecuting(false)
        }
    }

    const editorColumns = (Array.isArray(queryResult) && queryResult.length > 0) ? Object.keys(queryResult[0]) : []

    return (
        <div className="space-y-6">
            <div className="overflow-hidden border-2 border-[#172923] bg-[#fffdf5] shadow-[4px_4px_0_0_#172923] sm:shadow-[6px_6px_0_0_#172923]">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#172923] bg-[#172923] px-4 py-3 sm:px-5">
                    <label className="font-mono text-xs font-bold uppercase text-[#d6e7a3]">SQL Console</label>
                    <button
                        onClick={handleQuery}
                        disabled={isExecuting}
                        className="border-2 border-[#172923] bg-[#d6e7a3] px-3 py-2 font-mono text-[10px] font-black uppercase text-[#172923] shadow-[3px_3px_0_0_#fffdf5] transition-[transform,box-shadow,background-color] hover:-translate-y-0.5 hover:bg-[#c7dd83] hover:shadow-[4px_4px_0_0_#fffdf5] active:translate-y-0.5 active:shadow-[1px_1px_0_0_#fffdf5] disabled:cursor-wait disabled:opacity-60 sm:px-4 sm:text-xs"
                    >
                        {isExecuting ? 'Executing...' : 'Run Query (▶)'}
                    </button>
                </div>
                <textarea
                    value={SqlQuery}
                    onChange={(e) => setSqlQuery(e.target.value)}
                    placeholder="Enter SQL query"
                    className="min-h-48 w-full resize-y bg-[#fffdf5] px-4 py-4 font-mono text-sm leading-6 text-[#172923] outline-none placeholder:text-[#9aa49a] focus:bg-white focus:ring-2 focus:ring-inset focus:ring-[#e75b3d] sm:min-h-64 sm:px-5"
                />
            </div>

            {queryError && (
                <div className="border-2 border-[#c53e2b] bg-[#fff0e8] px-4 py-3 font-mono text-sm text-[#9e3024]">
                    {queryError}
                </div>
            )}

            <div className="overflow-hidden border-2 border-[#172923] bg-[#fffdf5]">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#172923] bg-[#172923] px-4 py-3 font-mono text-xs font-bold uppercase sm:px-5">
                    <span className="text-[#d6e7a3]">Results</span>
                    <span className="text-[#fffdf5]">{queryResult.length} rows returned</span>
                </div>
                <div className="overflow-x-auto">
                    {queryResult.length === 0 ? (
                        <div className="px-5 py-10 text-center font-mono text-sm font-bold uppercase text-[#52615a]">
                            No results to display
                        </div>
                    ): (
                        <table className="w-full border-collapse text-left font-mono text-xs">
                            <thead className="bg-[#d6e7a3]">
                                <tr>
                                    {editorColumns.map((colum) =>(
                                        <th key={colum} className="whitespace-nowrap border-b-2 border-r border-[#172923] px-4 py-3 font-black uppercase last:border-r-0">{colum}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {queryResult.map((row, index) =>(
                                    <tr key={index} className="border-b border-[#d8d7c8] last:border-b-0 even:bg-[#f3edda]/60">
                                        {editorColumns.map((col) =>{
                                            const cellValue = row[col] !== null ? String(row[col]) : null;
                                            return (<td key={col} title={cellValue ?? 'NULL'} className="max-w-[200px] truncate whitespace-nowrap overflow-hidden border-r border-[#d8d7c8] px-4 py-3 align-top text-[#34443b] last:border-r-0">
                                                {cellValue !== null ? (cellValue) : (<span className="font-bold uppercase text-[#e75b3d]">NULL</span>)}
                                            </td>
                                        )})}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    )
}