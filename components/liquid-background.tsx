"use client"

import type React from "react"

import { useEffect, useRef } from "react"

interface LiquidBackgroundProps {
  children: React.ReactNode
}

export default function LiquidBackground({ children }: LiquidBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Create floating blobs
    const createBlob = (index: number) => {
      const blob = document.createElement("div")
      blob.className = "floating-blob"

      const colors = [
        "bg-gradient-to-br from-cyan-400/30 to-blue-500/30",
        "bg-gradient-to-br from-lime-400/30 to-green-500/30",
        "bg-gradient-to-br from-purple-400/30 to-pink-500/30",
        "bg-gradient-to-br from-orange-400/30 to-red-500/30",
      ]

      const size = Math.random() * 200 + 100
      const x = Math.random() * window.innerWidth
      const y = Math.random() * window.innerHeight

      blob.style.width = `${size}px`
      blob.style.height = `${size}px`
      blob.style.left = `${x}px`
      blob.style.top = `${y}px`
      blob.style.animationDelay = `${index * 0.5}s`
      blob.className += ` ${colors[index % colors.length]}`

      container.appendChild(blob)

      // Animate blob movement
      const moveBlob = () => {
        const newX = Math.random() * window.innerWidth
        const newY = Math.random() * window.innerHeight
        blob.style.transition = "all 8s ease-in-out"
        blob.style.left = `${newX}px`
        blob.style.top = `${newY}px`
      }

      setInterval(moveBlob, 8000)
    }

    // Create 4 floating blobs
    for (let i = 0; i < 4; i++) {
      createBlob(i)
    }

    return () => {
      // Cleanup blobs
      const blobs = container.querySelectorAll(".floating-blob")
      blobs.forEach((blob) => blob.remove())
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-100 relative overflow-hidden"
    >
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-100/50 via-transparent to-blue-100/50 pointer-events-none" />

      {/* Main content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
