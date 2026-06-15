'use client';

import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useState } from 'react';

export function DragDropList({ items }: { items: Array<{ id: string; label: string }> }) {
  const [ordered, setOrdered] = useState(items);

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setOrdered((current) => {
      const oldIndex = current.findIndex((item) => item.id === active.id);
      const newIndex = current.findIndex((item) => item.id === over.id);
      return arrayMove(current, oldIndex, newIndex);
    });
  }

  return (
    <DndContext onDragEnd={onDragEnd}>
      <SortableContext items={ordered} strategy={verticalListSortingStrategy}>
        <div className="card card-pad">
          {ordered.map((item) => <div className="btn" style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 8 }} key={item.id}>{item.label}</div>)}
        </div>
      </SortableContext>
    </DndContext>
  );
}
