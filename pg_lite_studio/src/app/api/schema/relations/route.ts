import { NextResponse } from "next/server";
import { getSessionPool, unauthorized } from "@/src/lib/db";

export async function GET(){
    const pool = await getSessionPool();
    if(!pool) return unauthorized()


    try {
        const columns = await pool.query(`
            SELECT table_name, column_name, data_type, is_nullable FROM 
            information_schema.columns
            WHERE table_schema = 'public' 
            ORDER BY table_name, ordinal_position;    
        `)

        const primaryKeys = await pool.query(`
            SELECT tc.table_name, kcu.column_name
            FROM information_schema.table_constraints tc
            JOIN information_schema.key_column_usage kcu 
            ON tc.constraint_name = kcu.constraint_name
            AND tc.table_schema = kcu.table_schema
            WHERE tc.constraint_type = 'PRIMARY KEY' 
            AND tc.table_schema = 'public';
        `)

        const foreignKeys = await pool.query(`
            SELECT 
            tc.table_name AS source_table,
            kcu.column_name AS source_column,
        ccu.table_name AS target_table,
            ccu.column_name AS target_column
            FROM information_schema.table_constraints AS tc
            JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
            AND tc.table_schema = kcu.table_schema
            JOIN information_schema.constraint_column_usage AS ccu
            ON ccu.constraint_name = tc.constraint_name
            AND ccu.table_schema = tc.table_schema
            WHERE tc.constraint_type = 'FOREIGN KEY' 
            AND tc.table_schema = 'public';
        `);

        return NextResponse.json({
            success:true,
            columns:columns.rows,
            foreignKeys:foreignKeys.rows,
            primaryKeys:primaryKeys.rows,
        },{status:200})
    } catch(err){
        return NextResponse.json({
            success:false,
            message:'Failed to fetch schema information'
        },{status:400})

    }
}