import { useEffect, useRef } from 'react'

const Ruler = ({
  onRender,
  children,
}: {
  onRender: (element: HTMLDivElement) => void
  children?: React.ReactNode
}) => {
  const ref = useRef<HTMLDivElement>(null!)
  useEffect(() => onRender(ref.current))
  return <div ref={ref}>{children}</div>
}

export default Ruler
