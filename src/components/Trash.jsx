import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

function Trash({ trash, onRestore, onDeleteForever, darkMode }) {
  const navigate = useNavigate();

  return (
    <div className="px-10 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/")}
          className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition ${
            darkMode
              ? "bg-gray-700 text-white hover:bg-gray-600"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
          title="Back to Home"
        >
          <FaArrowLeft />
        </button>

<h2 className="text-2xl font-bold">🗑 Trash</h2>
      </div>

      {trash.length === 0 ? (
        <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
          Trash is empty.
        </p>
      ) : (
        <div className="flex flex-wrap gap-6">
          {trash.map((note) => (
            <div
              key={note.id}
              className={`${note.color} w-64 rounded-lg shadow-md p-4`}
            >
              <h3 className="font-bold mb-2">{note.title}</h3>

              <p className="mb-4 whitespace-pre-wrap">
                {note.content}
              </p>

              <div className="flex justify-between">
                <button
                  onClick={() => onRestore(note.id)}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition"
                >
                  Restore
                </button>

                <button
                  onClick={() => onDeleteForever(note.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                >
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
