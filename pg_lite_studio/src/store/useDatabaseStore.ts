import {create} from 'zustand'

type DatabaseState = {
    tables:any[],
    selectedTable:string | null,
    tableData:any[],
    activeTab:'browser' | 'editor' | 'erd'

    setActivetab: (tab: 'browser' | 'editor' | 'erd') => void
    fetchTables: () => Promise<void>
    fetchTableData:(tableName:string) => Promise<void>
    setSelectedTable:(tableName:string) => Promise<void>
}

export const useDatabaseStore  = create<DatabaseState>((set, get)=>({
    tables:[],
    selectedTable:null,
    tableData:[],
    activeTab:'browser',

    setActivetab: (tab) => set({activeTab:tab}),
    fetchTables: async () =>{
        try {
            const response = await fetch('/api/schema/tables')
            const data = await response.json()

            if(data.success){
                set({tables:data.tables})
            }
        } catch (error) {
            console.log(error)
        }
    },

    fetchTableData: async (tableName:string) =>{
        try {
            const response = await fetch(`/api/schema/${tableName}`)
            const data = await response.json()

            if(data.success){
                set({tableData:data.rows})
            }
        } catch(error){
            console.log(error)
        }
    },

    setSelectedTable: async(tableName:string)=>{
        set({selectedTable:tableName, activeTab:'browser'})
        await get().fetchTableData(tableName)
    }
}))