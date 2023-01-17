import { useEffect, useRef } from 'react'

const useOnlyScrollableContainer = () => {
  const listContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Removes bounce effect on mac
    document.body.style.overscrollBehaviorY = 'none'
    const forwardWindowScrollToContainer = (e: WheelEvent) => {
      const isPageScrollable = window.innerHeight < document.body.clientHeight
      if (isPageScrollable) return
      // Early return if scroll is made on a scrollable element
      if (
        e
          .composedPath()
          .some(
            (target) =>
              target instanceof Element &&
              target?.clientHeight < target?.scrollHeight
          )
      )
        return
      listContainerRef.current?.scrollBy({ top: e.deltaY })
    }

    window.addEventListener('wheel', forwardWindowScrollToContainer)

    return () => {
      window.removeEventListener('wheel', forwardWindowScrollToContainer)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const updateHeight = () => {
      if (!listContainerRef.current) return

      listContainerRef.current.style.overflowY = 'auto'
      const listContainerHeight =
        (window?.innerHeight || 0) -
        (listContainerRef.current?.getBoundingClientRect().top || 0) -
        30

      listContainerRef.current.style.height = `${listContainerHeight}px`

      listContainerRef.current.style.minHeight = '300px'
      listContainerRef.current.classList.add('scrollbar-none')
    }

    // const handelScrollbarStyles = () => {
    //   if (!listContainerRef.current) return
    //   const isPageScrollable = window.innerHeight < document.body.clientHeight
    //   // Hide scrollbar, when page is not scrollable
    //   // Reason: Scroll anywhere on page will cause the container to scroll too
    //   listContainerRef.current.classList.toggle(
    //     'scrollbar-none',
    //     !isPageScrollable
    //   )

    //   // Show scrollbar, when page is scrollable
    //   // Reason: When page is scrollable, container will be scrollable only if user
    //   // directly scrolls on top of it
    //   listContainerRef.current.style.paddingRight =
    //     listContainerRef.current?.scrollHeight >
    //       listContainerRef.current?.clientHeight && !!isPageScrollable
    //       ? '20px'
    //       : ''
    //   listContainerRef.current.classList.toggle(
    //     'daolens-scroll-bar',
    //     !!isPageScrollable
    //   )
    // }

    // Calculate height after container renders
    setTimeout(() => updateHeight(), 10)
    // // Apply scrollbar styles after height is calculated.
    // // Reason: Scrollbar is shown only if the page is visible. Which
    // // can not be deteremined before calculating the height
    // setTimeout(() => handelScrollbarStyles(), 5)

    window.addEventListener('resize', updateHeight)
    return () => {
      window.removeEventListener('resize', updateHeight)
    }
  }, [])

  return listContainerRef
}

export default useOnlyScrollableContainer
