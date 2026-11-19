import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { deleteSession, SESSION_COOKIE } from "@/src/lib/session";

export async function POST(){
    const cookieStore = await cookies()
    const sessionId = cookieStore.get(SESSION_COOKIE)?.value

    if(sessionId){
        deleteSession(sessionId)
    }
    cookieStore.delete(SESSION_COOKIE)

    return NextResponse.json({success:true}, {status:200})
}