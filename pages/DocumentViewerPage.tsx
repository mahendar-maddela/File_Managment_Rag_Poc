'use client'

import { supabase } from '@/api/supabase/client'
import { useEffect, useState } from 'react'
import { ChevronDown, ChevronRight, FileText, Folder, FolderOpen, ExternalLink } from 'lucide-react'

interface Section {
    id: number
    document_id: number
    parent_id: number | null
    order_number: string
    level: number | null
    title: string
    content: string
    img_url: string
}

export default function DocumentViewerPage() {
    const [sections, setSections] = useState<Section[]>([])
    const [loading, setLoading] = useState(true)
    const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set())

    const getAllSectionData = async () => {
        try {
            let { data: Section, error } = await supabase
                .from('Section')
                .select('*').eq("document_id", 1)

            if (error) {
                console.log("Supabase fetch error:", error.message)
                return
            }

            if (Section) {
                console.log("Raw sections data:", Section)
                // Fix sections with null level by inferring from order_number
                const fixedSections = Section.map(section => {
                    if (section.level === null) {
                        // Infer level from order_number (count the dots)
                        const level = section.order_number.split('.').length
                        return { ...section, level }
                    }
                    return section
                })
                console.log("Fixed sections:", fixedSections)
                setSections(fixedSections)
                // IMPORTANT: Initially ALL sections are closed, even those with no children
                setExpandedSections(new Set())
            }
        } catch (error) {
            console.error("Unexpected error:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getAllSectionData()
    }, [])

    const toggleSection = (sectionId: number) => {
        const newExpanded = new Set(expandedSections)
        if (newExpanded.has(sectionId)) {
            newExpanded.delete(sectionId)
        } else {
            newExpanded.add(sectionId)
        }
        setExpandedSections(newExpanded)
    }

    // Function to build hierarchical structure
    const buildDocumentTree = (sections: Section[]) => {
        const sectionMap = new Map<number | null, Section[]>()

        sections.forEach(section => {
            if (!sectionMap.has(section.parent_id)) {
                sectionMap.set(section.parent_id, [])
            }
            sectionMap.get(section.parent_id)!.push(section)
        })

        // Sort sections by order_number
        sectionMap.forEach((children) => {
            children.sort((a, b) => a.order_number.localeCompare(b.order_number))
        })

        console.log("Section map:", sectionMap)
        return sectionMap
    }

    // Check if section has children
    const hasChildren = (sectionId: number, sectionMap: Map<number | null, Section[]>) => {
        const hasChildren = sectionMap.has(sectionId) && sectionMap.get(sectionId)!.length > 0
        console.log(`Section ${sectionId} has children:`, hasChildren)
        return hasChildren
    }

    // Get appropriate icon for section
    // const getSectionIcon = (sectionId: number, sectionMap: Map<number | null, Section[]>, isExpanded: boolean) => {
    //     const hasChildSections = hasChildren(sectionId, sectionMap)

    //     if (hasChildSections) {
    //         return isExpanded ? FolderOpen : Folder
    //     }
    //     return FileText
    // }

    // Check if URL is an image (base64 or external URL)
    const isImageUrl = (url: string | null) => {
        if (!url) return false

        // Check for base64 data URI
        if (url.startsWith('data:image/')) {
            return true
        }

        // Check for external image URLs
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg']
        return imageExtensions.some(ext => url.toLowerCase().includes(ext))
    }

    // Get image source - prioritize img_url over url
    const getImageSource = (section: Section) => {
        if (section.img_url) {
            return section.img_url
        }

        return null
    }

    // Check if section has any image
    const hasImage = (section: Section) => {
        return getImageSource(section) !== null
    }

    // Get safe level (handle null levels)
    const getSafeLevel = (section: Section) => {
        return section.level || 1 // Default to level 1 if null
    }

    // Check if section should show content (ONLY when expanded, regardless of children)
    const shouldShowContent = (isExpanded: boolean) => {
        // Show content and images ONLY when the section is explicitly expanded
        return isExpanded
    }

    // Recursive component to render sections
    const renderSection = (parentId: number | null, sectionMap: Map<number | null, Section[]>) => {
        const children = sectionMap.get(parentId) || []
        console.log(`Rendering children for parent ${parentId}:`, children)

        if (children.length === 0) {
            console.log(`No children found for parent ${parentId}`)
        }

        return children.map(section => {
            const hasChildSections = hasChildren(section.id, sectionMap)
            const isExpanded = expandedSections.has(section.id)
            // const SectionIcon = getSectionIcon(section.id, sectionMap, isExpanded)
            const imageSource = getImageSource(section)
            const sectionHasImage = hasImage(section)
            const safeLevel = getSafeLevel(section)
            const showContent = shouldShowContent(isExpanded)

            console.log(`Rendering section ${section.id}:`, {
                title: section.title,
                level: safeLevel,
                hasChildren: hasChildSections,
                isExpanded,
                hasImage: sectionHasImage,
                showContent
            })

            return (
                <div key={section.id} className="border-l border-gray-200 ml-4">
                    <div className="py-2">
                        {/* Section Header - ALWAYS clickable if it has content or children */}
                        <div
                            className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${(hasChildSections || section.content || sectionHasImage)
                                ? 'hover:bg-gray-50 border border-transparent hover:border-gray-200'
                                : ''
                                } ${safeLevel === 1 ? 'bg-white shadow-sm' :
                                    safeLevel === 2 ? 'bg-gray-25' :
                                        'bg-gray-50'
                                } ${isExpanded ? 'bg-blue-25 border-blue-200' : ''}`}
                            onClick={() => (hasChildSections || section.content || sectionHasImage) && toggleSection(section.id)}
                        >
                            {/* Icon and Chevron - Show chevron if it has children OR content/images */}
                            <div className="flex items-center gap-2 flex-shrink-0">
                                {(hasChildSections || section.content || sectionHasImage) ? (
                                    <div className="text-gray-500 hover:text-gray-700 transition-colors">
                                        {isExpanded ? (
                                            <ChevronDown className="w-4 h-4" />
                                        ) : (
                                            <ChevronRight className="w-4 h-4" />
                                        )}
                                    </div>
                                ) : (
                                    <div className="w-4 h-4"></div>
                                )}

                                {/* <SectionIcon className={`w-4 h-4 ${
                                    hasChildSections 
                                        ? isExpanded 
                                            ? 'text-blue-600' 
                                            : 'text-gray-600'
                                        : 'text-gray-400'
                                }`} /> */}
                            </div>

                            {/* Order Number */}
                            <span className={`px-2 py-1 rounded text-xs font-medium min-w-10 text-center
                             ${safeLevel === 1 ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                                safeLevel === 2 ? 'bg-green-100 text-green-800 border border-green-200' :
                                safeLevel === 3 ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                                            'bg-gray-100 text-gray-800 border border-gray-200'
                                }`}>
                                {section.order_number}
                            </span>

                            {/* Title and Content */}
                            <div className="flex-1 min-w-0">
                                <h3 className={`font-medium break-words leading-tight ${safeLevel === 1 ? 'text-base text-gray-900' :
                                    safeLevel === 2 ? 'text-sm text-gray-800' :
                                        'text-sm text-gray-700'
                                    } ${isExpanded ? 'text-blue-900' : ''}`}>
                                    {section.title}
                                </h3>

                                {/* Show content ONLY when expanded */}
                                {section.content && showContent && (
                                    <div className={`mt-1 text-gray-600 leading-relaxed ${safeLevel === 1 ? 'text-sm' :
                                        safeLevel === 2 ? 'text-xs' :
                                            'text-xs'
                                        }`}>
                                        {section.content}
                                    </div>
                                )}

                                {/* Show image ONLY when expanded */}
                                {sectionHasImage && imageSource && showContent && (
                                    <div className="mt-3">
                                        <img
                                            src={imageSource}
                                            alt={section.title}
                                            className="max-w-full h-auto rounded-lg border border-gray-200 max-h-64 object-contain bg-gray-50"
                                            onError={(e) => {
                                                // If image fails to load, hide the image container
                                                e.currentTarget.style.display = 'none'
                                            }}
                                            onLoad={(e) => {
                                                // Optional: Add fade-in effect when image loads
                                                e.currentTarget.style.opacity = '1'
                                            }}
                                            style={{ opacity: 0, transition: 'opacity 0.3s' }}
                                        />
                                        {!imageSource.startsWith('data:') && (
                                            <div className="mt-1 flex justify-between items-center text-xs text-gray-500">
                                                <span>External image</span>
                                                <a
                                                    href={imageSource}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                                >
                                                    <ExternalLink className="w-3 h-3" />
                                                    Open original
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Item Count Badge - only for sections with children */}
                            {hasChildSections && (
                                <div className="flex-shrink-0 text-xs text-gray-500 bg-white border border-gray-200 px-2 py-1 rounded-full">
                                    {sectionMap.get(section.id)?.length || 0}
                                </div>
                            )}

                            {/* /Image indicator badge - for sections without children but with content/images */}
                            {/* {!hasChildSections && (section.img_url || sectionHasImage) && (
                                <div className="flex-shrink-0 text-xs text-green-600 bg-green-100 border border-green-200 px-2 py-1 rounded-full">
                                    Has Image
                                </div>
                            )} */}
                        </div>

                        {/* Child Sections - only show when expanded */}
                        {hasChildSections && isExpanded && (
                            <div className="mt-1 ml-2">
                                {renderSection(section.id, sectionMap)}
                            </div>
                        )}
                    </div>
                </div>
            )
        })
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    const sectionMap = buildDocumentTree(sections)

    // Count images in the document
    const imageCount = sections.filter(section => hasImage(section)).length

    return (
        <div className="p-6 space-y-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Document Structure</h1>
                <p className="text-gray-600">Click on sections to expand and view content/images</p>

                {/* Summary Stats */}
                <div className="flex gap-6 mt-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                        {/* <Folder className="w-4 h-4" /> */}
                        <span>{sections.filter(s => hasChildren(s.id, sectionMap)).length} folders</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span>{sections.filter(s => !hasChildren(s.id, sectionMap) && (s.content || hasImage(s))).length} content items</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span>📷 {imageCount} images</span>
                    </div>
                    <span>{sections.length} total items</span>
                </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="p-1">
                    {renderSection(null, sectionMap)}
                </div>
            </div>

            {sections.length === 0 && (
                <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-gray-200">
                    <FileText className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                    <div className="text-lg font-medium mb-2">No sections found</div>
                    <p className="text-gray-400">This document doesn't have any sections yet.</p>
                </div>
            )}
        </div>
    )
}