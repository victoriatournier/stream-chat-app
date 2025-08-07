"use client"

import { useState, useEffect, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MoreVertical, X, Users, Heart, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usernames } from "@/constants/usernames"

interface LiveStreamChatProps {
  frequency: number
  messageSet: string[]
  hearts: number[]
  onHeartClick?: () => void
  manualMessages?: string[] 
}

interface ChatMessage {
  id: string
  username: string
  message: string
  avatar: string
  timestamp: Date
  isModerator?: boolean
  isSubscriber?: boolean
  isMember?: boolean
  usernameColor?: string
}

const colors = [
  "#ff6b35", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57", "#a55eea",
  "#fd79a8", "#00b894", "#e17055", "#74b9ff",
]

function FloatingHeart() {
  const [visible, setVisible] = useState(true)
  const animationDuration = 1000

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), animationDuration)
    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <div
      className="absolute text-red-500 text-2xl animate-float-up pointer-events-none"
      style={{
        left: "50%",
        bottom: "3.5rem",
        transform: "translateX(-50%)",
        animationDuration: `${animationDuration}ms`,
        willChange: "transform, opacity",
      }}
    >
      ❤️
    </div>
  )
}

export default function LiveStreamChat({
  frequency,
  messageSet,
  hearts,
  onHeartClick,
  manualMessages = [], 
}: LiveStreamChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const messageQueue = useRef<string[]>([...messageSet])
  const prevManualLength = useRef(0) 

  useEffect(() => {
    let timeout: NodeJS.Timeout

    const pushMessage = () => {
      if (messageQueue.current.length === 0) {
        messageQueue.current = [...messageSet]
      }

      const randomIndex = Math.floor(Math.random() * messageQueue.current.length)
      const randomMessage = messageQueue.current.splice(randomIndex, 1)[0]

      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        username: usernames[Math.floor(Math.random() * usernames.length)],
        message: randomMessage,
        avatar: `https://i.pravatar.cc/32?u=${Date.now()}`,
        timestamp: new Date(),
        usernameColor: colors[Math.floor(Math.random() * colors.length)],
        isSubscriber: Math.random() > 0.8,
        isMember: Math.random() > 0.9,
        isModerator: Math.random() > 0.95,
      }

      setMessages((prev) => [...prev.slice(-50), newMessage])

      const variationFactor = Math.random() * 1.7 + 0.3
      const randomInterval = Math.floor(frequency * variationFactor)

      timeout = setTimeout(pushMessage, randomInterval)
    }

    timeout = setTimeout(pushMessage, frequency)

    return () => clearTimeout(timeout)
  }, [frequency, messageSet])

  useEffect(() => {
    if (manualMessages.length > prevManualLength.current) {
      const newMessages = manualMessages.slice(prevManualLength.current)
      prevManualLength.current = manualMessages.length

      const newChatMessages: ChatMessage[] = newMessages.map((text) => ({
        id: Date.now().toString() + Math.random(),
        username: usernames[Math.floor(Math.random() * usernames.length)],
        message: text,
        avatar: `https://i.pravatar.cc/32?u=${Date.now() + Math.random()}`,
        timestamp: new Date(),
        usernameColor: colors[Math.floor(Math.random() * colors.length)],
        isSubscriber: Math.random() > 0.8,
        isMember: Math.random() > 0.9,
        isModerator: Math.random() > 0.95,
      }))

      setMessages((prev) => [...prev.slice(-50), ...newChatMessages])
    }
  }, [manualMessages])

  const handleHeartClick = () => {
    if (onHeartClick) onHeartClick()
  }

  return (
    <div className="w-[480px] h-[600px] bg-gray-900 text-white flex flex-col rounded-lg overflow-hidden border border-gray-700">
      <div className="flex items-center justify-between p-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <span className="font-medium text-xs">Chat en vivo</span>
          <ChevronDown className="w-3 h-3 text-gray-400" />
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="p-1 h-auto">
            <MoreVertical className="w-3 h-3 text-gray-400" />
          </Button>
          <Button variant="ghost" size="sm" className="p-1 h-auto">
            <X className="w-3 h-3 text-gray-400" />
          </Button>
        </div>
      </div>

      <div className="flex-1 p-1 flex flex-col justify-end overflow-hidden">
        <div className="space-y-1">
          {messages.slice(-20).map((message) => (
            <div
              key={message.id}
              className="flex items-start gap-1 group hover:bg-gray-800/30 p-0.5 rounded"
            >
              <Avatar className="w-5 h-5 flex-shrink-0">
                <AvatarImage src={message.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-[10px] bg-gray-600">
                  {message.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-0.5 flex-wrap">
                  <span
                    className="font-semibold text-xs truncate"
                    style={{ color: message.usernameColor }}
                  >
                    {message.username}
                  </span>
                  {message.isModerator && (
                    <Badge className="bg-green-600 text-white text-[10px] px-1 py-0 h-4">
                      MOD
                    </Badge>
                  )}
                  {message.isMember && (
                    <Badge className="bg-purple-600 text-white text-[10px] px-1 py-0 h-4">
                      #3
                    </Badge>
                  )}
                  {message.isSubscriber && (
                    <Badge className="bg-blue-600 text-white text-[10px] px-1 py-0 h-4">
                      SUB
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gray-100 break-words leading-tight mt-0.5">
                  {message.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between p-2 bg-gray-800 border-t border-gray-700">
        <div className="flex items-center gap-1 text-[10px] text-gray-400">
          <Users className="w-3 h-3" />
          <span>Modo Solo suscriptores</span>
        </div>
        <div className="relative flex items-center gap-1">
          {hearts.map((id) => (
            <FloatingHeart key={id} />
          ))}
          <Button variant="ghost" size="sm" className="p-1 h-auto">
            <span className="text-[10px] bg-gray-700 px-1 py-0.5 rounded">$</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="p-1 h-auto relative"
            onClick={handleHeartClick}
          >
            <Heart className="w-3 h-3 text-gray-400" />
          </Button>
        </div>
      </div>
    </div>
  )
}
