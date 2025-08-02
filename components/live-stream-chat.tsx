"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MoreVertical, X, Users, Heart, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usernames } from "@/constants/usernames"

interface LiveStreamChatProps {
  frequency: number;
  messageSet: string[];
}

interface ChatMessage {
  id: string; username: string; message: string; avatar: string;
  timestamp: Date; isModerator?: boolean; isSubscriber?: boolean;
  isMember?: boolean; usernameColor?: string;
}

const colors = [
  "#ff6b35", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57", "#a55eea",
  "#fd79a8", "#00b894", "#e17055", "#74b9ff",
]

export default function LiveStreamChat({ frequency, messageSet }: LiveStreamChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])

  useEffect(() => {
    let timeout: NodeJS.Timeout

    const pushMessage = () => {
      const randomMessage = messageSet[Math.floor(Math.random() * messageSet.length)]

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

      const randomInterval = frequency + Math.floor(Math.random() * (frequency * 0.5))
      timeout = setTimeout(pushMessage, randomInterval)
    }

    timeout = setTimeout(pushMessage, frequency)

    return () => clearTimeout(timeout)
  }, [frequency, messageSet])

  return (
    <div className="w-[480px] h-[600px] bg-gray-900 text-white flex flex-col rounded-lg overflow-hidden border border-gray-700">
      <div className="flex items-center justify-between p-3 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">Chat en vivo</span>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="p-1 h-auto"><MoreVertical className="w-4 h-4 text-gray-400" /></Button>
          <Button variant="ghost" size="sm" className="p-1 h-auto"><X className="w-4 h-4 text-gray-400" /></Button>
        </div>
      </div>
      <div className="flex-1 p-2 flex flex-col justify-end overflow-hidden">
        <div className="space-y-2">
          {messages.slice(-12).map((message) => (
            <div key={message.id} className="flex items-start gap-2 group hover:bg-gray-800/30 p-1 rounded">
              <Avatar className="w-6 h-6 flex-shrink-0">
                <AvatarImage src={message.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-xs bg-gray-600">{message.username.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="font-semibold text-sm truncate" style={{ color: message.usernameColor }}>{message.username}</span>
                  {message.isModerator && (<Badge className="bg-green-600 text-white text-xs px-1 py-0 h-4">MOD</Badge>)}
                  {message.isMember && (<Badge className="bg-purple-600 text-white text-xs px-1 py-0 h-4">#3</Badge>)}
                  {message.isSubscriber && (<Badge className="bg-blue-600 text-white text-xs px-1 py-0 h-4">SUB</Badge>)}
                </div>
                <p className="text-sm text-gray-100 break-words leading-tight mt-0.5">{message.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between p-3 bg-gray-800 border-t border-gray-700">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Users className="w-4 h-4" />
          <span>Modo Solo suscriptores</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="p-1 h-auto"><span className="text-xs bg-gray-700 px-2 py-1 rounded">$</span></Button>
          <Button variant="ghost" size="sm" className="p-1 h-auto"><Heart className="w-4 h-4 text-gray-400" /></Button>
        </div>
      </div>
    </div>
  )
}
