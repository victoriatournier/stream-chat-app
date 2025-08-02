"use client"

import ChatConControles from "@/components/chat-con-controles"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 p-8 flex items-center justify-center">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-white text-center mb-8">Live Stream Chat Component</h1>
        <ChatConControles />

      </div>
    </div>
  )
}
