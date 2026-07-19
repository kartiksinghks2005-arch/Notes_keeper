import { useState } from "react";
import {
  FaTrash,
  FaEdit,
  FaSave,
  FaThumbtack,
  FaArchive,
  FaBell,
} from "react-icons/fa";

const colors = [
  "bg-white",
  "bg-yellow-200",
  "bg-green-200",
  "bg-blue-200",
  "bg-pink-200",
  "bg-purple-200",
];

function Note({
  id,
  title,
  content,
  pinned,
  color,
  reminderDate,
  reminderTime,
  darkMode,
  onDelete,
  onArchive,
  onUpdate,
  onPin,
  onColor,
}) {
  const [isEditing, setIsEditing] = useState(false);

  const [editedNote, setEditedNote] = useState({
    title,
    content,
    reminderDate,
    reminderTime,
  });

  function handleChange(e) {
    const { name, value } = e.target;

    setEditedNote((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function saveNote() {
    onUpdate(id, {
      ...editedNote,
      pinned,
      color,
    });

    setIsEditing(false);
  }

  const cardClass =
    darkMode && color === "bg-white"
      ? "bg-gray-800 text-white"
      : `${color} text-gray-900`;
        return (
    <div
      className={`${cardClass} relative w-64 rounded-lg shadow-md p-4 wrap-break-word transition-all duration-300 hover:shadow-xl`}
    >
      <button
        onClick={() => onPin(id)}
        className={`absolute top-3 right-3 ${
          pinned
            ? "text-yellow-500 rotate-45"
            : "text-gray-400 hover:text-yellow-500"
        }`}
      >
        <FaThumbtack />
      </button>

      {isEditing ? (
        <>
          <input
            type="text"
            name="title"
            value={editedNote.title}
            onChange={handleChange}
            className={`w-full mb-2 border-b outline-none bg-transparent font-semibold ${
              darkMode
                ? "text-white border-gray-600"
                : "text-gray-900 border-gray-300"
            }`}
          />

          <textarea
            name="content"
            value={editedNote.content}
            onChange={handleChange}
            rows={4}
            className={`w-full resize-none outline-none bg-transparent ${
              darkMode
                ? "text-white"
                : "text-gray-900"
            }`}
          />

          <div className="flex flex-col gap-2 mt-3">
            <input
              type="date"
              name="reminderDate"
              value={editedNote.reminderDate}
              onChange={handleChange}
              className={`border rounded px-2 py-1 ${
                darkMode
                  ? "bg-gray-700 text-white border-gray-600"
                  : "bg-white border-gray-300"
              }`}
            />

            <input
              type="time"
              name="reminderTime"
              value={editedNote.reminderTime}
              onChange={handleChange}
              className={`border rounded px-2 py-1 ${
                darkMode
                  ? "bg-gray-700 text-white border-gray-600"
                  : "bg-white border-gray-300"
              }`}
            />
          </div>
        </>
      ) : (
        <>
          {title && (
            <h2
              className={`text-lg font-semibold mb-2 pr-6 ${
                darkMode && color === "bg-white"
                  ? "text-white"
                  : "text-gray-900"
              }`}
            >
              {title}
            </h2>
          )}

          <p
            className={`whitespace-pre-wrap ${
              darkMode && color === "bg-white"
                ? "text-gray-200"
                : "text-gray-700"
            }`}
          >
            {content}
          </p>

          {(reminderDate || reminderTime) && (
            <div
              className={`flex items-center gap-2 mt-4 text-sm font-medium ${
                darkMode
                  ? "text-yellow-300"
                  : "text-orange-600"
              }`}
            >
              <FaBell />
              <span>
                {reminderDate}
                {reminderDate && reminderTime ? " • " : ""}
                {reminderTime}
              </span>
            </div>
          )}
        </>
      )}

      <div className="flex gap-2 mt-4 flex-wrap">
        {colors.map((clr) => (
          <button
            key={clr}
            onClick={() => onColor(id, clr)}
            className={`w-5 h-5 rounded-full border ${
              clr === "bg-white"
                ? "bg-white"
                : clr === "bg-yellow-200"
                ? "bg-yellow-200"
                : clr === "bg-green-200"
                ? "bg-green-200"
                : clr === "bg-blue-200"
                ? "bg-blue-200"
                : clr === "bg-pink-200"
                ? "bg-pink-200"
                : "bg-purple-200"
            }`}
          />
        ))}
      </div>

      <div className="flex justify-end gap-4 mt-4">
        <button
          onClick={() => onArchive(id)}
          className="text-gray-500 hover:text-gray-700"
          title="Archive"
        >
          <FaArchive />
        </button>

        <button
          onClick={() => {
            if (isEditing) {
              saveNote();
            } else {
              setIsEditing(true);
            }
          }}
          className="text-blue-600 hover:text-blue-800"
        >
          {isEditing ? <FaSave /> : <FaEdit />}
        </button>

        <button
          onClick={() => onDelete(id)}
          className="text-red-500 hover:text-red-700"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
}

export default Note;