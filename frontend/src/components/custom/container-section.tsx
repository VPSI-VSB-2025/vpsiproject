import React from "react"

interface ContainerSectionProps {
  id: string
  children: React.ReactNode
  className?: string
  paddingTop?: boolean
}

const ContainerSection: React.FC<ContainerSectionProps> = ({
  id,
  children,
  className,
  paddingTop = false,
}) => {
  return (
    <section id={id} className={`${className} `}>
      <div className='w-[80%] mt-8 mx-auto'>{children}</div>
    </section>
  )
}

export default ContainerSection
