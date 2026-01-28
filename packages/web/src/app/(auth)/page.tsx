"use client"

import Room from "@cahoot/web/components/game/join/Room"
import Username from "@cahoot/web/components/game/join/Username"
import { useEvent, useSocket } from "@cahoot/web/contexts/socketProvider"
import { usePlayerStore } from "@cahoot/web/stores/player"
import { useEffect } from "react"
import toast from "react-hot-toast"

const Home = () => {
  const { isConnected, connect } = useSocket()
  const { player } = usePlayerStore()

  useEffect(() => {
    if (!isConnected) {
      connect()
    }
  }, [connect, isConnected])

  useEvent("game:errorMessage", (message) => {
    toast.error(message)
  })

  if (player) {
    return <Username />
  }

  return <Room />
}

export default Home
