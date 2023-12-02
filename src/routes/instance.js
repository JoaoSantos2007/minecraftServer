import { Router } from 'express';
import InstanceController from '../controller/Instance.js';
import InstanceMiddleware from '../middlewares/Instance.js';
import { bedrockUpload } from '../middlewares/World.js';

const router = Router();

router
  .get('/instance', InstanceController.readAll)
  .get('/instance/:id', InstanceController.readOne)
  .post('/instance', InstanceController.create)
  .put('/instance/:id', InstanceMiddleware.verifyInProgress, InstanceController.update)
  .delete('/instance/:id', InstanceMiddleware.verifyInProgress, InstanceController.delete)
  .post('/instance/run/:id', InstanceMiddleware.verifyInProgress, InstanceController.run)
  .post('/instance/stop/:id', InstanceController.stop)
  .get('/instance/world/:id', InstanceMiddleware.verifyInProgress, InstanceController.downloadWorld)
  .post('/instance/world/:id', InstanceMiddleware.verifyInProgress, bedrockUpload.single('world'), InstanceController.uploadWorld);

export default router;
