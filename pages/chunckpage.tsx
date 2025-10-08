"use client"
import { Card } from '@/components/ui/card'
import React, { useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button'

const Chunckpage = () => {
    const [promptTemplate, setPromptTemplate] = useState<any>();
    const [promptContent, setPromptContent] = useState<string>("");


    return (
        <div className="p-6 space-y-6">

            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-2">
                {/* input box */}
                <Card>
                    <div className="flex justify-between p-3">
                        <div>
                            <h2 className="text-2xl font-bold ">Chunk data</h2>
                        </div>
                        <div className="flex items-center gap-2">
                            <Select value={promptContent} onValueChange={(val) => setPromptContent(val)}>
                                <SelectTrigger className="w-56">
                                    <SelectValue placeholder="Select Prompt" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="default">Select Model</SelectItem>
                                    {promptTemplate?.map((template: any) => (
                                        <SelectItem key={template.id} value={template.name}>
                                            {template.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Apply button */}
                            <Button
                                variant="outline"
                                className="flex items-center gap-2 bg-primary hover:bg-primary/80 text-white dark:border-border/50"
                                onClick={() => {
                                    //   if (promptContent) {
                                    //     // 👇 do your apply logic here
                                    //     console.log("Applied:", promptContent);
                                    //   }
                                }}
                            >
                                Apply
                            </Button>
                        </div>
                    </div>
                    <div className='p-3'>
                        {/* Input TextArea */}
                        <textarea
                            className="w-full h-96  border border-border/50 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background text-foreground"
                            placeholder="Enter your text here..."
                            value={promptContent}
                            onChange={(e) => setPromptContent(e.target.value)}
                        />
                        {/* submit button */}
                        <div className="flex justify-center mt-4">
                            <Button
                                className="bg-primary hover:bg-primary/80 text-white"
                                onClick={() => {
                                    // Handle submit action here
                                    console.log("Submitted content:", promptContent);
                                }}
                            >
                                Submit
                            </Button>
                        </div>
                    </div>
                </Card>
                {/* output box */}
                <Card>

                </Card>
            </div>
        </div>
    )
}

export default Chunckpage