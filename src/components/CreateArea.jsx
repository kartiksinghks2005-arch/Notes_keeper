import { useState } from "react";
import { FaPlus } from "react-icons/fa";

function CreateArea({ onAdd, darkMode }) {
  const [expand, setExpand] = useState(false);

  const [note, setNote] = useState({
    title: "",
    content: "",
    reminderDate: "",
    reminderTime: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;

    setNote((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function submitNote(e) {
    e.preventDefault();

    if (!note.title.trim() && !note.content.trim()) return;

    onAdd({
      id: crypto.randomUUID(),
      title: note.title,
      content: note.content,
      pinned: false,
      color: "bg-white",
      reminderDate: note.reminderDate,
      reminderTime: note.reminderTime,
    });

    setNote({
      title: "",
      content: "",
      reminderDate: "",
      reminderTime: "",
    });

    setExpand(false);
  }
    return (
    <div className="flex justify-center mt-10 px-4">
      <form
        className={`relative rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 w-full max-w-xl ${
          darkMode
            ? "bg-gray-800 text-white"
            : "bg-white text-gray-900"
        }`}
      >
        {expand && (
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={note.title}
            onChange={handleChange}
            className={`w-full text-xl font-semibold outline-none mb-3 bg-transparent ${
              darkMode
                ? "text-white placeholder-gray-400"
                : "text-gray-900 placeholder-gray-500"
            }`}
          />
        )}

        <textarea
          name="content"
          placeholder="Take a note..."
          value={note.content}
          onChange={handleChange}
          rows={expand ? 4 : 1}
          onClick={() => setExpand(true)}
          className={`w-full resize-none outline-none bg-transparent ${
            darkMode
              ? "text-white placeholder-gray-400"
              : "text-gray-900 placeholder-gray-500"
          }`}
        />

        {expand && (
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <input
              type="date"
              name="reminderDate"
              value={note.reminderDate}
              onChange={handleChange}
              className={`flex-1 border rounded-lg px-3 py-2 outline-none ${
                darkMode
                  ? "bg-gray-700 text-white border-gray-600"
                  : "bg-white text-gray-900 border-gray-300"
              }`}
            />

            <input
              type="time"
              name="reminderTime"
              value={note.reminderTime}
              onChange={handleChange}
              className={`flex-1 border rounded-lg px-3 py-2 outline-none ${
                darkMode
                  ? "bg-gray-700 text-white border-gray-600"
                  : "bg-white text-gray-900 border-gray-300"
              }`}
            />
          </div>
        )}

        {expand && (
          <button
            onClick={submitNote}
            className="absolute -bottom-5 right-5 bg-yellow-400 hover:bg-yellow-500 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
          >
            <FaPlus />
          </button>
        )}
      </form>
    </div>
  );
}

export default CreateArea;