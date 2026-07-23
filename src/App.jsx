import toast from "react-hot-toast";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { useEffect, useMemo, useRef, useState } from "react";
import { Routes, Route } from "react-router-dom";
import {
  Header,
  Footer,
  CreateArea,
  Note,
  Trash,
  Archive,
} from "./components";
import { supabase } from "./supabase";

// Maps a Supabase `notes` row to the note shape the app's components
// expect (id, title, content, pinned, color, reminderDate, reminderTime,
// notified).
function mapRowToNote(row) {
  return {
    id: row.id,
    title: row.title ?? "",
    content: row.content ?? "",
    pinned: row.pinned ?? false,
    color: row.color ?? "bg-white",
    reminderDate: row.reminder_date ?? "",
    reminderTime: row.reminder_time ?? "",
    notified: row.notified ?? false,
  };
}

// Maps the app's note shape to a Supabase `notes` row for insert.
// `reminder_date` is a real `date` column, so an empty string must
// become `null` — Postgres rejects `""` for a date type.
function mapNoteToRow(note, userId) {
  const row = {
    user_id: userId,
    title: note.title ?? "",
    content: note.content ?? "",
    pinned: note.pinned ?? false,
    color: note.color ?? "bg-white",
    reminder_date: note.reminderDate ? note.reminderDate : null,
    reminder_time: note.reminderTime ?? "",
    notified: note.notified ?? false,
    status: note.status ?? "active",
  };

  // Only send `id` when the note already has one (e.g. restoring from
  // trash/archive). On a brand-new note with no id, omit it so Supabase
  // generates the UUID via `gen_random_uuid()`.
  if (note.id) {
    row.id = note.id;
  }

  return row;
}

