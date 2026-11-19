import {Pool} from 'pg'
import {NextResponse} from 'next/server'
import {cookies} from 'next/headers'
import { COOKIE_OPTIONS, createSession, SESSION_COOKIE } from '@/src/lib/session'

export async function POST(request:Request) {
    let testPool:Pool | null = null

    try{
        const body = await request.json()
        const {host, port, database, user, password} = body

        if(!host || !port || !database || !user || !password){
            return NextResponse.json({
                success:false,
                error:'All fileds are required'
            },{status:400})
        }
        const portNumber = +port;
        if(!Number.isInteger(portNumber) || portNumber < 1 || portNumber > 65535){
            return NextResponse.json({
                success:false,
                error:'Invalid port'
            },{status:400})
        }


        const config ={
            host,
            port:portNumber,
            database,
            user,
            password
        }
        testPool = new Pool({...config, max:1, connectionTimeoutMillis:5000})

        await testPool.query('SELECT NOW()')


        const sessionId = createSession(config)
        const cookieStore = await cookies()

        cookieStore.set(SESSION_COOKIE, sessionId, COOKIE_OPTIONS)
        
        return NextResponse.json({
            success:true,
            message:'Successfuly connected'
        },{status:200})

    } catch(err:any) {
        return NextResponse.json({
            success:false,
            error: 'Failed to connect.'
        }, {status:400})
    }finally{
        await testPool?.end()
    }

}