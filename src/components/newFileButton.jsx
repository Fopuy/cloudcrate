import { useRef } from 'react'
import { useParams } from "react-router-dom";
import supabase from './supabaseClient' //supabase

export default function NewFileButton(){
    const fileInputRef = useRef(null);
    const { folderId } = useParams(); 

    const handleNewFileClick = () => {
        fileInputRef.current.click();
    };

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);
        if (folderId) formData.append("folderId", folderId);

        try{
            const res = await fetch("http://localhost:3000/api/index/upload", {
                method: "POST",
                body: formData,
                credentials: "include"
            })
            const data = await res.json();

            if (res.ok) {
                alert(`File "${file.name}" uploaded successfully!`);
            } else {
                alert(data.message || "Upload failed");
            }
        } catch (err) {
        console.error(err);
        alert("Error uploading file(frontend)");
        }
        e.target.value = null;
    }

    return(
        <>
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileSelect}
            />
            <button 
                onClick={handleNewFileClick}
                className="w-full flex items-center justify-center space-x-2 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition">
                <i data-feather="plus"></i>
                <span>New File</span>
            </button>
        </>
    )
}