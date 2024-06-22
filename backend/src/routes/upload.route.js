import Router from 'express'

import { verifyJWT } from '../middlewares/auth.middleware.js'
import { uploadDocuments, getDocuments } from '../controllers/upload.controller.js'
import {upload} from '../middlewares/multer.middleware.js'

const router = Router()

router.route('/submit').post(verifyJWT, upload.fields([
    {
        name: "file",
        maxCount: 1
    }
]),
uploadDocuments)

router.route('/list').post(verifyJWT, getDocuments)

export default router