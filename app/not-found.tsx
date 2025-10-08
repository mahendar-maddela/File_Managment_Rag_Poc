"use client"
import { AlertCircle } from 'lucide-react'
import React from 'react'

const NotFound = ({data}:any) => {
  return (
    <div>
          <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center">
                    <AlertCircle className="w-8 h-8 text-destructive mb-2" />
                    <p>{data} not found</p>
                </div>
            </div>
    </div>
  )
}

export default NotFound
