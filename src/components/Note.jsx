
import { useState } from "react";
  import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";import {
  FaTrash,
  FaEdit,
  FaSave,
  FaThumbtack,
  FaArchive,
  FaBell,
} from "react-icons/fa";

const colors=["bg-white","bg-yellow-200","bg-green-200","bg-blue-200","bg-pink-200","bg-purple-200"];

function Note({id,title,content,pinned,color,reminderDate,reminderTime,darkMode,onDelete,onArchive,onUpdate,onPin,onColor}){
const [isEditing,setIsEditing]=useState(false);
const [editedNote,setEditedNote]=useState({title,content,reminderDate,reminderTime});
const handleChange=e=>setEditedNote(p=>({...p,[e.target.name]:e.target.value}));
const saveNote=()=>{onUpdate(id,{...editedNote,pinned,color});setIsEditing(false);}
const cardClass=darkMode&&color==="bg-white"?"bg-gray-800 text-white":`${color} text-gray-900`;

return(
<div className={`${cardClass} group relative flex h-fit self-start w-full flex-col rounded-3xl p-5 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl sm:w-72`}>
<button onClick={()=>onPin(id)} className={`absolute right-4 top-4 text-lg transition ${pinned?"rotate-45 text-yellow-500":"text-gray-400 opacity-60 group-hover:opacity-100 hover:text-yellow-500"}`}><FaThumbtack/></button>

{isEditing?<>
<input name="title" value={editedNote.title} onChange={handleChange} className={`mb-3 w-full border-b bg-transparent pb-2 text-xl font-bold outline-none ${darkMode?"border-gray-600 text-white":"border-gray-300"}`}/>
<textarea name="content" rows={4} value={editedNote.content} onChange={handleChange} className={`w-full flex-1 resize-none bg-transparent outline-none ${darkMode?"text-white":"text-gray-800"}`}/>
<div className="mt-4 grid grid-cols-2 gap-3">

  <div>
    <label
      className={`mb-1 flex items-center gap-2 text-xs font-semibold ${
        darkMode ? "text-gray-300" : "text-gray-600"
      }`}
    >
      <FaBell className="text-yellow-500" />
      Date
    </label>

    <DatePicker
      selected={
        editedNote.reminderDate
          ? new Date(editedNote.reminderDate)
          : null
      }
      onChange={(date) =>
        setEditedNote((prev) => ({
          ...prev,
          reminderDate: date
            ? date.toISOString().split("T")[0]
            : "",
        }))
      }
      dateFormat="dd MMM yyyy"
      placeholderText="Select"
      className="w-full rounded-lg border px-3 py-2 text-sm"
    />
  </div>

  <div>
    <label
      className={`mb-1 flex items-center gap-2 text-xs font-semibold ${
        darkMode ? "text-gray-300" : "text-gray-600"
      }`}
    >
      <FaBell className="text-yellow-500" />
      Time
    </label>

    <DatePicker
      selected={
        editedNote.reminderTime
          ? new Date(`2000-01-01T${editedNote.reminderTime}`)
          : null
      }
      onChange={(time) =>
        setEditedNote((prev) => ({
          ...prev,
          reminderTime: time
            ? time.toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })
            : "",
        }))
      }
      showTimeSelect
      showTimeSelectOnly
      timeIntervals={5}
      dateFormat="h:mm aa"
      placeholderText="Select"
      className="w-full rounded-lg border px-3 py-2 text-sm"
    />
  </div>

</div>
</>:<>
{title&&<h2 className="mb-3 pr-8 text-xl font-bold break-words">{title}</h2>}
<p className={`flex-1 whitespace-pre-wrap break-words leading-6 ${darkMode&&color=="bg-white"?"text-gray-200":"text-gray-700"}`}>{content}</p>
{(reminderDate||reminderTime)&&<div className={`mt-5 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${darkMode?"bg-yellow-900/30 text-yellow-300":"bg-yellow-100 text-yellow-700"}`}><FaBell/><span>{reminderDate?new Date(reminderDate).toLocaleDateString("en-GB",{day:"numeric",month:"short"}):""}{reminderDate&&reminderTime?" • ":""}{reminderTime?new Date(`2000-01-01T${reminderTime}`).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"}):""}</span></div>}
</>}

<div className="mt-5 flex flex-wrap gap-2">
{colors.map(c=><button key={c} onClick={()=>onColor(id,c)} className={`${c} h-6 w-6 rounded-full border-2 transition hover:scale-110`}/>)}
</div>

<div className="mt-5 flex items-center justify-end gap-2 border-t border-black/10 pt-4">
<button onClick={()=>onArchive(id)} className="rounded-xl p-2 text-gray-500 transition hover:bg-blue-100 hover:text-blue-600"><FaArchive/></button>
<button onClick={()=>isEditing?saveNote():setIsEditing(true)} className="rounded-xl p-2 text-blue-600 transition hover:bg-blue-100">{isEditing?<FaSave/>:<FaEdit/>}</button>
<button onClick={()=>onDelete(id)} className="rounded-xl p-2 text-red-500 transition hover:bg-red-100"><FaTrash/></button>
</div>
</div>
)}
export default Note;
