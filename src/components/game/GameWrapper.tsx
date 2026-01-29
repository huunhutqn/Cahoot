"use client"

import { Status } from "@/common/types/game/status"
import background from "@cahoot/web/assets/background.webp"
import logoBlackwings from "@cahoot/web/assets/blackwings_2.png"
import logoVibecoding from "@cahoot/web/assets/vibecoding_3.png"
import Button from "@cahoot/web/components/Button"
import Loader from "@cahoot/web/components/Loader"
import { useEvent, useSocket } from "@cahoot/web/contexts/socketProvider"
import { usePlayerStore } from "@cahoot/web/stores/player"
import { useQuestionStore } from "@cahoot/web/stores/question"
import { getAvatarUrl } from "@cahoot/web/utils/avatar"
import { MANAGER_SKIP_BTN } from "@cahoot/web/utils/constants"
import clsx from "clsx"
import Image from "next/image"
import { PropsWithChildren, useEffect, useState } from "react"

type Props = PropsWithChildren & {
  statusName: Status | undefined
  onNext?: () => void
  manager?: boolean
}

const GameWrapper = ({ children, statusName, onNext, manager }: Props) => {
  const { isConnected } = useSocket()
  const { player } = usePlayerStore()
  const { questionStates, setQuestionStates } = useQuestionStore()
  const [isDisabled, setIsDisabled] = useState(false)
  const next = statusName ? MANAGER_SKIP_BTN[statusName] : null

  useEvent("game:updateQuestion", ({ current, total }) => {
    setQuestionStates({
      current,
      total,
    })
  })

  useEffect(() => {
    setIsDisabled(false)
  }, [statusName])

  const handleNext = () => {
    setIsDisabled(true)
    onNext?.()
  }

  return (
    <section className="relative flex min-h-screen w-full flex-col justify-between">
      <div className="fixed top-0 left-0 -z-10 h-full w-full bg-orange-600 opacity-70">
        <Image
          className="pointer-events-none h-full w-full object-cover opacity-60"
          src={background}
          alt="background"
        />
      </div>

      {/* Sponsor Logos */}
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

      {!isConnected && !statusName ? (
        <div className="flex h-full w-full flex-1 flex-col items-center justify-center">
          <Loader />
          <h1 className="text-4xl font-bold text-white">Connecting...</h1>
        </div>
      ) : (
        <>
          <div className="flex w-full justify-between p-4">
            {questionStates && (
              <div className="shadow-inset flex items-center rounded-md bg-white p-2 px-4 text-lg font-bold text-black">
                {`${questionStates.current} / ${questionStates.total}`}
              </div>
            )}

            {manager && next && (
              <Button
                className={clsx("self-end bg-white px-4 text-black!", {
                  "pointer-events-none": isDisabled,
                })}
                onClick={handleNext}
              >
                {next}
              </Button>
            )}
          </div>

          {children}

          {!manager && (
            <div className="z-50 flex items-center justify-between bg-white px-4 py-2 text-lg font-bold text-white">
              <div className="flex items-center gap-2">
                {player?.avatar && (
                  <Image
                    src={getAvatarUrl(player.avatar)}
                    alt="avatar"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                )}
                <p className="text-gray-800">{player?.username}</p>
              </div>
              <div className="rounded-sm bg-gray-800 px-3 py-1 text-lg">
                {player?.points}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  )
}

export default GameWrapper
