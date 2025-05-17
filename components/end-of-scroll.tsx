import { NewReflectionModal } from "@/components/new-reflection-modal"

export function EndOfScroll() {
  return (
    <div className="text-center py-16 space-y-4">
      <p className="text-slate/70 italic">that's everything shared for now.</p>
      <p className="text-slate/70 mb-4">would you like to reflect?</p>

      <div className="inline-block">
        <NewReflectionModal />
      </div>
    </div>
  )
}
