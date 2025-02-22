'use client'

import { cn } from '@/utils/cn'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'

export const GlowingStarsBackgroundCard = ({
  className,
  href,
  children,
}: {
  className?: string
  href: string
  children?: React.ReactNode
}) => {
  const [mouseEnter, setMouseEnter] = useState(false)

  return (
    <Link
      href={href}
      onMouseEnter={() => {
        setMouseEnter(true)
      }}
      onMouseLeave={() => {
        setMouseEnter(false)
      }}
      className={cn(
        'h-full max-h-[20rem] w-full max-w-md rounded-xl border border-[#eaeaea] bg-[linear-gradient(110deg,#333_0.6%,#222)] p-4 dark:border-neutral-600',
        className
      )}
    >
      <div className="flex items-center justify-center">
        <Illustration mouseEnter={mouseEnter} />
      </div>
      <div className="px-2 pb-6">{children}</div>
    </Link>
  )
}

export const GlowingStarsDescription = ({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) => {
  return (
    <p className={cn('max-w-[16rem] text-base text-white', className)}>
      {children}
    </p>
  )
}

export const GlowingStarsTitle = ({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) => {
  return (
    <h2 className={cn('text-2xl font-bold text-[#eaeaea]', className)}>
      {children}
    </h2>
  )
}

export const Illustration = ({ mouseEnter }: { mouseEnter: boolean }) => {
  const stars = 108
  const columns = 18

  const [glowingStars, setGlowingStars] = useState<number[]>([])

  const highlightedStars = useRef<number[]>([])

  useEffect(() => {
    const interval = setInterval(() => {
      highlightedStars.current = Array.from({ length: 5 }, () =>
        Math.floor(Math.random() * stars)
      )
      setGlowingStars([...highlightedStars.current])
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className="h-48 w-full p-1"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: `1px`,
      }}
    >
      {[...Array(stars)].map((_, starIdx) => {
        const isGlowing = glowingStars.includes(starIdx)
        const delay = (starIdx % 10) * 0.1
        const staticDelay = starIdx * 0.01
        return (
          <div
            key={`matrix-col-${starIdx}}`}
            className="relative flex items-center justify-center"
          >
            <Star
              isGlowing={mouseEnter ? true : isGlowing}
              delay={mouseEnter ? staticDelay : delay}
            />
            {mouseEnter && <Glow delay={staticDelay} />}
            <AnimatePresence mode="wait">
              {isGlowing && <Glow delay={delay} />}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

const Star = ({ isGlowing, delay }: { isGlowing: boolean; delay: number }) => {
  return (
    <motion.div
      key={delay}
      initial={{
        scale: 1,
      }}
      animate={{
        scale: isGlowing ? [1, 1.2, 2.5, 2.2, 1.5] : 1,
        background: isGlowing ? '#fff' : '#666',
      }}
      transition={{
        duration: 2,
        ease: 'easeInOut',
        delay: delay,
      }}
      className={cn('relative z-20 h-[1px] w-[1px] rounded-full bg-[#666]')}
    ></motion.div>
  )
}

const Glow = ({ delay }: { delay: number }) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        duration: 2,
        ease: 'easeInOut',
        delay: delay,
      }}
      exit={{
        opacity: 0,
      }}
      className="absolute  left-1/2 z-10 h-[4px] w-[4px] -translate-x-1/2 rounded-full bg-blue-500 shadow-2xl shadow-blue-400 blur-[1px]"
    />
  )
}

export const Icon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="h-4 w-4 stroke-2 text-white"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
      />
    </svg>
  )
}
