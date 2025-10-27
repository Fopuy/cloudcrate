import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login (){
    const [username, setUsername ] = useState("")
    const [password, setPassword ] = useState("")
    //const [auth, setAuth] = useState(false)
    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:3000/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (data.success) {
            navigate("/index");
            } else {
            alert(data.message || "Login failed");
            }
        } catch (err) {
            console.error(err);
            alert("Error connecting to server");
        }
    }

    return (
        <>
        <div className="min-h-screen flex flex-col justify-center items-center">
            <form className="flex flex-col border border-gray-200 rounded-2xl shadow-xl p-5" onSubmit={handleSubmit}>
                <h1 className="text-lg text-center"> Welcome </h1>
                <h2 className="text-sm text-gray-500 mb-5 text-center">Sign in to access your files</h2>
                <label htmlFor="username" className="block text-md font-medium text-gray-700 mb-2">Username: </label>
                    <input 
                        className="input-field mb-2 pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 transition duration-200" 
                        type="text" 
                        name="username" 
                        placeholder="Enter username"
                        value={username} 
                        onChange={(e)=>setUsername(e.target.value)}
                        required
                    />
                <label for="password" className="block text-md font-medium text-gray-700 mb-2">Password: </label>
                    <input 
                        className="input-field mb-2 pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 transition duration-200" 
                        type="password" 
                        name="password" 
                        placeholder="••••••••" 
                        value={password}
                        onChange={(e)=>{setPassword(e.target.value)}}
                        required 
                    />
                    <button
                        type="submit"
                        className="w-full mt-3 flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-100">
                            Login
                    </button>
            </form>
        </div>
        </>
    )
}