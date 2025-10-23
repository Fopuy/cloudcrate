import Nav from './nav'
import Sidebar from './sidebar'
import Main from './main'
import { useParams } from "react-router-dom";

export default function Index(){
    const { folderId } = useParams();

    return(
        <div className="bg-gray-50 min-h-screen">
            <Nav />
            <div className="flex">
                <Sidebar folderId={folderId || null}/>
                <Main folderId={folderId || null}/>
            </div>
        </div>
    )
}