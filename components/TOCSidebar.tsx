'use client'

import { useEffect, useState, useRef } from 'react'

interface TocItem {
    value: string
    url: string
    depth: number
}

interface TOCSidebarProps {
    toc: TocItem[]
}

export default function TOCSidebar({ toc }: TOCSidebarProps) {
    const [activeId, setActiveId] = useState<string>('')
    const tocRef = useRef<HTMLUListElement>(null)

    useEffect(() => {
        const headings = toc.map((item) => item.url.slice(1))

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id)
                    }
                })
            },
            {
                rootMargin: '-80px 0px -80% 0px',
                threshold: 0,
            }
        )

        headings.forEach((id) => {
            const element = document.getElementById(id)
            if (element) {
                observer.observe(element)
            }
        })

        return () => {
            headings.forEach((id) => {
                const element = document.getElementById(id)
                if (element) {
                    observer.unobserve(element)
                }
            })
        }
    }, [toc])

    // Auto-scroll TOC to show active item
    useEffect(() => {
        if (activeId && tocRef.current) {
            const activeElement = tocRef.current.querySelector(`[data-toc-id="${activeId}"]`)
            if (activeElement) {
                activeElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                })
            }
        }
    }, [activeId])

    if (!toc || toc.length === 0) {
        return null
    }

    // Filter to only show first-level headings (lowest depth in the document)
    const minDepth = Math.min(...toc.map(item => item.depth))
    const filteredToc = toc.filter(item => item.depth === minDepth)

    return (
        <nav>
            <div>
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-900 dark:text-gray-100">
                    On This Page
                </h2>
                <ul ref={tocRef} className="space-y-2 text-sm">
                    {filteredToc.map((item) => (
                        <li
                            key={item.url}
                            data-toc-id={item.url.slice(1)}
                            style={{ paddingLeft: `${(item.depth - 1) * 0.75}rem` }}
                        >
                            <a
                                href={item.url}
                                className={`block py-1 transition-colors duration-200 ${activeId === item.url.slice(1)
                                    ? 'font-medium text-primary-500'
                                    : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
                                    }`}
                                onClick={(e) => {
                                    e.preventDefault()
                                    const element = document.getElementById(item.url.slice(1))
                                    if (element) {
                                        element.scrollIntoView({ behavior: 'smooth' })
                                    }
                                }}
                            >
                                {item.value}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    )
}
