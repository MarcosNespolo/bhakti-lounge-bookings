import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import { cookies } from 'next/headers'
import { getNextMonthDate, getTodayDate } from "@/app/lib/expressions"

export async function GET(request: Request) {
    const supabase = createRouteHandlerClient({ cookies })
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')

    const { count, error } = await supabase
        .from('code')
        .select('*', { count: "exact" })
        .eq('code', code)

    if (error) {
        return NextResponse.json({ error }, { status: 500 })
    }

    if (count && count > 0) {
        const result = await supabase
            .from('bookings')
            .select(' * , car(*)')
            .order('pickup')
            .eq('active', true)
            .gt('pickup', getTodayDate())
            .lt('pickup', getNextMonthDate())

        return NextResponse.json(result, { status: 200 });
    }

    return NextResponse.json({ message: 'Please contact the manager.' }, { status: 200 })

}