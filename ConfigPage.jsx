import React, { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const ACTION_TYPES = [
  'Alert',
  'Show Text',
  'Show Image',
  'Refresh Page',
  'Set LocalStorage',
  'Get LocalStorage',
  'Increase Button Size',
  'Close Window',
  'Prompt and Show',
  'Change Button Color',
  'Disable Button'
];

export default function ConfigPage() {
  const [label, setLabel] = useState('');
  const [actions, setActions] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('buttonConfig'));
    if (stored) {
      setLabel(stored.label || '');
      setActions(stored.actions || []);
    }
  }, []);

  const handleAddAction = () => {
    setActions([...actions, { id: uuid(), type: 'Alert', value: '' }]);
  };

  const handleActionChange = (id, key, val) => {
    setActions(actions.map(act => act.id === id ? { ...act, [key]: val } : act));
  };

  const handleRemoveAction = (id) => {
    setActions(actions.filter(act => act.id !== id));
  };

  const handleSave = () => {
    localStorage.setItem('buttonConfig', JSON.stringify({ label, actions }));
    alert('Workflow saved!');
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(actions);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setActions(reordered);
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Configure Button Workflow</h2>

      <div style={{ marginBottom: '1rem' }}>
        <label>Button Label: </label>
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Click Me!"
        />
      </div>

      <h3>Actions (Drag to Reorder):</h3>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="actions">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {actions.map((action, index) => (
                <Draggable key={action.id} draggableId={action.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        userSelect: 'none',
                        padding: 16,
                        marginBottom: 8,
                        background: '#f2f2f2',
                        border: '1px solid #ccc',
                        ...provided.draggableProps.style
                      }}
                    >
                      <label>Type: </label>
                      <select
                        value={action.type}
                        onChange={(e) => handleActionChange(action.id, 'type', e.target.value)}
                      >
                        {ACTION_TYPES.map(type => <option key={type}>{type}</option>)}
                      </select>
                      <br />
                      <label>Value: </label>
                      <input
                        value={action.value}
                        onChange={(e) => handleActionChange(action.id, 'value', e.target.value)}
                        placeholder="Optional Input (e.g. message, URL, key)"
                      />
                      <br />
                      <button onClick={() => handleRemoveAction(action.id)} style={{ marginTop: '0.5rem' }}>Remove</button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <button onClick={handleAddAction}>Add Action</button>
      <br /><br />
      <button onClick={handleSave}>Save Workflow</button>
    </div>
  );
}
