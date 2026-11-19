import { NextResponse } from "next/server";
import { Pool } from "pg";

export async function POST(request:Request){
    try {
        const body = await request.json();
        const {dbName, dbUser, dbPassword} = body;

        if(!dbName || typeof dbName !== 'string'){
            return NextResponse.json({
                success:false,
                message:'Database name is required'
            }, {status:400})
        }

        const sanitizedDbName = dbName.trim().replace(/[^a-zA-Z0-9_]/g, '')
        const sanitizedUserName = dbUser ? dbUser.trim().replace(/[^a-zA-Z0-9_]/g, '') : null;  

        if(!sanitizedDbName){
            return NextResponse.json({
                success:false,
                message:'Invalid db name.'
            }, {status:400})
        }
        const pool = new Pool({
            connectionString:'postgresql://postgres:postgres@localhost:5432/postgres'
        })

        if(sanitizedUserName){
            const isuserExists = await pool.query(
                `SELECT 1 FROM pg_roles WHERE rolname = $1`,
                [sanitizedUserName]
            )

            if(isuserExists.rowCount === 0){
                if(!dbPassword){
                    await pool.end()
                    return NextResponse.json({
                        success:false,
                        message:'Password is required to create new user.'
                    }, {status:400})
                }
                await pool.query(`CREATE USER "${sanitizedUserName}" WITH PASSWORD '${dbPassword}'`)
            }
        }
        
        let createQuery = `CREATE DATABASE "${sanitizedDbName}"`
        if(sanitizedUserName){
            createQuery += ` OWNER "${sanitizedUserName}"`
        }
        
        await pool.query(createQuery)
        await pool.end()

        return NextResponse.json({
            success:true,
            message:`Database ${sanitizedDbName} created successfuly.`
        }, {status:201})
    } catch (error:any) {
        console.error("CREATE USER ERROR:", error.message);
        return NextResponse.json({
            success:false,
            message:error.message || 'Failed to create database.'
        }, {status:500})
    }
}