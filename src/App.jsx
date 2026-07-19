import { useEffect, useMemo, useState } from "react";
import { Routes, Route } from "react-router-dom";
import {
  Header,
  Footer,
  CreateArea,
  Note,
  Trash,
  Archive,
} from "./components";

function App() {
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem("notes");

    if (!savedNotes) return [];
    

    return JSON.parse(savedNotes).map((note) => ({
  id: note.id ?? crypto.randomUUID(),
  title: note.title ?? "",
  content: note.content ?? "",
  pinned: note.pinned ?? false,
  color: note.color ?? "bg-white",

  // Reminder
  reminderDate: note.reminderDate ?? "",
  reminderTime: note.reminderTime ?? "",

  notified: note.notified ?? false,
}));
});

  const [trash, setTrash] = useState(() => {
    return JSON.parse(localStorage.getItem("trash")) || [];
  });

  const [archive, setArchive] = useState(() => {
    return JSON.parse(localStorage.getItem("archive")) || [];
  });

  const [darkMode, setDarkMode] = useState(() => {
    return JSON.parse(localStorage.getItem("darkMode")) || false;
  });

  const [search, setSearch] = useState("");

  function addNote(newNote) {
  setNotes((prev) => [
    {
      ...newNote,
      notified: false,
    },
    ...prev,
  ]);
}

  function deleteNote(id) {
    const deletedNote = notes.find((note) => note.id === id);

    if (!deletedNote) return;

    setTrash((prev) => [deletedNote, ...prev]);
    setNotes((prev) => prev.filter((note) => note.id !== id));
  }

  function restoreNote(id) {
    const note = trash.find((item) => item.id === id);

    if (!note) return;

    setNotes((prev) => [note, ...prev]);
    setTrash((prev) => prev.filter((item) => item.id !== id));
  }

  function deleteForever(id) {
    setTrash((prev) => prev.filter((item) => item.id !== id));
  }

  function archiveNote(id) {
    const note = notes.find((item) => item.id === id);

    if (!note) return;

    setArchive((prev) => [note, ...prev]);
    setNotes((prev) => prev.filter((item) => item.id !== id));
  }

  function restoreArchive(id) {
    const note = archive.find((item) => item.id === id);

    if (!note) return;

    setNotes((prev) => [note, ...prev]);
    setArchive((prev) =>
      prev.filter((item) => item.id !== id)
    );
  }

  function deleteArchive(id) {
    setArchive((prev) =>
      prev.filter((item) => item.id !== id)
    );
  }

  function updateNote(id, updatedNote) {
  setNotes((prev) =>
    prev.map((note) =>
      note.id === id
        ? {
            ...note,
            ...updatedNote,
            reminderDate:
              updatedNote.reminderDate ??
              note.reminderDate,
            reminderTime:
              updatedNote.reminderTime ??
              note.reminderTime,
          }
        : note
    )
  );
}

  function togglePin(id) {
    setNotes((prev) => {
      const updated = prev.map((note) =>
        note.id === id
          ? { ...note, pinned: !note.pinned }
          : note
      );

      return updated.sort(
        (a, b) => Number(b.pinned) - Number(a.pinned)
      );
    });
  }

  function changeColor(id, color) {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id
          ? { ...note, color }
          : note
      )
    );
  }

    // Save Notes
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  // Save Trash
  useEffect(() => {
    localStorage.setItem("trash", JSON.stringify(trash));
  }, [trash]);

  // Save Archive
  useEffect(() => {
    localStorage.setItem("archive", JSON.stringify(archive));
  }, [archive]);

  // Save Theme
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);


  // Ask Notification Permission
useEffect(() => {
  if (!("Notification" in window)) return;

  if (Notification.permission === "default") {
    Notification.requestPermission().then((permission) => {
      console.log("Permission:", permission);
    });
  }
}, []); 

  // Reminder Notification
useEffect(() => {
  if (!("Notification" in window)) return;

  const interval = setInterval(() => {
    const now = new Date();

    const currentDate = now.toISOString().split("T")[0];

    const currentTime = now.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    console.log("Current:", currentDate, currentTime);
console.log(notes);

notes.forEach((note) => {
  console.log({
    savedDate: note.reminderDate,
    currentDate,
    savedTime: note.reminderTime,
    currentTime,
    notified: note.notified,
  });

  if (
    note.reminderDate === currentDate &&
    note.reminderTime === currentTime &&
    !note.notified
  ) {
    console.log("MATCHED ✅");

    new Notification("📌 Keeper Reminder", {
  body: `${note.title}

${note.content}

🕒 ${note.reminderTime}`,
  icon: "/Keeper-logo.png",
});

    setNotes((prev) =>
      prev.map((n) =>
        n.id === note.id
          ? { ...n, notified: true }
          : n
      )
    );
  }
});
  }, 1000);

  return () => clearInterval(interval);
}, [notes]);
  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const keyword = search.toLowerCase();

      return (
        note.title.toLowerCase().includes(keyword) ||
        note.content.toLowerCase().includes(keyword)
      );
    });
  }, [notes, search]);

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-linear-to-br from-yellow-50 via-orange-50 to-amber-100 text-black"
      }`}
    >
      <Header
        search={search}
        setSearch={setSearch}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <CreateArea
                onAdd={addNote}
                darkMode={darkMode}
              />

              <div className="px-10 py-8 flex flex-wrap gap-6">
                {filteredNotes.map((note) => (
                  <Note
                    key={note.id}
                    {...note}
                    darkMode={darkMode}
                    onDelete={deleteNote}
                    onArchive={archiveNote}
                    onUpdate={updateNote}
                    onPin={togglePin}
                    onColor={changeColor}
                  />
                ))}
              </div>
            </>
          }
        />

        <Route
          path="/trash"
          element={
            <Trash
              trash={trash}
              darkMode={darkMode}
              onRestore={restoreNote}
              onDeleteForever={deleteForever}
            />
          }
        />

        <Route
          path="/archive"
          element={
            <Archive
              archive={archive}
              darkMode={darkMode}
              onRestore={restoreArchive}
              onDelete={deleteArchive}
            />
          }
        />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;