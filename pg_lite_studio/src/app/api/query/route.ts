import { NextResponse } from "next/server";
import { getSessionPool, unauthorized } from "@/src/lib/db";

export async function POST(request:Request) {
    const pool = await getSessionPool()
    if(!pool){
        return unauthorized
    }

    try{
        const body = await request.json()
        const {query} = body

        
        const result = await pool.query(query)


        return NextResponse.json({
            success:true,
            rows:result.rows,
            rowCount:result.rowCount,
            command:result.command
        }, {status:200})
    } catch(err:any){
        return NextResponse.json({
            success:false,
            error:err.message
        },{status:400})
    }
}