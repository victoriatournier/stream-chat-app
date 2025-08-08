"use client"

import { useState, useEffect } from "react"
import LiveStreamChat from "@/components/live-stream-chat"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { normalMessages, angryMessages, happyMessages } from "@/constants/messages"
import { usernames } from "@/constants/usernames"

interface ManualMessage {
  username: string
  message: string
}

export default function ChatConControles() {
  const [frequency, setFrequency] = useState(1000)
  const [heartFrequency, setHeartFrequency] = useState(0) 
  const [activeMessages, setActiveMessages] = useState(() => normalMessages)

  const [hearts, setHearts] = useState<number[]>([])
  const [manualMessages, setManualMessages] = useState<ManualMessage[]>([])
  const [messageInput, setMessageInput] = useState("")
  const [manualUsername, setManualUsername] = useState("")

  const throwHeart = () => {
    setHearts((prev) => [...prev, Date.now()])
  }

  const sendManualMessage = () => {
    if (messageInput.trim() === "") return

    const usernameToUse = manualUsername.trim() || usernames[Math.floor(Math.random() * usernames.length)]

    setManualMessages((prev) => [
      ...prev,
      { username: usernameToUse, message: messageInput.trim() }
    ])
    setMessageInput("")
    setManualUsername("")
  }

  useEffect(() => {
    if (heartFrequency <= 0) return 

    let timeoutId: NodeJS.Timeout

    const scheduleHeart = () => {
      const burst = Math.random() < 0.3
      const variationFactor = burst
        ? Math.random() * 0.5 + 0.1
        : Math.random() * 2 + 1

      const randomDelay = Math.floor(heartFrequency * variationFactor)

      timeoutId = setTimeout(() => {
        throwHeart()
        scheduleHeart()
      }, Math.max(100, randomDelay))
    }

    scheduleHeart()

    return () => clearTimeout(timeoutId)
  }, [heartFrequency])

  return (
    <div className="relative">
      <div className="flex flex-row items-start gap-6 p-4">
        <div className="w-100 p-4 bg-gray-800 border border-gray-700 rounded-lg flex flex-col gap-6">

          {/* Controles habituales arriba */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">
              Frecuencia de mensajes
            </label>
            <Slider
              value={[frequency]}
              onValueChange={(value) => setFrequency(value[0])}
              min={100} max={3000} step={100}
            />
            <div className="text-xs text-gray-400 text-center mt-1">
              {frequency / 1000} s
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">
              Frecuencia de corazones (0 = off)
            </label>
            <Slider
              value={[heartFrequency]}
              onValueChange={(value) => setHeartFrequency(value[0])}
              min={0} max={5000} step={200}
            />
            <div className="text-xs text-gray-400 text-center mt-1">
              {heartFrequency === 0 ? "Desactivado" : `${heartFrequency / 1000} s`}
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-2 block">
              Tipo de Mensajes
            </label>
            <div className="flex flex-col gap-2">
              <Button
                onClick={() => setActiveMessages(normalMessages)}
                variant={activeMessages === normalMessages ? "default" : "secondary"}
              >
                Normales 🙂
              </Button>
              <Button
                onClick={() => setActiveMessages(happyMessages)}
                variant={activeMessages === happyMessages ? "default" : "secondary"}
              >
                Felices 🎉
              </Button>
              <Button
                onClick={() => setActiveMessages(angryMessages)}
                variant={activeMessages === angryMessages ? "default" : "secondary"}
              >
                QUE LO MATEN 😠
              </Button>
            </div>
          </div>

          {/* Sección mandar mensaje (menos espacio) */}
          <div className="pt-2 border-t border-gray-700 flex flex-col gap-2">
            <label className="text-xs text-gray-400 mb-1 block">
              Mandar mensaje manual
            </label>
            <Input
              value={manualUsername}
              onChange={(e) => setManualUsername(e.target.value)}
              placeholder="Nombre de usuario (opcional)"
              className="mb-2"
            />

            <Input
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Escribí algo..."
              className="mb-2"
            />

            <Button onClick={sendManualMessage} className="w-full bg-gray-600 hover:bg-gray-700">
              Mandar mensaje
            </Button>
          </div>

          {/* Botón manual de corazones abajo, separado */}
          <div className="pt-4">
            <Button onClick={throwHeart} className="w-full bg-pink-600 hover:bg-pink-700">
              ❤️ Mandar corazón
            </Button>
          </div>
        </div>

        {/* Chat */}
        <div>
          <LiveStreamChat
            frequency={frequency}
            messageSet={activeMessages}
            hearts={hearts}
            manualMessages={manualMessages} 
            onHeartClick={throwHeart}
          />
        </div>
      </div>
    </div>
  )
}
