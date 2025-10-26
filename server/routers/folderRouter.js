const express = require("express");
const router = express.Router();
const { uploadFile, createFolder, deleteFile, deleteFolder } = require("../controllers/folderController");
const multer = require("multer");
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

//create a folder if the folder doesn't exist yet.
const fs = require('fs')
const uploadDir = "./public/uploads"
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const upload = multer({ dest: uploadDir });


router.post("/upload", upload.single('file'), uploadFile)
router.post("/delete", deleteFile)
router.post("/deleteFolder", deleteFolder)
router.post("/create", createFolder)
router.get("/check", async (req, res) => {
    try{
        if (req.isAuthenticated()){
            res.json({
                authenticated: true, 
                user: { id: req.user.id, username: req.user.username }});
        } else { 
            res.json({
                authenticated: false
            });
        }
    } catch (err){
        console.error('Error in /check route:', err);
        res.status(500).json({ 
            authenticated: false, 
            message: 'Server error' 
        });
    }});

router.get("/:id", async (req, res) => {
    try{
        if(!req.isAuthenticated()){
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const folderId = parseInt(req.params.id);
        const userId = req.user.id;

        let currentFolder = null;

        if (!isNaN(folderId)) {
            currentFolder = await prisma.folder.findUnique({
                where: { id: folderId },
                select: { id: true, name: true, parentId: true }
            });
        }

        const [folders, files] = await Promise.all([
            prisma.folder.findMany({
                where:{parentId: folderId,
                    userId
                }
            }),
            prisma.file.findMany({
                select: {
                    id: true,
                    filename: true,
                    originalFileName: true,
                    fileSize: true,
                },
                where: { 
                    folderId: folderId || null,
                    userId: userId
                }
            })
        ])
    res.json({ currentFolder, folders, files})
    } catch(err) {
        console.error('Error fetching folder contents:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
    });

module.exports = router;