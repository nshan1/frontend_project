import { cookies } from "next/headers";
import { getSession, SESSION_COOKIE } from "./session";
import { Pool } from "pg";

export async function getSessionPool(){
    const sessionId = (await cookies()).get(SESSION_COOKIE)?.value

    if(!sessionId) return null;

    const session = getSession(sessionId)
    if(!session) return null

    if(!session.pool){
        session.pool = new Pool({
            ...session.config,
            max:5,
            connectionTimeoutMillis:5000,
            statement_timeout:30000
        })

    }
    return session.pool
}

export function unauthorized(){
    return Response.json({
        success:false,
        error:'Unauthorized',       
    }, {status:401})
}
