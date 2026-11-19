import { Pool } from "pg"
import { ConnectionConfig } from "../types/connection"
import { randomUUID } from "node:crypto"

export const SESSION_COOKIE = 'SessionId'
export const COOKIE_OPTIONS = {
    httpOnly:true,
    sameSite:'strict' as const,
    path:'/',
    maxAge:60*60*24
}

type Session = {
    config:ConnectionConfig,
    pool?:Pool
}

const sessions = new Map<string, Session>()

export function createSession(config:ConnectionConfig):string{
    const id = randomUUID()
    sessions.set(id,{config})
    return id
}

export function getSession(id:string): Session | undefined {
    return sessions.get(id)
}

export function deleteSession(id:string){
    sessions.get(id)?.pool?.end()
    sessions.delete(id)
}