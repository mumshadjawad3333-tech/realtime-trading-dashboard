import { Router } from 'express';
import { getTickers, getTickerHistory } from '../controllers/tickerController';
import { authGuard } from '../middleware/auth';
const router = Router();
router.use(authGuard);

router.get('/', getTickers);
router.get('/:symbol/history', getTickerHistory);

export default router;