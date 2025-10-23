const express = require("express");
const router = express.Router();
const { uploadFile, createFolder, deleteFile, deleteFolder } = require("../controllers/folderController");
const multer = require("multer");
const upload = multer({ dest: "./public/uploads" });
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

router.post("/upload", upload.single('file'), uploadFile)
router.post("/delete", deleteFile)
router.post("/deleteFolder", deleteFolder)
router.post("/create", createFolder)
router.get("/check", async (req, res) => {
    if (req.isAuthenticated()){
        res.json({authenticated: true, user: { id: req.user.id, username: req.user.username }});
    } else { 
        res.json({authenticated: false});
    }
});
router.get("/:id", async (req, res) => {
    const folderId = parseInt(req.params.id);
    const userId = req.user.id;
    let currentFolder = null;
    if (!isNaN(folderId)) {
        currentFolder = await prisma.folder.findUnique({
            where: { id: folderId },
            select: { id: true, name: true, parentId: true }
        });
    }
    const folders = await prisma.folder.findMany({
        where:{ parentId: folderId,
            userId: userId
         }
    })
    const files = await prisma.file.findMany({
        select: { 
            id: true,
            filename: true,
            originalFileName: true,
            fileSize: true,
            uploadedAt: true,
        },
        where: { 
            folderId: folderId || null,
            userId: userId
        }
    })
    res.json({ currentFolder, folders, files})
});



module.exports = router;