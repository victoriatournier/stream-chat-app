"use client"

import { useState } from "react"
import LiveStreamChat from "@/components/live-stream-chat"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { normalMessages, angryMessages, happyMessages } from "@/constants/messages"



export default function ChatConControles() {
  const [frequency, setFrequency] = useState(1000)
  const [activeMessages, setActiveMessages] = useState(() => normalMessages)

  return (
    <div className="flex flex-row items-start gap-6 p-4">
      <div className="w-56 p-4 bg-gray-800 border border-gray-700 rounded-lg flex flex-col gap-6">
        <h3 className="font-semibold text-white text-center">Controles</h3>
        
        <div>
          <label className="text-xs text-gray-400 mb-2 block">
            Frecuencia de mensajes
          </label>
          <Slider
            value={[frequency]}
            onValueChange={(value) => setFrequency(value[0])}
            min={200} max={3000} step={100}
          />
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
      </div>

      <div>
        <LiveStreamChat frequency={frequency} messageSet={activeMessages} />
      </div>
    </div>
  )
}