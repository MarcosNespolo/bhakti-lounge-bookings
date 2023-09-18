import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import { cookies } from 'next/headers'

export async function POST(request: Request) {
    const supabase = createRouteHandlerClient({ cookies })
    const { code, bookingId } = await request.json()
    console.log( code, bookingId )
    const { count, error } = await supabase
        .from('code')
        .select('*', { count: "exact" })
        .eq('code', code)

    if (error) {
        return NextResponse.json({error}, { status: 500 })
    }

    if (count && count > 0) {
        const result = await supabase
            .from('bookings')
            .update({ active: false })
            .eq('id', bookingId)

        console.log(result)

        return NextResponse.json(result, { status: 200 });
    }

    return NextResponse.json({message: 'Unable to cancel the booking. Please contact the manager.'}, { status: 200 })

}