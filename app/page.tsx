import SelectVehicle from '@/components/SelectVehicle'

export const dynamic = 'force-dynamic'

export default async function Index() {  
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-24 bg-[#ecf4f4]">
      <SelectVehicle />
    </main>
  )
}
