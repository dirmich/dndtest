'use client'
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useEffect, useState } from 'react'

const SortableItem = ({ id, content, active, ghost }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })
  const style = {
    // transform: transform
    //   ? `translate3d(${transform.x}px,${transform.y}px,0)`
    //   : undefined,
    transform: CSS.Transform.toString(transform),
    transition,
  }
  if (ghost) console.log('ghost')
  return (
    <li
      key={id}
      ref={setNodeRef}
      className={`list-none cursor-grab touch-none rounded-md border bg-white p-3 dark:border-gray-700 dark:bg-gray-800 ${
        active ? 'opacity-30' : ''
      } ${ghost ? '!bg-blue-500' : ''}`}
      style={style}
      {...attributes}
      {...listeners}
    >
      <div className='flex items-center gap-3 '>
        <span className='text-gray-500 dark:text-gray-400'>||</span>
        <span className='dark:text-gray-200'>{content}</span>
      </div>
    </li>
  )
}
const SortableTest = () => {
  const [activeId, setActiveId] = useState(null)
  const [activeItem, setActiveItem] = useState(null)
  const [items, setItems] = useState([
    { id: 1, content: 'Item 1' },
    { id: 2, content: 'Item 2' },
    { id: 3, content: 'Item 3' },
    { id: 4, content: 'Item 4' },
    { id: 5, content: 'Item 5' },
  ])
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  )
  useEffect(() => {
    const c = items.find((i) => i.id === activeId)
    if (!!c) setActiveItem(c)
  }, [activeId, items])
  useEffect(() => {
    console.log('ai', activeItem)
  }, [activeItem])
  const handleDragStart = (e) => {
    console.log('drag start', e)
    setActiveId(e.active.id)
  }
  const handleDragEnd = (e) => {
    console.log('drag end', e)
    const { active, over } = e

    if (!over) return
    if (active.id !== over.id) {
      setItems((p) => {
        const oldidx = items.findIndex((i) => i.id === active.id)
        const newidx = items.findIndex((i) => i.id === over.id)
        return arrayMove(items, oldidx, newidx)
      })
    }
    setActiveId(null)
    setActiveItem(null)
  }
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
    >
      <div className='w-[90vw] mx-auto max-w-md rounded-lg border bg-white p-4 dark:border-gray-700 dark:bg-gray-800 flex flex-col justify-center items-center'>
        <h2 className='mb-4 p-4 dark:border-gray-700 dark:bg-gray-800 w-full text-center'>
          Sortable List
        </h2>
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className='space-y-2 w-full'>
            {items.map((item, idx) => (
              <SortableItem
                key={`s_${idx}`}
                id={item.id}
                content={item.content}
                active={item.id === activeId}
              />
            ))}
          </ul>
        </SortableContext>
        <DragOverlay
          adjustScale={true}
          dropAnimation={{
            duration: 150,
            easing: 'cubic-bezier(0.18,0.67,0.6,1.22)',
          }}
        >
          {!!activeItem ? (
            <SortableItem
              id={activeItem.id}
              content={activeItem.content}
              ghost
            />
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  )
}

export default SortableTest
