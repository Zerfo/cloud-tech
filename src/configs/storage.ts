import multer from 'multer';

import { IRequest } from '../interfaces/vendors';

export const storageConfig = multer.diskStorage({
  destination: (req: IRequest, file, cb: Function) => {
    cb(null, 'uploads');
  },
  filename: (req: IRequest, file, cb: Function) => {
    cb(null, file.originalname);
  },
});
