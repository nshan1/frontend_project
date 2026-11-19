import { NextResponse } from "next/server";
import { getSessionPool, unauthorized } from "@/src/lib/db";

const quoteIdent = (name:string) => `"${name.replace(/"/g, '""')}"`

export async function GET(request:Request, { params }: { params: Promise<{ table: string }> }){

    const pool = await getSessionPool()
    if(!pool) return unauthorized()

    const {table} = await params

    try {
        const exists = await pool.query(
            `SELECT 1
            FROM information_schema.tables
            WHERE table_schema = 'public'
            AND table_type = 'BASE TABLE'
            AND table_name = $1`, [table]
        )

        if(exists.rowCount === 0){
            return NextResponse.json({
                success:false,
                error:'Table not found'
            }, {status:404})
        }

        const res = await pool.query(`SELECT * FROM ${quoteIdent(table)} LIMIT 20`)

        return NextResponse.json({
            success:true,
            rows:res.rows,
        }, {status:200})
    } catch (error) {
        return NextResponse.json({
            success:false,
            error:"Failed to fetch table data"
        },{status:400})
    }
}