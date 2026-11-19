import {type NextRequest,  NextResponse } from "next/server";

export function proxy(request:NextRequest){
    if(!request.cookies.has('SessionId')){
        return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
}

export const config = {
    matcher:['/dashboard/:path*']
}