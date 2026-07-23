import { useState } from "react";
import { FaPlus, FaRegBell } from "react-icons/fa";
import { FiCalendar, FiClock } from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function CreateArea({ onAdd, darkMode }) {
  const [expand, setExpand] = useState(false);
  const [showReminderPicker, setShowReminderPicker] = useState(false);

  const [note, setNote] = useState({
    title: "",
    content: "",
    reminderDate: null,
    reminderTime: null,
  });

  const formatDate = (date) => {
    if (!date) return "Pick a date";

    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (time) => {
    if (!time) return "Pick a time";

    return time.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  function handleChange(e) {
    const { name, value } = e.target;

    setNote((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function formatLocalDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
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

     reminderDate: note.reminderDate
  ? formatLocalDate(note.reminderDate)
  : "",

      reminderTime: note.reminderTime
        ? note.reminderTime.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })
        : "",
    });

    setNote({
      title: "",
      content: "",
      reminderDate: null,
      reminderTime: null,
    });

    setShowReminderPicker(false);
    setExpand(false);
  }

  return (
    <div className="flex justify-center mt-10 px-4">
      <form
        className={`relative w-full max-w-xl rounded-xl p-4 shadow-lg transition-all duration-300 hover:shadow-xl ${
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
            className={`mb-3 w-full bg-transparent text-xl font-semibold outline-none ${
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
          className={`w-full resize-none bg-transparent outline-none ${
            darkMode
              ? "text-white placeholder-gray-400"
              : "text-gray-900 placeholder-gray-500"
          }`}
        />

        {expand && (
          <div className="mt-4">
            <button
              type="button"
              onClick={() =>
                setShowReminderPicker((prev) => !prev)
              }
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold shadow-sm transition-all duration-200 ${
                darkMode
                  ? "border-yellow-700 bg-yellow-900/20 text-yellow-300 hover:border-yellow-600 hover:bg-yellow-900/30"
                  : "border-yellow-300 bg-yellow-50 text-yellow-700 hover:border-yellow-400 hover:bg-yellow-100"
              }`}
            >
              <FaRegBell className="text-[14px]" />
              <span>Add Reminder</span>
            </button>
                        {showReminderPicker && (
              <div
                className={`mt-4 rounded-2xl border p-5 shadow-md transition-all duration-300 ${
                  darkMode
                    ? "border-gray-700 bg-gray-900"
                    : "border-gray-200 bg-white"
                }`}
              >
                {/* Date */}
                <div className="mb-4">
                  <label
                    className={`mb-2 flex items-center gap-2 text-sm font-semibold ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    <FiCalendar className="text-yellow-500" />
                    Reminder Date
                  </label>

                  <DatePicker
                    selected={note.reminderDate}
                    onChange={(date) =>
                      setNote((prev) => ({
                        ...prev,
                        reminderDate: date,
                      }))
                    }
                    dateFormat="dd MMM yyyy"
                    placeholderText="Pick a date"
                    className={`w-full rounded-xl border px-4 py-3 outline-none transition ${
                      darkMode
                        ? "border-gray-700 bg-gray-800 text-white focus:border-yellow-500"
                        : "border-gray-300 bg-gray-50 text-gray-700 focus:border-yellow-400"
                    }`}
                  />
                </div>

                {/* Time */}
                <div className="mb-5">
                  <label
                    className={`mb-2 flex items-center gap-2 text-sm font-semibold ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    <FiClock className="text-yellow-500" />
                    Reminder Time
                  </label>

                  <DatePicker
                    selected={note.reminderTime}
                    onChange={(time) =>
                      setNote((prev) => ({
                        ...prev,
                        reminderTime: time,
                      }))
                    }
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={5}
                    timeCaption="Time"
                    dateFormat="h:mm aa"
                    placeholderText="Pick a time"
                    className={`w-full rounded-xl border px-4 py-3 outline-none transition ${
                      darkMode
                        ? "border-gray-700 bg-gray-800 text-white focus:border-yellow-500"
                        : "border-gray-300 bg-gray-50 text-gray-700 focus:border-yellow-400"
                    }`}
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowReminderPicker(false)}
                    className={`rounded-lg px-4 py-2 text-sm transition ${
                      darkMode
                        ? "hover:bg-gray-800"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowReminderPicker(false)}
                    className="rounded-lg bg-yellow-400 px-5 py-2 text-sm font-semibold text-white transition hover:bg-yellow-500"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {expand && (
          <button
            type="button"
            onClick={submitNote}
            className="absolute -bottom-5 right-5 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-400 text-white shadow-lg transition hover:bg-yellow-500"
          >
            <FaPlus />
          </button>
        )}
      </form>
    </div>
  );
}

export default CreateArea;