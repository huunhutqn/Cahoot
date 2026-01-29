"use client"

import { STATUS } from "@/common/types/game/status"
import Button from "@cahoot/web/components/Button"
import Form from "@cahoot/web/components/Form"
import Input from "@cahoot/web/components/Input"
import { useEvent, useSocket } from "@cahoot/web/contexts/socketProvider"
import { usePlayerStore } from "@cahoot/web/stores/player"

import { useRouter } from "next/navigation"
import { KeyboardEvent, useState } from "react"

const Username = () => {
  const { socket } = useSocket()
  const { gameId, login, setStatus } = usePlayerStore()
  const router = useRouter()
  const [username, setUsername] = useState("")

  const handleLogin = () => {
    if (!gameId) {
      return
    }

    socket?.emit("player:login", { gameId, data: { username } })
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      handleLogin()
    }
  }

  useEvent("game:successJoin", (gameId) => {
    setStatus(STATUS.WAIT, { text: "Đang đợi anh em vô chơi" })
    login(username)

    router.replace(`/game/${gameId}`)
  })

  return (
    <Form>
      <Input
        onChange={(e) => setUsername(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Username here"
      />
      <Button onClick={handleLogin}>Submit</Button>
    </Form>
  )
}

export default Username
