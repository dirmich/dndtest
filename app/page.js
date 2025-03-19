'use client'
import { DndContext, pointerWithin, useDraggable, useDroppable } from "@dnd-kit/core"
import { useState } from "react"

const Draggable = ({name='a'})=>{
  const {attributes,listeners,setNodeRef,transform}=useDraggable({
    id:`draggable-${name}`
  })
  const style = transform ? {
    transform: `translate3d(${transform.x}px,${transform.y}px,0)`,
  } : undefined
  
  return (
    <div 
      ref={setNodeRef}
      style={style}
      className="h-24 w-24 cursor-grab touch-none rounded-md bg-blue-500 p-4 text-white"
      {...listeners}
      {...attributes}      
    >
          Drag me
        </div>
  )
}

const Droppable = ({name})=>{
  const {isOver,setNodeRef}=useDroppable({id:`droppable-${name}`})
  return (
    <div 
      ref={setNodeRef}
      className={`flex h-40 w-40 items-center justify-center rounded-md border-2 border-dashed ${isOver?'border-blue-500 bg-blue-100 dark:border-blue-400 dark:bg-blue-900/30':'border-gray-400 dark:border-gray-600'}`}
    >
          <span className="text-gray-500 dark:text-gray-400">
          Drop here
          </span>
        </div>
  )
}

const  Home=() => {
  const [isDropped,setIsDropped]=useState(false)
  const handleDragEnd=(e)=>{
    console.log('drag end',e)
  }
  return (
    <DndContext 
      collisionDetection={pointerWithin}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
        <Draggable />
        <Droppable name='1'/>        
        <Droppable name='2'/>        
      </div>
    </DndContext>
  );
}

export default  Home

