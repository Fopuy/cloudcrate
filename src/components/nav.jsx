export default function Nav(){
    const handleLogout = async (e) => {
        try {
            const res = await fetch("http://localhost:3000/api/logout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            });
            
            if (res.ok) {
            alert("Logout successful!");
            window.location.href = "/login";
            } else {
            alert("Logout failed");
            }
        } catch (err) {
            console.error(err);
            alert("Error connecting to server");
        }
    }
    return(
        <>
            <header className="bg-white shadow-sm">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center space-x-2">
                        <div className="text-blue-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 12a9 9 0 0 0-9-9 9 9 0 0 0-9 9 9 9 0 0 0 9 9 9 9 0 0 0 9-9z"></path>
                                <path d="M12 3v18"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                        </div>
                        <h1 className="text-xl font-bold text-gray-800">CloudCrate</h1>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        <button className="p-2 rounded-full hover:bg-gray-100">
                            <i data-feather="bell"></i>
                        </button>
                        <button className="p-2 rounded-full hover:bg-gray-100">
                            <i data-feather="help-circle"></i>
                        </button>
                        <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                            U
                        </div>
                        <button onClick = {handleLogout} className="text-gray-600 hover:text-gray-800">Logout</button>
                    </div>
                </div>
            </header>
        </>
    )
}