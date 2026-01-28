import Button from "@cahoot/web/components/Button"
import Form from "@cahoot/web/components/Form"
import Input from "@cahoot/web/components/Input"
import { useEvent, useSocket } from "@cahoot/web/contexts/socketProvider"
import { usePlayerStore } from "@cahoot/web/stores/player"
import { KeyboardEvent, useState } from "react"

const Room = () => {
  const { socket } = useSocket()
  const { join } = usePlayerStore()
  const [invitation, setInvitation] = useState("")

  const handleJoin = () => {
    socket?.emit("player:join", invitation)
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      handleJoin()
    }
  }

  useEvent("game:successRoom", (gameId) => {
    join(gameId)
  })

  return (
    <Form>
      <Input
        onChange={(e) => setInvitation(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="PIN Code here"
      />
      <Button onClick={handleJoin}>Submit</Button>
    </Form>
  )
}

export default Room
