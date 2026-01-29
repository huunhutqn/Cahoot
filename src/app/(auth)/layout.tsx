"use client"

import logoBlackwings from "@cahoot/web/assets/blackwings_2.png"
import logo from "@cahoot/web/assets/logo.svg"
import logoVibecoding from "@cahoot/web/assets/vibecoding_3.png"
import Loader from "@cahoot/web/components/Loader"
import { useSocket } from "@cahoot/web/contexts/socketProvider"
import Image from "next/image"
import { PropsWithChildren, useEffect } from "react"

const AuthLayout = ({ children }: PropsWithChildren) => {
  const { isConnected, connect } = useSocket()
  useEffect(() => {
    if (!isConnected) {
      connect()
    }
  }, [connect, isConnected])

  const SponsorLogos = () => (
    <div className="pointer-events-none absolute top-2 right-0 left-0 z-50 flex items-center justify-center gap-2 md:gap-4">
      <Image
        src={logoVibecoding}
        alt="Vibecoding"
        height={80}
        width={200}
        className="h-[50px] w-auto object-contain md:h-[80px]"
      />
      <Image
        src={logoBlackwings}
        alt="Blackwings"
        height={80}
        width={200}
        className="h-[50px] w-auto object-contain md:h-[80px]"
      />
    </div>
  )

  if (!isConnected) {
    return (
      <section className="relative flex min-h-screen flex-col items-center justify-center">
        <SponsorLogos />
        <div className="absolute h-full w-full overflow-hidden">
          <div className="bg-primary/15 absolute -top-[15vmin] -left-[15vmin] min-h-[75vmin] min-w-[75vmin] rounded-full"></div>
          <div className="bg-primary/15 absolute -right-[15vmin] -bottom-[15vmin] min-h-[75vmin] min-w-[75vmin] rotate-45"></div>
        </div>

        <Image src={logo} className="mb-6 h-32" alt="logo" />
        <Loader className="h-23" />
        <h2 className="mt-2 text-center text-2xl font-bold text-white drop-shadow-lg md:text-3xl">
          Loading...
        </h2>
      </section>
    )
  }

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center">
      <SponsorLogos />
      <div className="absolute h-full w-full overflow-hidden">
        <div className="bg-primary/15 absolute -top-[15vmin] -left-[15vmin] min-h-[75vmin] min-w-[75vmin] rounded-full"></div>
        <div className="bg-primary/15 absolute -right-[15vmin] -bottom-[15vmin] min-h-[75vmin] min-w-[75vmin] rotate-45"></div>
      </div>

      <Image src={logo} className="mb-6 h-32" alt="logo" />
      {children}
    </section>
  )
}

export default AuthLayout
