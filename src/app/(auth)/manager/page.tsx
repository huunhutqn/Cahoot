"use client"

import { QuizzWithId } from "@/common/types/game"
import { STATUS } from "@/common/types/game/status"
import ManagerPassword from "@cahoot/web/components/game/create/ManagerPassword"
import SelectQuizz from "@cahoot/web/components/game/create/SelectQuizz"
import { useEvent, useSocket } from "@cahoot/web/contexts/socketProvider"
import { useManagerStore } from "@cahoot/web/stores/manager"
import { useRouter } from "next/navigation"
import { useState } from "react"

const Manager = () => {
  const { setGameId, setStatus } = useManagerStore()
  const router = useRouter()
  const { socket } = useSocket()

  const [isAuth, setIsAuth] = useState(false)
  const [quizzList, setQuizzList] = useState<QuizzWithId[]>([])

  useEvent("manager:quizzList", (quizzList) => {
    setIsAuth(true)
    setQuizzList(quizzList)
  })

  useEvent("manager:gameCreated", ({ gameId, inviteCode }) => {
    setGameId(gameId)
    setStatus(STATUS.SHOW_ROOM, { text: "Đang đợi anh em vô chơi", inviteCode })
    router.push(`/game/manager/${gameId}`)
  })

  const handleAuth = (password: string) => {
    socket?.emit("manager:auth", password)
  }
  const handleCreate = (quizzId: string) => {
    socket?.emit("game:create", quizzId)
  }

  if (!isAuth) {
    return <ManagerPassword onSubmit={handleAuth} />
  }

  return <SelectQuizz quizzList={quizzList} onSelect={handleCreate} />
}

export default Manager
