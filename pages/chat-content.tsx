"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Send, User, Bot, Clock, Paperclip, Smile, ThumbsUp, ThumbsDown } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Message {
    id: string
    content: string
    role: "user" | "assistant"
    timestamp: Date
    status: "sending" | "sent" | "error"
}

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            content: "Hello! How can I help you with your documents today?",
            role: "assistant",
            timestamp: new Date(Date.now() - 3600000),
            status: "sent"
        },
        {
            id: "2",
            content: "I need help with my PDF file. Can you assist?",
            role: "user",
            timestamp: new Date(Date.now() - 1800000),
            status: "sent"
        },
        {
            id: "3",
            content: "Of course! I can help you read your PDF.",
            role: "assistant",
            timestamp: new Date(Date.now() - 1200000),
            status: "sent"
        }
    ])
    const [input, setInput] = useState("")
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const [isTyping, setIsTyping] = useState(false)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSend = () => {
        if (input.trim() === "") return

        const newMessage: Message = {
            id: Date.now().toString(),
            content: input.trim(),
            role: "user",
            timestamp: new Date(),
            status: "sending"
        }

        setMessages([...messages, newMessage])
        setInput("")

        // Simulate sending
        setTimeout(() => {
            setMessages(prev =>
                prev.map(msg =>
                    msg.id === newMessage.id ? { ...msg, status: "sent" } : msg
                )
            )

            // Simulate bot response
            setIsTyping(true)
            setTimeout(() => {
                const botResponse: Message = {
                    id: Date.now().toString(),
                    content: "I've processed your request. Your document has been successfully read, and here is the answer. Thank you.",
                    role: "assistant",
                    timestamp: new Date(),
                    status: "sent"
                }
                setMessages(prev => [...prev, botResponse])
                setIsTyping(false)
            }, 2000)
        }, 500)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    return (
        <div className="min-h-screen flex flex-col p-6 bg-muted/20">
            {/* Header */}
            <div className="mb-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Document Assistant</h1>
                        <p className="text-muted-foreground mt-1">
                            Get help with your documents and files
                        </p>
                    </div>
                    <Badge variant="secondary" className="flex items-center gap-1 text-sm py-1 px-3">
                        <Bot className="w-3 h-3" />
                        AI Assistant
                    </Badge>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="grid grid-cols-1 gap-6 flex-1">
                <Card className="h-full flex flex-col">
                    {/* <CardHeader className="pb-3 border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              Document Support Chat
            </CardTitle>
            <CardDescription>
              Ask questions about your files and get assistance
            </CardDescription>
          </CardHeader> */}
                    <CardContent className="flex-1 p-4 flex flex-col">
                        {/* Messages Container */}
                        <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`flex max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                                    >
                                        <Avatar className={`h-8 w-8 ${message.role === "user" ? "ml-3" : "mr-3"}`}>
                                            <AvatarFallback className={message.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary"}>
                                                {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <div
                                                className={`rounded-lg px-4 py-2 ${message.role === "user"
                                                    ? "bg-primary text-primary-foreground rounded-tr-none"
                                                    : "bg-muted text-foreground rounded-tl-none"
                                                    }`}
                                            >
                                                <p className="text-sm">{message.content}</p>
                                            </div>
                                            <div className={`flex items-center mt-1 text-xs text-muted-foreground ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                                                {message.status === "sending" ? (
                                                    <Clock className="h-3 w-3 mr-1 animate-spin" />
                                                ) : null}
                                                <span>{formatTime(message.timestamp)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="flex max-w-[80%] flex-row">
                                        <Avatar className="h-8 w-8 mr-3">
                                            <AvatarFallback className="bg-secondary">
                                                <Bot className="h-4 w-4" />
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="bg-muted text-foreground rounded-lg px-4 py-2 rounded-tl-none">
                                            <div className="flex space-x-1">
                                                <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                                <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                                                <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="border rounded-lg bg-background p-2">
                            <Textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Type your message here..."
                                className="min-h-[60px] resize-none border-0 focus-visible:ring-0 shadow-none"
                            />
                            <div className="flex justify-between items-center mt-1">
                                <div className="flex space-x-1">
                                    {/* <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <Paperclip className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <Smile className="h-4 w-4" />
                                    </Button> */}
                                </div>
                                <Button
                                    onClick={handleSend}
                                    disabled={input.trim() === ""}
                                    className="px-4"
                                >
                                    <Send className="h-4 w-4 mr-2" />
                                    Send
                                </Button>
                            </div>
                        </div>

                        {/* Feedback Section */}
                        {/* <div className="flex justify-center mt-4 space-x-2">
              <p className="text-xs text-muted-foreground">Was this helpful?</p>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <ThumbsUp className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <ThumbsDown className="h-3 w-3" />
              </Button>
            </div> */}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}