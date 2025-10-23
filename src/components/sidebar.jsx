import NewFileButton from './newFileButton'
import NewFolderButton from './newFolderButton'

export default function Sidebar({folderId}){
    return(
        <>
            <aside class="w-64 min-h-screen bg-white border-r border-gray-300">
                    <div class="p-4 space-y-3">
                        <NewFolderButton folderId = {folderId}/>
                        <NewFileButton />
                    </div>
                    
                    <nav class="mt-2">
                        <a href="#" class="sidebar-link active-sidebar flex items-center px-4 py-2 text-blue-600 font-medium">
                            <i data-feather="hard-drive" class="mr-3"></i>
                            <span>My Drive</span>
                        </a>
                        <a href="#" class="sidebar-link flex items-center px-4 py-2 text-gray-700 hover:text-gray-900">
                            <i data-feather="star" class="mr-3"></i>
                            <span>Starred</span>
                        </a>
                        <a href="#" class="sidebar-link flex items-center px-4 py-2 text-gray-700 hover:text-gray-900">
                            <i data-feather="clock" class="mr-3"></i>
                            <span>Recent</span>
                        </a>
                        <a href="#" class="sidebar-link flex items-center px-4 py-2 text-gray-700 hover:text-gray-900">
                            <i data-feather="trash-2" class="mr-3"></i>
                            <span>Trash</span>
                        </a>
                    </nav>
            </aside>
        </>
    )
}