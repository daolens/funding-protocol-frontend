import { useState } from 'react'
import { useLayer, useHover } from 'react-laag'
import { PlacementType } from 'react-laag/dist/PlacementType'

type TooltipProps = {
  children: React.ReactNode
  content: React.ReactNode
  showOnHover?: boolean
  placement?: PlacementType
  disabled?: boolean
  className?: string
  delayEnter?: number
  delayLeave?: number
}

const Tooltip = ({
  children,
  content,
  showOnHover,
  placement = 'right-center',
  disabled = false,
  className,
  delayEnter = 100,
  delayLeave = 300,
}: TooltipProps) => {
  // state used for click event
  const [isOpen, setIsOpen] = useState(false)
  // state used for hover event
  const [isOver, hoverProps] = useHover({ delayEnter, delayLeave })

  const isTooltipVisible = disabled ? false : showOnHover ? isOver : isOpen

  const { triggerProps, layerProps, renderLayer } = useLayer({
    isOpen: isTooltipVisible,
    placement,
    auto: true,
    triggerOffset: 15,

    onOutsideClick: () => setIsOpen(false),
  })

  return (
    <>
      <div
        {...triggerProps}
        {...hoverProps}
        onClick={() => setIsOpen(!isOpen)}
        className={className}
      >
        {children}
      </div>
      {isTooltipVisible &&
        renderLayer(
          <div
            className="relative z-50 px-3 py-2 text-sm bg-gray-900 border rounded-md shadow-lg select-none tooltip border-gray-800"
            {...layerProps}
            {...hoverProps}
          >
            {content}
          </div>
        )}
    </>
  )
}

export default Tooltip
