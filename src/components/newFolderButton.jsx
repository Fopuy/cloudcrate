import { useRef, useState } from 'react'

export default function NewFolderButton ({folderId}){
    const [folderName, setFolderName] = useState ('')
    const API_BASE = import.meta.env.VITE_API_BASE_URL;

    const folderInputRef = useRef(null);

    const handleNewFolderClick = () => {
        if(document.getElementById("newFolder").style.display === "block"){
            document.getElementById("newFolder").style.display = "none"
        } else {document.getElementById("newFolder").style.display = "block";}

        folderInputRef.current.click();
    };

    const handleCreateFolder = async (e) => {
        try{
            e.preventDefault();
            const res = await fetch(`${API_BASE}/api/index/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    folderName: folderName,
                    parentId: folderId || null})
            })
            const data = await res.json();

            if (res.ok) {
                alert(`Folder "${folderName}" uploaded successfully!`);
                document.getElementById("newFolder").style.display = "none";
            } else {
                alert(data.message || "Folder creation failed.");
            }
        } catch (err) {
        console.error(err);
        alert("Error creating folder(frontend)");
        }
        e.target.value = null;
    }
    return(
        <>
            <button 
                onClick={handleNewFolderClick}
                className="w-full flex items-center justify-center space-x-2 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
            >
                <i data-feather="plus"></i>
                <span>New Folder</span>
            </button>
            <div
            id="newFolder"
            className="hidden mt-4 p-4 rounded-xl border border-gray-200 shadow-md bg-white w-full max-w-sm mx-auto transition-all duration-300"
            >
            <p className="text-gray-700 font-medium mb-2">Enter folder name:</p>
            <form className="flex flex-col space-y-3">
                <input
                type="text"
                ref={folderInputRef}
                onChange={(e) => setFolderName(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                placeholder="e.g. Project Files"
                />
                <button
                onClick={handleCreateFolder}
                className="flex items-center justify-center space-x-2 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition font-medium"
                >
                <i data-feather="file"></i>
                <span>Create</span>
                </button>
            </form>
            </div>
        </>
    )
}