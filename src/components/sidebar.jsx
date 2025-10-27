import NewFileButton from './newFileButton'
import NewFolderButton from './newFolderButton'

export default function Sidebar({folderId, fetchFolderContents}){
    return(
        <>
            <aside className="w-64 min-h-screen bg-white border-r border-gray-300">
                    <div className="p-4 space-y-3">
                        <NewFolderButton folderId = {folderId} />
                        <NewFileButton />
                    </div>
                    
                    <nav className="mt-2">
                        <a href="#" className="sidebar-link active-sidebar flex items-center px-4 py-2 text-blue-600 font-medium">
                            <i data-feather="hard-drive" className="mr-3"></i>
                            <span>My Drive</span>
                        </a>
                        <a href="#" className="sidebar-link flex items-center px-4 py-2 text-gray-700 hover:text-gray-900">
                            <i data-feather="star" className="mr-3"></i>
                            <span>Starred</span>
                        </a>
                        <a href="#" className="sidebar-link flex items-center px-4 py-2 text-gray-700 hover:text-gray-900">
                            <i data-feather="clock" className="mr-3"></i>
                            <span>Recent</span>
                        </a>
                        <a href="#" className="sidebar-link flex items-center px-4 py-2 text-gray-700 hover:text-gray-900">
                            <i data-feather="trash-2" className="mr-3"></i>
                            <span>Trash</span>
                        </a>
                    </nav>
            </aside>
        </>
    )
}