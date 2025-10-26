import feather from "feather-icons";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom"

export default function Main({folderId}){
    const [files, setFiles] = useState([])
    const [folders, setFolders] = useState([])
    const [loading, setLoading] = useState(true);
    const [currentFolder, setCurrentFolder]=useState(null)
    const navigate = useNavigate();

    const [activeMenu, setActiveMenu] = useState(null);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

    useEffect(() => {
    
    const handleClickOutside = (e) => {
        if (!e.target.closest(".menu-container")) setActiveMenu(null);
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const handleMenuToggle = (file, e) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX - 100,
    });

    
    setActiveMenu((prev) => (prev?.id === file.id ? null : file));
    };

    const handleRename = (file) => {
        console.log("Rename", file);
        setActiveMenu(null);
    };

    const handleDelete = async (file) => {
    try {
        const res = await fetch("http://localhost:3000/api/index/delete", {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            fileId: file.id,
            parentId: folderId || null,
        }),
        credentials: "include",
        });

        const data = await res.json();

        if (res.ok) {
        alert(`File "${file.originalFileName}" deleted.`);
        
        setFiles((prev) => prev.filter((f) => f.id !== file.id));
        } else {
        alert(data.message || "Delete failed.");
        }
    } catch (err) {
        console.error(err);
        alert("Error deleting file (React).");
    }
    setActiveMenu(null);
    };

    const handleDeleteFolder = async (folder) => {
    try {
        const confirmDelete = confirm(`Are you sure you want to delete the folder "${folder.name}"?`);
        if (!confirmDelete) return;

        const res = await fetch("http://localhost:3000/api/index/deleteFolder", {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            folderId: folder.id,
            parentId: folderId || null,
        }),
        credentials: "include",
        });

        const data = await res.json();

        if (res.ok) {
        alert(`Folder "${folder.name}" deleted.`);
        
        setFolders((prev) => prev.filter((f) => f.id !== folder.id));
        } else {
        alert(data.message || "Delete failed.");
        }
    } catch (err) {
        console.error(err);
        alert("Error deleting folder (React).");
    }

    setActiveMenu(null);
    };

    const handleMove = (file) => {
        console.log("Move", file);
        setActiveMenu(null);
    };

    useEffect(() => {
        feather.replace();
    }, [files]);

    useEffect(() => {
    const fetchFolderContents = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/index/${folderId}`, {
        credentials: "include",});
        const data = await res.json();

        setFolders(data.folders || []);
        setFiles(data.files || []);
        setCurrentFolder(data.currentFolder || null);
      } catch (err) {
        console.error("Error loading folder contents:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFolderContents();
    }, [folderId]);
    if (loading) return <p className="text-gray-500">Loading...</p>

    const handleFolderClick = (id) => {
        navigate(`/folder/${id}`)
    }

    const handleBack = async () =>{
        if (!currentFolder || !currentFolder.parentId) {
            navigate("/index"); 
        } else {
            navigate(`/folder/${currentFolder.parentId}`);
        }
    }

    return(
        <>
        <main className="flex-1 p-6">
            {currentFolder && (
                <button
                    onClick={handleBack}
                    className="flex items-center px-3 py-1 rounded hover:bg-gray-100 text-gray-700 mb-4 cursor-pointer"
                >
                    <i data-feather="arrow-left" className="mr-2"></i>
                    Back
                </button>
            )}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">My Drive</h2>
                <div class="flex space-x-2">
                    <button class="p-2 rounded-full hover:bg-gray-100">
                        <i data-feather="grid"></i>
                    </button>
                    <button class="p-2 rounded-full bg-gray-100">
                        <i data-feather="list"></i>
                    </button>
                    <button class="p-2 rounded-full hover:bg-gray-100">
                            <i data-feather="settings"></i>
                    </button>
                </div>
            </div>
            <div class="bg-white rounded-lg border border-gray-400 overflow-hidden">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modified</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        {folders.length === 0 && files.length === 0 && (
                        <tr>
                            <td colSpan="4" className="text-center py-6 text-gray-500">
                                No files or folders found.
                            </td>
                        </tr>
                        )}
                        {folders.map((folder)=> (
                            <tr key={folder.id} 
                                className="hover:bg-gray-50 cursor-pointer "
                                onClick={()=>handleFolderClick(folder.id)}>
                                <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center">
                                    <div class="flex-shrink-0 text-blue-500"></div>
                                    <i data-feather="folder" ></i>
                                <div class="ml-4">
                                    <div class="text-sm font-medium text-gray-900">{folder.name}</div>
                                </div>
                                </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(folder.uploadedAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <span>-</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <button
                                        onClick={(e) => handleMenuToggle(folder, e)}
                                        class="text-gray-500 hover:text-gray-700 cursor-pointer"><i data-feather="more-vertical"></i>
                                    </button>
                                </td>
                            </tr>
                        ))} 
                        {files.map((file)=> (
                            <tr key={file.id} className="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center">
                                    <div class="flex-shrink-0 text-blue-500"></div>
                                    <i data-feather="file" ></i>
                                <div class="ml-4">
                                    <div class="text-sm font-medium text-gray-900">{file.originalFileName}</div>
                                </div>
                                </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(file.uploadedAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {(file.fileSize / (1024 * 1024)).toFixed(2)} MB
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <button class="text-blue-500 hover:text-blue-700 mr-2">
                                        <a 
                                        href={`http://localhost:3000/uploads/${file.filename}`}
                                        download={file.originalFileName}>
                                        <i data-feather="download"></i></a></button>
                                    <button
                                        onClick={(e) => handleMenuToggle(file, e)}
                                        class="text-gray-500 hover:text-gray-700 cursor-pointer"><i data-feather="more-vertical"></i>
                                    </button>

                                </td>
                            </tr>
                        ))} 
                    </tbody>
                </table>

                
                    {activeMenu && (
                    <div
                        className="absolute z-50 w-36 bg-white border border-gray-200 shadow-lg rounded-md animate-fadeIn"
                        style={{
                        position: "absolute", 
                        top: `${menuPosition.top}px`, 
                        left: `${menuPosition.left}px`, 
                        }}
                    >
                        
                        <button
                        onClick={() => handleRename(activeMenu)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                        Rename
                        </button>
                        <button
                        onClick={() => {
                            if (activeMenu.originalFileName) {
                            
                            handleDelete(activeMenu);
                            } else {
                            
                            handleDeleteFolder(activeMenu);
                            }
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                        Delete
                        </button>
                        <button
                        onClick={() => handleMove(activeMenu)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                        Move
                        </button>
                    </div>
                )}

            </div>
        </main>
        </>
    )
}