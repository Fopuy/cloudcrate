const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();
const fs = require('fs')
const path = require('path')

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
    process.env.SUPABASE_URL,
    //process.env.SUPABASE_ANON_KEY,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

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
        const { originalname, size, buffer, mimetype } = req.file;
        const { folderId } = req.body;
        const userId = req.user.id;
        const filename = originalname;

        const { data, error } = await supabase.storage
            .from('cloudcrate_files')
            .upload(folderId ? `${folderId}/${originalname}` : originalname, buffer, {
                cacheControl: '3600',
                upsert: false,
                contentType: mimetype
            });

        await prisma.file.create({
            data: {
                filename,
                originalFileName: originalname,
                fileSize: size,
                userId,
                folderId: folderId ? parseInt(folderId) : null
            }
        })
        if (error) {
            console.error('Supabase upload error:', error);
            return res.status(400).json({ success: false, error: error.message });
        }
        res.json({success: true, filename: originalname, data})
    } catch (err) {
        console.error('Error uploading file', err);
        res.status(500).send("Error uploading file");
    }
}

const deleteFile = async (req, res) => {
    try {
        const { fileId, folderId, originalname } = req.body;
        const id = parseInt(fileId);
        const userId = req.user.id;
        const file = await prisma.file.findUnique({ where: { id } });
            if (!file || file.userId !== userId) {
                return res.status(403).json({ success: false, message: "Unauthorized" });
            }

        const filePath = folderId ? `${folderId}/${originalname}` : originalname;
        const { data, error } = await supabase.storage
            .from('cloudcrate_files')
            .remove([filePath]);
        
        await prisma.file.delete({
            where: { 
                id: id,
            },
        })
        console.log(folderId, originalname)
        res.json({success: true, message: "File deleted", data})
    } catch (err){
        console.error("Error deleting file:", err);
        res.status(500).send("Error deleting file");
    }
}

const deleteFolder = async (req, res) => {
    try {
        const { folderId } = req.body;
        const id = parseInt(folderId);
        const userId = req.user.id;

        const folder = await prisma.folder.findUnique({ where: { id } });
            if (!folder || folder.userId !== userId) {
                return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        await prisma.folder.delete({
        where: { id },
        });

        res.json({success: true, message: "Folder and contents deleted"})
    }catch(err){
        console.log(err);
    }
}

module.exports = { uploadFile, createFolder, deleteFile, deleteFolder}