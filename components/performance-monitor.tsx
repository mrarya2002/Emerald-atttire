"use client"

import { useEffect, useState } from "react"

interface PerformanceData {
  loadTime: number
  renderTime: number
  memoryUsage?: number
}

export function PerformanceMonitor({ label }: { label: string }) {
  const [perfData, setPerfData] = useState<PerformanceData | null>(null)

  useEffect(() => {
    const startTime = performance.now()

    // Monitor page load performance
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry) => {
        if (entry.entryType === "navigation") {
          const navEntry = entry as PerformanceNavigationTiming
          setPerfData({
            loadTime: navEntry.loadEventEnd - navEntry.loadEventStart,
            renderTime: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
            memoryUsage: (performance as any).memory?.usedJSHeapSize,
          })
        }
      })
    })

    observer.observe({ entryTypes: ["navigation"] })

    // Fallback timing
    const endTime = performance.now()
    setTimeout(() => {
      if (!perfData) {
        setPerfData({
          loadTime: endTime - startTime,
          renderTime: endTime - startTime,
          memoryUsage: (performance as any).memory?.usedJSHeapSize,
        })
      }
    }, 1000)

    return () => observer.disconnect()
  }, [])

  if (!perfData || process.env.NODE_ENV === "production") {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-2 rounded text-xs font-mono z-50">
      <div className="font-bold">{label} Performance</div>
      <div>Load: {perfData.loadTime.toFixed(2)}ms</div>
      <div>Render: {perfData.renderTime.toFixed(2)}ms</div>
      {perfData.memoryUsage && <div>Memory: {(perfData.memoryUsage / 1024 / 1024).toFixed(2)}MB</div>}
    </div>
  )
}