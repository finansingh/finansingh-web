'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import Image from 'next/image'

interface ThemeAwareAvatarProps {
    lightSrc: string
    darkSrc?: string
    alt: string
    width: number
    height: number
    className?: string
}

export default function ThemeAwareAvatar({
    lightSrc,
    darkSrc,
    alt,
    width,
    height,
    className = '',
}: ThemeAwareAvatarProps) {
    const { resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    // If darkSrc is provided and we're in dark mode, use it
    const src = mounted && resolvedTheme === 'dark' && darkSrc ? darkSrc : lightSrc

    return (
        <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className={className}
        />
    )
}
