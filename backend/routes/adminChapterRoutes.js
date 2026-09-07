import { Router } from "express";  
 import { createChapter, } from "../controllers/adminChapterController.js";  
 import { protect } from "../middleware/authMiddleware.js";  
 import { requireAdmin } from "../middleware/adminMiddleware.js";
 import upload from "../middleware/uploadMiddleware.js";  
 const router = Router();  
router.post( 
    "/chapter", protect, requireAdmin, upload.fields([ { 
        name: "explanationFiles", maxCount: 50, 
    }, { name: "video", maxCount: 1, },
     { name: "gameFiles", maxCount: 50, }, 
     { name: "quizFiles", maxCount: 50, }, 
    ]), createChapter );  
 export default router;  