function App() {
  const [loading, setLoading] = useState(true);
const [notes, setNotes] = useState([]);

  const [trash, setTrash] = useState([]);

  const [archive, setArchive] = useState([]);

  const [darkMode, setDarkMode] = useState(() => {
    return JSON.parse(localStorage.getItem("darkMode")) || false;
  });

  const [search, setSearch] = useState("");
  const [user, setUser] = useState(() => {
  return JSON.parse(localStorage.getItem("user")) || null;
});

const currentUserEmail = user?.email || "guest";

// Identifier used for Supabase's `user_id` column (Firebase uid
// preferred, falls back to email).
const userId = user?.uid || user?.email;

const [showSignup, setShowSignup] = useState(false);

const [isLoggedIn, setIsLoggedIn] = useState(() => {
  return JSON.parse(localStorage.getItem("isLoggedIn")) || false;
});

// These refs prevent the Trash/Archive "save" effects (below) from firing
// with stale, still-in-memory data belonging to the PREVIOUS user right
// after currentUserEmail changes. Without them, switching users would
// overwrite the new user's saved trash/archive with the old user's data
// before it got a chance to load. (Active notes no longer use
// localStorage or this pattern — they're loaded/saved directly against
// Supabase.)
const skipTrashSaveRef = useRef(false);
const skipArchiveSaveRef = useRef(false);

  async function addNote(newNote) {
    const noteToInsert = {
      ...newNote,
      notified: false,
    };

    // Optimistic UI update so the note appears instantly, same as before.
    setNotes((prev) => [noteToInsert, ...prev]);

    try {
      const { data, error } = await supabase
        .from("notes")
        .insert(mapNoteToRow(noteToInsert, userId))
        .select()
        .single();

      if (error) throw error;

      // Reconcile local state with what Supabase actually stored.
      setNotes((prev) =>
        prev.map((note) =>
          note.id === noteToInsert.id ? mapRowToNote(data) : note
        )
      );
      toast.success("Note added successfully!");
    } catch (err) {
      console.error("Supabase: failed to add note:", err.message);

      // Rollback the optimistic UI update since the insert failed.
      setNotes((prev) => prev.filter((note) => note.id !== noteToInsert.id));
       toast.error("Failed to add note!");
      
    }
  }

 async function deleteNote(id) {
  const note = notes.find((item) => item.id === id);

  if (!note) return;

  // Save current state for rollback
  const previousNotes = notes;
  const previousTrash = trash;

  // ⚡ Instant UI update
  setNotes((prev) => prev.filter((item) => item.id !== id));
  setTrash((prev) => [note, ...prev]);

  try {
    const { error } = await supabase
      .from("notes")
      .update({ status: "trash" })
      .eq("id", id)
      .eq("user_id", userId);

    if (error) throw error;
    toast.success("Moved to Trash");

  } catch (err) {
    console.error("Supabase: failed to move note to trash:", err.message);

    // Rollback
    setNotes(previousNotes);
    setTrash(previousTrash);
  }
}
  async function restoreNote(id) {
  try {
    const { error } = await supabase
      .from("notes")
      .update({ status: "active" })
      .eq("id", id)
      .eq("user_id", userId);

    if (error) throw error;
    toast.success("♻️ Note restored");

    await fetchNotes();
    await fetchTrash();
  } catch (err) {
    console.error("Supabase: failed to restore note:", err.message);
    toast.error("Failed to restore note!");
  }
}

  async function deleteForever(id) {
  const note = trash.find((item) => item.id === id);

  if (!note) return;

  // Save current state for rollback
  const previousTrash = trash;

  // ⚡ Instant UI update
  setTrash((prev) => prev.filter((item) => item.id !== id));

  try {
    const { error } = await supabase
      .from("notes")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) throw error;
    toast.success("Note deleted forever");
  } catch (err) {
    console.error(
      "Supabase: failed to delete note forever:",
      err.message
    );
    toast.error("Failed to delete note!");

    // Rollback
    setTrash(previousTrash);
  }
} 
  async function archiveNote(id) {
  const note = notes.find((item) => item.id === id);

  if (!note) return;

  // Save current state for rollback
  const previousNotes = notes;
  const previousArchive = archive;

  // ⚡ Instant UI update
  setNotes((prev) => prev.filter((item) => item.id !== id));
  setArchive((prev) => [note, ...prev]);

  try {
    const { error } = await supabase
      .from("notes")
      .update({ status: "archive" })
      .eq("id", id)
      .eq("user_id", userId);

    if (error) throw error;
    toast.success("Note archived");
  } catch (err) {
    console.error("Supabase: failed to archive note:", err.message);

    // Rollback if API fails
    setNotes(previousNotes);
    setArchive(previousArchive);
  }
}

    


  async function restoreArchive(id) {
  const note = archive.find((item) => item.id === id);

  if (!note) return;

  // Save current state for rollback
  const previousArchive = archive;
  const previousNotes = notes;

  // ⚡ Instant UI update
  setArchive((prev) => prev.filter((item) => item.id !== id));
  setNotes((prev) => [note, ...prev]);

  try {
    const { error } = await supabase
      .from("notes")
      .update({ status: "active" })
      .eq("id", id)
      .eq("user_id", userId);

    if (error) throw error;
    toast.success("♻️ Note restored");
  } catch (err) {
    console.error("Supabase: failed to restore archive:", err.message);
    toast.error("Failed to restore note!");

    // Rollback
    setArchive(previousArchive);
    setNotes(previousNotes);
  }
}
  function deleteArchive(id) {
    setArchive((prev) =>
      prev.filter((item) => item.id !== id)
    );
  }

  async function updateNote(id, updatedNote) {
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

  try {
    const row = {};

    if ("title" in updatedNote) row.title = updatedNote.title ?? "";
    if ("content" in updatedNote) row.content = updatedNote.content ?? "";
    if ("pinned" in updatedNote) row.pinned = updatedNote.pinned ?? false;
    if ("color" in updatedNote) row.color = updatedNote.color ?? "bg-white";
    if ("reminderDate" in updatedNote)
      row.reminder_date = updatedNote.reminderDate
        ? updatedNote.reminderDate
        : null;
    if ("reminderTime" in updatedNote)
      row.reminder_time = updatedNote.reminderTime ?? "";
    if ("notified" in updatedNote) row.notified = updatedNote.notified ?? false;

    const { error } = await supabase
      .from("notes")
      .update(row)
      .eq("id", id)
      .eq("user_id", userId);

    if (error) throw error;
  } catch (err) {
    console.error("Supabase: failed to update note:", err.message);
  }
}

  function togglePin(id) {
    const target = notes.find((note) => note.id === id);

    if (!target) return;

    const nextPinned = !target.pinned;

    setNotes((prev) => {
      const updated = prev.map((note) =>
        note.id === id
          ? { ...note, pinned: nextPinned }
          : note
      );

      return updated.sort(
        (a, b) => Number(b.pinned) - Number(a.pinned)
      );
    });

    supabase
      .from("notes")
      .update({ pinned: nextPinned })
      .eq("id", id)
      .eq("user_id", userId)
      .then(({ error }) => {
        if (error) {
          console.error("Supabase: failed to update pin:", error.message);
        }
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

    supabase
      .from("notes")
      .update({ color })
      .eq("id", id)
      .eq("user_id", userId)
      .then(({ error }) => {
        if (error) {
          console.error("Supabase: failed to update color:", error.message);
        }
      });
  }
  function handleLogout() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("user");

  setUser(null);
  setIsLoggedIn(false);
}
  async function fetchNotes() {
  if (!userId) {
    setNotes([]);
    setLoading(false);
    return;
  }

  setLoading(true);

  try {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (error) throw error;

    setNotes((data || []).map(mapRowToNote));
  } catch (err) {
    console.error("Supabase: failed to load notes:", err.message);
    setNotes([]);
  } finally {
    setLoading(false);
  }
}
async function fetchArchive() {
  if (!userId) {
    setArchive([]);
    return;
  }

  try {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "archive")
      .order("created_at", { ascending: false });

    if (error) throw error;

    setArchive((data || []).map(mapRowToNote));
  } catch (err) {
    console.error("Supabase: failed to load archive:", err.message);
    setArchive([]);
  }
}
async function fetchTrash() {
  if (!userId) {
    setTrash([]);
    return;
  }

  try {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "trash")
      .order("created_at", { ascending: false });

    if (error) throw error;

    setTrash((data || []).map(mapRowToNote));
  } catch (err) {
    console.error("Supabase: failed to load trash:", err.message);
    setTrash([]);
  }
}

  // Load active notes from Supabase whenever the logged-in user changes.
  useEffect(() => {
    let isCancelled = false;

    
fetchNotes();
    return () => {
      isCancelled = true;
    };
  }, [userId]);

 useEffect(() => {
  fetchArchive();
}, [userId]);

