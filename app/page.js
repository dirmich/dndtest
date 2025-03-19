import { DndContext, useDraggable } from "@dnd-kit/core"

const Draggable = ()=>{
  const {attributes,listeners,setNodeRef,transform}=useDraggable({
    id:'draggable'
  })
  return (
    <div className="h-24 w-24 rounded-md bg-blue-500 p-4 text-white"
      {...listeners}
      {...attributes}
    >
          Drag me
        </div>
  )
}
const  Home=() => {
  const handleDragEnd=()=>{}
  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
        <Draggable />
        <div className="flex h-40 w-40 items-center justify-center rounded-md border-2 border-dashed border-gray-400">
          <span className="text-gray-500 dark:text-gray-400">
          Drop here
          </span>
        </div>
      </div>
    </DndContext>
  );
}

export default  Home

