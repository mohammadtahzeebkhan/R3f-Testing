import React, { useState } from "react";
import { predefinedPath1 } from "./path2";
import { predefinedPath2 } from "./path";
const TimelineEditor = () => {
  const [data, setData] = useState(predefinedPath1);

  // Delete an item by its index
  const handleDelete = (index) => {
    setData(data.filter((_, i) => i !== index));
  };

  // Update a specific item (for example, updating position or rotation)
  const handleUpdate = (index, key, value) => {
    const updatedData = [...data];
    updatedData[index][key] = value;
    setData(updatedData);
  };

  return (
    <div className="timeline-editor">
      <h1>Timeline Editor</h1>
      <ul className="timeline-list">
        {data.map((item, index) => (
          <li key={index} className="timeline-item">
            <div>
              <strong>Position:</strong> {JSON.stringify(item.position)}
            </div>
            <div>
              <strong>Rotation:</strong> {JSON.stringify(item.rotation)}
            </div>
            <div>
              <strong>Animation:</strong> {item.animation}
            </div>
            <div className="actions">
              <button onClick={() => handleDelete(index)}>Delete</button>
              <button
                onClick={() =>
                  handleUpdate(index, "position", [0, 0, -10]) // Example update
                }
              >
                Update Position
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TimelineEditor;
