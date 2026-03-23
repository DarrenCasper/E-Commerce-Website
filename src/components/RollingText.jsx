import React, { useMemo, useRef } from "react"
import { motion, useInView } from "motion/react"

const ENTRY_ANIMATION = {
  initial: { rotateX: 0 },
  animate: { rotateX: 90 },
}

const EXIT_ANIMATION = {
  initial: { rotateX: 90 },
  animate: { rotateX: 0 },
}

const formatCharacter = (char) => (char === " " ? "\u00A0" : char)

export default function RollingText({
  className = "",
  transition = { duration: 1, delay: 0.05, ease: "easeOut" }, // slower and default
  inView = false,
  inViewMargin = "0px",
  inViewOnce = true,
  text,
  ...props
}) {
  const localRef = useRef(null)

  const inViewResult = useInView(localRef, {
    once: inViewOnce,
    margin: inViewMargin,
  })

  const isInView = !inView || inViewResult
  const characters = useMemo(() => text.split(""), [text])

  return (
    <span
      ref={localRef}
      className={className}
      data-slot="rolling-text"
      {...props}
    >
      {characters.map((char, idx) => (
        <span
          key={idx}
          aria-hidden="true"
          className="relative inline-block perspective-[9999999px] transform-3d"
        >
          <motion.span
            initial={ENTRY_ANIMATION.initial}
            animate={isInView ? ENTRY_ANIMATION.animate : undefined}
            transition={{
              ...transition,
              delay: idx * (transition?.delay ?? 0),
              repeat: Infinity,
            }}
            className="absolute inline-block backface-hidden origin-[50%_25%]"
          >
            {formatCharacter(char)}
          </motion.span>

          <motion.span
            initial={EXIT_ANIMATION.initial}
            animate={isInView ? EXIT_ANIMATION.animate : undefined}
            transition={{
              ...transition,
              delay: idx * (transition?.delay ?? 0) + 0.3,
              repeat: Infinity,
            }}
            className="absolute inline-block backface-hidden origin-[50%_100%]"
          >
            {formatCharacter(char)}
          </motion.span>

          <span className="invisible">{formatCharacter(char)}</span>
        </span>
      ))}

      <span className="sr-only">{text}</span>
    </span>
  )
}