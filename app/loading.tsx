"use client"

import { Clock } from 'lucide-react'
import React from 'react'

const LoaderComponent = () => {
  return (
    <div>
             <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center">
                    <Clock className="w-15 h-15 text-primary animate-spin mb-2" />
                    <p >Loading  data...</p>
                </div>
            </div>
    </div>
  )
}

export default LoaderComponent
