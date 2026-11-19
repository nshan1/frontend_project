import { NextResponse } from "next/server";
import {cookies} from 'next/headers'
import { Pool } from "pg";
import { getSessionPool, unauthorized } from "@/src/lib/db";

export async function GET(){
    const pool = await getSessionPool()
    if(!pool) return unauthorized();


    try {
        const res = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables
            WHERE table_schema = 'public' 
            AND table_type = 'BASE TABLE'
            AND table_name NOT LIKE 'pg_%'
            AND table_name NOT LIKE 'sql_%';   
        `)

        return NextResponse.json({
            success:true,
            tables:res.rows,
        }, {status:200})
    } catch (error) {
        return NextResponse.json({
            success:false,
            error:"Failed to fetch tables"
        },{status:400})
    }
}