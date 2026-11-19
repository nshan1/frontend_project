import axios from "axios"
import { useState } from "react"
import { useForm } from "react-hook-form"

type createDatabaseProps = {
    isOpen:boolean,
    onClose:() => void,
    onCreated:() => void
}

type FormData = {
    dbName:string
    dbUser:string
    dbPassword:string
}

export default function CreateDatabseModal({isOpen, onClose, onCreated}:createDatabaseProps){
    const [error, setError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        reset,
        formState:{errors, isSubmitting}
    } = useForm<FormData>()

    if(!isOpen) return null;
    
    const onSubmit = async (data:FormData) => {
        setError(null)

        try {
            const res = await axios.post('/api/database/create', {
                dbName:data.dbName,
                dbUser:data.dbUser,
                dbPassword:data.dbPassword
            })
            if(res.data.success){
                reset()
                onCreated()
                onClose()
            }
        } catch (error:any) {
            setError(error.response?.data?.message || 'Failed to create database')
        }
    }

    const handleClose = () => {
        reset()
        setError(null)
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#172923]/60 px-4 backdrop-blur-[2px]">
            <div className="relative w-full max-w-md border-2 border-[#172923] bg-[#fffdf5] p-6 shadow-[7px_7px_0_0_#172923] font-mono">                
                <div className="flex items-center justify-between border-b-2 border-[#172923] pb-3 mb-5">
                    <h2 className="text-sm font-black uppercase text-[#172923] flex items-center gap-2">
                        <span className="size-2 bg-[#e75b3d]" /> Create New Database
                    </h2>
                    <button 
                        type="button"
                        onClick={handleClose}
                        className="text-xs font-bold px-2 py-1 border-2 border-[#172923] hover:bg-[#e75b3d] hover:text-[#fffdf5] transition-colors"
                    >
                        ✕
                    </button>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase mb-2 text-[#52615a]">
                            Database Name
                        </label>
                        <input 
                            type="text"
                            {...register("dbName", { 
                                required: "Database name is required",
                                pattern: {
                                    value: /^[a-zA-Z0-9_]+$/,
                                    message: "Only letters, numbers and underscores are allowed"
                                }
                            })}
                            placeholder="e.g. my_new_store"
                            autoFocus
                            className="w-full border-2 border-[#172923] bg-[#f3edda] px-3 py-2 text-xs font-bold uppercase text-[#172923] placeholder:text-[#a9b29e] focus:outline-none focus:ring-2 focus:ring-[#e75b3d]"
                        />
                        {errors.dbName && (
                            <p className="mt-1 text-[10px] font-bold text-[#e75b3d]">
                                {errors.dbName.message as string}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase mb-1 text-[#52615a]">
                            Database User (Optional)
                        </label>
                        <input 
                            type="text"
                            {...register("dbUser", {
                                pattern: {
                                    value: /^[a-zA-Z0-9_]*$/,
                                    message: "Only letters, numbers and underscores are allowed"
                                }
                            })}
                            placeholder="e.g. store_admin"
                            className="w-full border-2 border-[#172923] bg-[#f3edda] px-3 py-2 text-xs font-bold uppercase text-[#172923] placeholder:text-[#a9b29e] focus:outline-none focus:ring-2 focus:ring-[#e75b3d]"
                        />
                        {errors.dbUser && (
                            <p className="mt-1 text-[10px] font-bold text-[#e75b3d]">
                                {String(errors.dbUser.message)}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase mb-1 text-[#52615a]">
                            Password (Optional)
                        </label>
                        <input 
                            type="password"
                            {...register("dbPassword")}
                            placeholder="••••••••"
                            className="w-full border-2 border-[#172923] bg-[#f3edda] px-3 py-2 text-xs font-bold text-[#172923] placeholder:text-[#a9b29e] focus:outline-none focus:ring-2 focus:ring-[#e75b3d]"
                        />
                    </div>

                    {error && (
                        <div className="border-2 border-[#e75b3d] bg-[#e75b3d]/10 p-2 text-xs font-bold text-[#e75b3d]">
                            {error}
                        </div>
                    )}
                    <div className="flex items-center justify-end gap-3 pt-3 border-t-2 border-[#172923]">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="border-2 border-[#172923] bg-[#fffdf5] px-4 py-2 text-xs font-bold uppercase text-[#52615a] hover:bg-[#f3edda] transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="border-2 border-[#172923] bg-[#d6e7a3] px-4 py-2 text-xs font-black uppercase text-[#172923] shadow-[3px_3px_0_0_#172923] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0_0_#172923] transition-all disabled:opacity-50"
                        >
                            {isSubmitting ? 'Creating...' : 'Create Database'}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    )
}   