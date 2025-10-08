"use client"
import { Card } from '@/components/ui/card'
import React, { useEffect, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button'
import { supabase } from '@/api/supabase/client'
import { useParams, useRouter } from "next/navigation"
import { toast } from 'sonner'
import MarkdownPreview from '@/components/MarkdownPreview'


const ChunkPage = () => {
    const [promptTemplate, setPromptTemplate] = useState<any[]>([])
    const [promptContent, setPromptContent] = useState<string>("")
    const [inputValue, setInputValue] = useState<string>("")
    const [fileData, setFileData] = useState<any>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const params = useParams()
    const id = params?.id
    const router = useRouter()

    // Fetch file data
    const getFileData = async () => {
        if (!id) return
        setIsLoading(true)
        try {
            const { data, error } = await supabase
                .from("fileInfo")
                .select("*")
                .eq('id', id)
                .single()

            if (error) throw error
            console.log(data)
            setFileData(data)
            setInputValue(data.chunk_text || "")
        } catch (error: any) {
            console.error("Error fetching file:", error.message)
            toast.error("Failed to fetch file data")
        } finally {
            setIsLoading(false)
        }
    }

    // Update chunked content
    const handleSubmit = async () => {
        if (!id) return
        setIsLoading(true)
        try {
            const { error } = await supabase
                .from("fileInfo")
                .update({ chunk_text: inputValue })
                .eq("id", id)

            if (error) throw error
            toast.success("Chunk updated successfully")
            getFileData()
            // router.push("/file")
        } catch (error: any) {
            console.error("Update error:", error.message)
            toast.error("Failed to update chunk")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getFileData()
    }, [id])

    const getPromptTemplate = async () => {
        try {
            const { data, error } = await supabase
                .from("Template").select("*")

            if (error) {
                console.error("Supabase fetch error:", error.message);
                return;
            }

            if (data) {
                setPromptTemplate(data); // set the fetched row to state
            }

        } catch (error) {
            console.error("Failed to get prompt template:", error);
        }
    }

    useEffect(() => {
        getPromptTemplate();
    }, []);

    return (
        <div className="p-6 space-y-6">
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-2">
                {/* Input box */}
                <Card>
                    <div className="flex justify-between p-3">
                        <h2 className="text-2xl font-bold">Chunk Data</h2>
                        <div className="flex items-center gap-2">
                            <Select
                                value={promptContent}
                                onValueChange={(val) => setPromptContent(val)}
                            >
                                <SelectTrigger className="w-56">
                                    <SelectValue placeholder="Select Prompt" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="default">Select Model</SelectItem>
                                    {promptTemplate.map((template) => (
                                        <SelectItem key={template.id} value={template.name}>
                                            {template.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Button
                                variant="outline"
                                className="flex items-center gap-2 bg-primary hover:bg-primary/80 text-white dark:border-border/50"
                                onClick={() => {
                                    console.log("Applied template:", promptContent)
                                }}
                            >
                                Apply
                            </Button>
                        </div>
                    </div>

                    <div className="p-3">
                        <textarea
                            className="w-full h-96 border border-border/50 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background text-foreground"
                            placeholder="Enter your text here..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />

                        <div className="flex justify-center mt-4">
                            <Button
                                className="bg-primary hover:bg-primary/80 text-white"
                                onClick={handleSubmit}
                                disabled={isLoading}
                            >
                                {isLoading ? "Updating..." : "Submit"}
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Output box */}
                <Card className='overflow-y-auto'>
                    <div className="p-3 h-96 pb-3 ">
                        <MarkdownPreview rawText={fileData?.ai_text} />
                    </div>
                </Card>

            </div>
        </div>
    )
}

export default ChunkPage