useEffect(() => {
  fetchTrash();
}, [userId]);
  // Save Trash
  useEffect(() => {
    if (skipTrashSaveRef.current) {
      skipTrashSaveRef.current = false;
      return;
    }

    localStorage.setItem(`trash_${currentUserEmail}`, JSON.stringify(trash));
  }, [trash, currentUserEmail]);

  // Save Archive
  // useEffect(() => {
  //   if (skipArchiveSaveRef.current) {
  //     skipArchiveSaveRef.current = false;
  //     return;
  //   }

  //   localStorage.setItem(`archive_${currentUserEmail}`, JSON.stringify(archive));
  // }, [archive, currentUserEmail]);

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

    supabase
      .from("notes")
      .update({ notified: true })
      .eq("id", note.id)
      .eq("user_id", userId)
      .then(({ error }) => {
        if (error) {
          console.error(
            "Supabase: failed to mark note as notified:",
            error.message
          );
        }
      });
  }
});
  }, 1000);

  return () => clearInterval(interval);
}, [notes, userId]);
  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const keyword = search.toLowerCase();

      return (
        note.title.toLowerCase().includes(keyword) ||
        note.content.toLowerCase().includes(keyword)
      );
    });
  }, [notes, search]);
 

useEffect(() => {
  localStorage.setItem(
    "isLoggedIn",
    JSON.stringify(isLoggedIn)
  );
}, [isLoggedIn]);
if (!isLoggedIn) {
  return showSignup ? (
    <Signup
      onLogin={() => {
        setUser(JSON.parse(localStorage.getItem("user")));
        setIsLoggedIn(true);
      }}
      goToLogin={() => setShowSignup(false)}
    />
  ) : (
    <Login
      onLogin={() => {
        setUser(JSON.parse(localStorage.getItem("user")));
        setIsLoggedIn(true);
      }}
      goToSignup={() => setShowSignup(true)}
    />
  );
}

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
  onLogout={handleLogout}
  user={user}
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

              {loading ? (
  <div className="flex justify-center items-center py-20">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
      <p
        className={`text-sm ${
          darkMode ? "text-gray-300" : "text-gray-600"
        }`}
      >
        Loading notes...
      </p>
    </div>
  </div>
) : (
  <div className="px-10 py-8 flex flex-wrap gap-6">
   {filteredNotes.length === 0 ? (
  <div className="w-full flex flex-col items-center justify-center py-20">
    <div className="text-7xl mb-4">📝</div>

    <h2
      className={`text-2xl font-bold ${
        darkMode ? "text-white" : "text-gray-700"
      }`}
    >
      No Notes Yet
    </h2>

    <p
      className={`mt-2 ${
        darkMode ? "text-gray-400" : "text-gray-500"
      }`}
    >
      Create your first note to get started!
    </p>
  </div>
) : (
  filteredNotes.map((note) => (
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
  ))
)}
  </div>
)}
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



