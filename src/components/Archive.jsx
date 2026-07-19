function Archive({
  archive,
  darkMode,
  onRestore,
  onDelete,
}) {
  return (
    <div className="px-10 py-8">
      <h2 className="text-2xl font-bold mb-6">
        📦 Archive
      </h2>

      {archive.length === 0 ? (
        <p
          className={
            darkMode
              ? "text-gray-400"
              : "text-gray-600"
          }
        >
          Archive is empty.
        </p>
      ) : (
        <div className="flex flex-wrap gap-6">
          {archive.map((note) => (
            <div
              key={note.id}
              className={`${note.color} w-64 rounded-lg shadow-md p-4`}
            >
              {note.title && (
                <h3 className="font-bold mb-2">
                  {note.title}
                </h3>
              )}

              <p className="whitespace-pre-wrap mb-4">
                {note.content}
              </p>

              <div className="flex justify-between">
                <button
                  onClick={() => onRestore(note.id)}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                >
                  Restore
                </button>

                <button
                  onClick={() => onDelete(note.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
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

export default Archive;