const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();
const fs = require('fs')
const path = require('path')

const createFolder = async (req, res) => {
    try {
        const { folderName, parentId } = req.body;
        if (!folderName) return res.status(400).json({ success: false, message: "Folder name required" });
        await prisma.folder.create({
            data: {
                name: folderName,
                parentId: parentId ? parseInt(parentId) : null,
                userId: req.user.id
            }
        })
        res.json({success: true});
    } catch (err) {
        console.error('Error creating Folder', err);
        res.status(500).send("Error creating folder");
    }
}

const uploadFile = async (req, res) => {
    try {
        const { filename, originalname, size } = req.file;
        const { folderId } = req.body;
        const userId = req.user.id;

        await prisma.file.create({
            data: {
                filename: filename,
                originalFileName: originalname,
                fileSize: size,
                userId,
                folderId: folderId ? parseInt(folderId) : null
            }
        })

        res.json({success: true, filename: originalname})
    } catch (err) {
        console.error('Error uploading file', err);
        res.status(500).send("Error uploading file");
    }
}

const deleteFile = async (req, res) => {
    try {
        const { folderId, fileId } = req.body;
        const id = parseInt(fileId);
        await prisma.file.delete({
            where: { 
                id: id,
            },
        })
        res.json({success: true, message: "File deleted"})
    } catch (err){
        console.log(err);
    }
}

const deleteFolder = async (req, res) => {
    try {
        const { folderId } = req.body;
       

        const id = parseInt(folderId);

        
        const folder = await prisma.folder.findUnique({
        where: { id },
        select: { parentId: true }
        });

        await prisma.folder.delete({
        where: { id },
        });

        res.json({success: true, message: "Folder and contents deleted"})
    }catch(err){
        console.log(err);
    }
}

module.exports = { uploadFile, createFolder, deleteFile, deleteFolder}