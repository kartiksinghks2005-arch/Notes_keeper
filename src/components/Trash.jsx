function Trash({ trash, onRestore, onDeleteForever, darkMode }) {
  return (
    <div className="px-10 py-8">
      <h2 className="text-2xl font-bold mb-6">🗑 Trash</h2>

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
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  Restore
                </button>

                <button
                  onClick={() => onDeleteForever(note.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
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