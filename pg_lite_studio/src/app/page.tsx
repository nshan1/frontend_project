"use client"
import { useState } from 'react'
import {useForm, type SubmitHandler} from 'react-hook-form'
import { ConnectionConfig } from '../types/connection'
import { useRouter } from 'next/navigation'
import axios from 'axios'


export default function HomePage(){

	const {register, handleSubmit, formState:{errors}} = useForm<ConnectionConfig>()
	const [error, setError] = useState("")
	const router = useRouter()
	const [isLoading, setLoading] = useState(false)



	const handleSignIn:SubmitHandler<ConnectionConfig> = async (data) =>{
		setError('')
		setLoading(true)

		try{
			await axios.post('/api/auth/connect', data)
			router.push('/dashboard')			
		} catch(err){
			if(axios.isAxiosError(err)){
				setError(err.response?.data?.error || 'Connection failed')
			}
		} finally{
			setLoading(false)
		}
	}


	return (
		<main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f3edda] px-4 py-12 text-[#172923]">
			<div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#1729230c_1px,transparent_1px),linear-gradient(to_bottom,#1729230c_1px,transparent_1px)] bg-size-[28px_28px]" />
			<section className="relative w-full max-w-xl">
				<header className="mb-7 flex items-center justify-between font-mono text-xs font-bold uppercase">
					<span className="flex items-center gap-2"><span className="size-2.5 bg-[#e75b3d]" /> PG / LITE STUDIO</span>
					<span className="border-2 border-[#172923] bg-[#d6e7a3] px-2 py-1">Client 01</span>
				</header>

				<div className="border-2 border-[#172923] bg-[#fffdf5] shadow-[7px_7px_0_0_#172923] sm:shadow-[10px_10px_0_0_#172923]">
					<div className="flex items-center justify-between border-b-2 border-[#172923] bg-[#172923] px-5 py-3 font-mono text-xs font-bold uppercase text-[#d6e7a3]">
						<span>New connection</span>
							<span className="text-[#fffdf5]">***</span>
					</div>

					<div className="p-5 sm:p-8">
						<div className="mb-7">
							<p className="mb-2 font-mono text-xs font-bold uppercase text-[#e75b3d]">Database access</p>
							<h1 className="font-mono text-3xl font-black uppercase leading-tight sm:text-4xl">Connect to<br className="sm:hidden" /> PostgreSQL</h1>
							<p className="mt-3 max-w-md text-sm leading-6 text-[#52615a]">Enter your server details to open a session in the studio.</p>
						</div>

						<form onSubmit={handleSubmit(handleSignIn)} autoComplete='new-password' className="space-y-5">
							<div className="grid gap-5 sm:grid-cols-[1fr_140px]">
								<div className="space-y-2">
									<label htmlFor="host" className="block font-mono text-xs font-bold uppercase">Host</label>
									<input id="host" {...register("host", {required:"Host is required"})} placeholder="e.g. localhost" className="w-full border-2 border-[#172923] bg-white px-3 py-3 font-mono text-sm outline-none placeholder:text-[#9aa49a] focus:border-[#e75b3d] focus:ring-2 focus:ring-[#e75b3d]/20" />
									{errors.host && <span className="block font-mono text-xs font-bold text-[#c53e2b]">{errors.host.message}</span>}
								</div>
								<div className="space-y-2">
									<label htmlFor="port" className="block font-mono text-xs font-bold uppercase">Port</label>
									<input id="port" {...register("port", {required:"Port is required", valueAsNumber:true})} type="text" inputMode="numeric" placeholder="e.g. 5432" className="w-full border-2 border-[#172923] bg-white px-3 py-3 font-mono text-sm outline-none placeholder:text-[#9aa49a] focus:border-[#e75b3d] focus:ring-2 focus:ring-[#e75b3d]/20" />
									{errors.port && <span className="block font-mono text-xs font-bold text-[#c53e2b]">{errors.port.message}</span>}
								</div>
							</div>

							<div className="space-y-2">
								<label htmlFor="database" className="block font-mono text-xs font-bold uppercase">Database</label>
								<input id="database" {...register("database", {required:"Database is required"})} type="text" placeholder="e.g. postgres" className="w-full border-2 border-[#172923] bg-white px-3 py-3 font-mono text-sm outline-none placeholder:text-[#9aa49a] focus:border-[#e75b3d] focus:ring-2 focus:ring-[#e75b3d]/20" />
								{errors.database && <span className="block font-mono text-xs font-bold text-[#c53e2b]">{errors.database.message}</span>}
							</div>

							<div className="grid gap-5 sm:grid-cols-2">
								<div className="space-y-2">
									<label htmlFor="user" className="block font-mono text-xs font-bold uppercase">Username</label>
									<input id="user" {...register('user', {required:'Username is required'})} type="text" placeholder="e.g. user" className="w-full border-2 border-[#172923] bg-white px-3 py-3 font-mono text-sm outline-none placeholder:text-[#9aa49a] focus:border-[#e75b3d] focus:ring-2 focus:ring-[#e75b3d]/20" />
									{errors.user && <span className="block font-mono text-xs font-bold text-[#c53e2b]">{errors.user.message}</span>}
								</div>
								<div className="space-y-2">
									<label htmlFor="password" className="block font-mono text-xs font-bold uppercase">Password</label>
									<input id="password" {...register('password', {required:'password is required'})} type="password" placeholder="e.g. password" className="w-full border-2 border-[#172923] bg-white px-3 py-3 font-mono text-sm outline-none placeholder:text-[#9aa49a] focus:border-[#e75b3d] focus:ring-2 focus:ring-[#e75b3d]/20" />
									{errors.password && <span className="block font-mono text-xs font-bold text-[#c53e2b]">{errors.password.message}</span>}
								</div>
							</div>

							{error && <div role="alert" className="border-2 border-[#c53e2b] bg-[#fff0e8] px-3 py-3 font-mono text-sm text-[#9e3024]">{error}</div>}
							<button type="submit" className="flex w-full items-center justify-between border-2 border-[#172923] bg-[#d6e7a3] px-4 py-4 font-mono text-sm font-black uppercase shadow-[4px_4px_0_0_#172923] transition-[transform,box-shadow,background-color] hover:-translate-y-0.5 hover:bg-[#c7dd83] hover:shadow-[5px_6px_0_0_#172923] active:translate-y-0.5 active:shadow-[2px_2px_0_0_#172923] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e75b3d]">
								<span>{isLoading ? 'Connecting...' : 'Connect'}</span><span aria-hidden="true">-&gt;</span>
							</button>
						</form>
					</div>
				</div>

				<footer className="mt-5 flex items-center justify-between font-mono text-[10px] font-bold uppercase text-[#52615a]">
					<span>Connection manager</span><span>Ready / 01</span>
				</footer>
			</section>
		</main>
	)
}