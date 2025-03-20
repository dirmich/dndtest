'use client'
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useState } from 'react'
export default function MultipleContainers() {
  const [containers, setContainers] = useState([
    {
      id: 'todo',
      title: 'To Do',
      items: [
        { id: 'task-1', content: 'Research @dnd-kit' },
        { id: 'task-2', content: 'Create basic example' },
        { id: 'task-3', content: 'Write tutorial' },
      ],
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      items: [{ id: 'task-4', content: 'Record demo video' }],
    },
    {
      id: 'done',
      title: 'Done',
      items: [{ id: 'task-5', content: 'Setup project' }],
    },
  ])
  //   void setContainers
  const [activeId, setActiveId] = useState(null)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        // distance: 8,
        delay: 100,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )
  const findContainerId = (itemid) => {
    if (containers.some((c) => c.id === itemid)) {
      return itemid
    }
    return containers.find((c) => c.items.some((i) => i.id === itemid))?.id
  }
  const handleDragStart = (e) => {
    setActiveId(e.active.id)
    console.log('drag start', e)
  }
  const handleDragOver = (e) => {
    const { active, over } = e
    if (!over) return
    const activeContainerId = findContainerId(active.id)
    const overContainerId = findContainerId(over.id)
    if (!activeContainerId || !overContainerId) return
    if (activeContainerId === overContainerId && active.id !== over.id) return
    if (activeContainerId === overContainerId) return
    setContainers((prev) => {
      const activeContainer = prev.find((c) => c.id === activeContainerId)
      const activeItem = activeContainer.items.find((i) => i.id === active.id)
      if (!activeItem) return prev
      const newContainers = prev.map((c) => {
        if (c.id === activeContainerId) {
          return {
            ...c,
            items: c.items.filter((i) => i.id !== active.id),
          }
        }
        if (c.id === overContainerId) {
          if (over.id === overContainerId)
            return {
              ...c,
              items: [...c.items, activeItem],
            }
        }
        return c
      })
      return newContainers
    })
  }
  const handleDragEnd = (e) => {
    const { active, over } = e
    if (!over) {
      setActiveId(null)
      return
    }
    const activeContainerId = findContainerId(active.id)
    const overContainerId = findContainerId(over.id)
    if (!activeContainerId || !overContainerId) {
      setActiveId(null)
      return
    }
    if (activeContainerId === overContainerId && active.id !== over.id) {
      const cidx = containers.findIndex((c) => c.id === activeContainerId)
      if (cidx < 0) {
        setActiveId(null)
        return
      }
      const container = containers[cidx]
      const activeIdx = container.items.findIndex((i) => i.id === active.id)
      const overIdx = container.items.findIndex((i) => i.id === over.id)
      if (activeIdx >= 0 && overIdx >= 0) {
        const newItems = arrayMove(container.items, activeIdx, overIdx)
        setContainers((c) => {
          return containers.map((c, idx) => {
            if (idx === cidx) return { ...c, items: newItems }
            return c
          })
        })
      }
    }
    setActiveId(null)
    console.log('drag end', e)
  }
  const handleDragAbort = (e) => {
    console.log('abort', e)
  }
  const handleDragCancel = (e) => {
    console.log('cancel', e)
  }
  const getActiveItem = () => {
    for (const c of containers) {
      const item = c.items.find((i) => i.id === activeId)
      if (item) return item
    }
    return null
  }
  return (
    <div className='mx-auto w-full'>
      <h2 className='mb-4 text-xl font-bold dark:text-white'>Kanban Board</h2>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
        onDragAbort={handleDragAbort}
      >
        <div className='grid gap-4 md:grid-cols-3'>
          {containers.map((container) => (
            <DroppableContainer
              key={container.id}
              id={container.id}
              items={container.items}
              title={container.title}
            />
          ))}
        </div>
        <DragOverlay
          dropAnimation={{
            duration: 150,
            easing: 'cubic-bezier(0.18,0.67,0.6,1.22',
          }}
        >
          {activeId ? (
            <ItemOverlay>{getActiveItem()?.content}</ItemOverlay>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}

const DroppableContainer = ({ id, title, items }) => {
  const { setNodeRef } = useDroppable({ id })
  return (
    <div
      ref={setNodeRef}
      key={id}
      className='flex h-full min-h-40 flex-col rounded-md border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/50'
    >
      <h3 className='mb-2 font-medium text-gray-700 dark:text-gray-200'>
        {title}
      </h3>
      <div className='flex-1'>
        <SortableContext
          items={items.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className='flex flex-col gap-2'>
            {items.map((item) => (
              <SortableItem key={item.id} id={item.id} content={item.content} />
            ))}
          </ul>
        </SortableContext>

        {items.length === 0 && (
          <div className='flex h-20 items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800/30'>
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              Drop items here
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

const SortableItem = ({ id, content }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }
  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`cursor-grab touch-none rounded border bg-white p-3 dark:border-gray-700 dark:bg-gray-700 ${
        isDragging ? 'z-10 opacity-50 shadow-md' : ''
      }`}
    >
      <div className='flex items-center gap-3'>
        <span className='text-gray-500 dark:text-gray-400'>⋮</span>
        <span className='dark:text-gray-200'>{content}</span>
      </div>
    </li>
  )
}

const ItemOverlay = ({ children }) => {
  return <div>{children}</div>
}
