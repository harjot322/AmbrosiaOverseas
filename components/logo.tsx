import Image from "next/image"
import Link from "next/link"

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="relative h-10 w-10 overflow-hidden">
        <Image src="/placeholder-logo.png" alt="Ambrosia Overseas Logo" width={40} height={40} className="object-contain" />
      </div>
      <span className="hidden font-bold text-xl gold-text md:inline-block">Ambrosia Overseas</span>
    </Link>
  )
}

