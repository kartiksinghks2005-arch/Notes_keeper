import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaTrash, FaTrashRestore } from "react-icons/fa";

function Trash({ trash, onRestore, onDeleteForever, darkMode }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto mb-8 flex max-w-7xl items-center gap-4">
        <button
          onClick={() => navigate("/")}
          className={`flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 ${
            darkMode
              ? "bg-gray-800 text-white hover:bg-gray-700"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          <FaArrowLeft />
        </button>

        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold sm:text-4xl">
            <FaTrash className="text-red-500" />
            Trash
          </h1>
          <p className={darkMode ? "text-gray-400" : "text-gray-500"}>
            {trash.length} {trash.length === 1 ? "note" : "notes"} in trash
          </p>
        </div>
      </div>

      {trash.length === 0 ? (
        <div
          className={`mx-auto mt-16 max-w-lg rounded-3xl border border-dashed p-12 text-center shadow-sm ${
            darkMode
              ? "border-gray-700 bg-gray-800 text-gray-400"
              : "border-gray-300 bg-white text-gray-600"
          }`}
        >
          <FaTrash className="mx-auto mb-5 text-6xl text-red-500" />
          <h2 className="mb-2 text-2xl font-bold">Trash is Empty</h2>
          <p>Deleted notes will appear here until you remove them forever.</p>
        </div>
      ) : (
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {trash.map((note) => (
            <div
              key={note.id}
className={`${
  darkMode && note.color === "bg-white"
    ? "bg-gray-800 text-white"
    : `${note.color} text-gray-900`
} flex min-h-[230px] flex-col rounded-3xl p-5 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl`}            >
              {note.title && (
                <h3 className="mb-3 break-words text-xl font-bold">
                  {note.title}
                </h3>
              )}
<p
  className={`whitespace-pre-wrap break-words text-[15px] leading-6 ${
    darkMode && note.color === "bg-white"
      ? "text-gray-200"
      : "text-gray-700"
  }`}
>{note.content}
              </p>

<div className="mt-auto pt-6 flex gap-3">                <button
                  onClick={() => onRestore(note.id)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 font-medium text-white transition hover:bg-emerald-600"
                >
                  <FaTrashRestore />
                  Restore
                </button>

                <button
                  onClick={() => onDeleteForever(note.id)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 font-medium text-white transition hover:bg-red-600"
                >
                  <FaTrash />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Trash;
