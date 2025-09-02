"use client"

import React, { useState } from "react"

export type ImageWithSkeletonProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  wrapperClassName?: string
  skeletonClassName?: string
}

export default function ImageWithSkeleton({
  wrapperClassName = "",
  skeletonClassName = "",
  className = "",
  onLoad,
  ...imgProps
}: ImageWithSkeletonProps) {
  const [loaded, setLoaded] = useState(false)

  const handleLoad: React.ReactEventHandler<HTMLImageElement> = (e) => {
    setLoaded(true)
    onLoad?.(e)
  }

  return (
    <div className={`relative ${wrapperClassName}`}>
      {!loaded && (
        <div className={`absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse pointer-events-none ${skeletonClassName}`} />
      )}
      <img
        {...imgProps}
        onLoad={handleLoad}
        className={`${className} ${loaded ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}
      />
    </div>
  )
}
