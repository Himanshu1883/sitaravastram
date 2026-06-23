import { Router } from 'express';
import { ReturnRequest, toReturnDto } from '../../models/Return.js';
import { requireAdmin } from '../../middleware/auth.js';
import { ApiError } from '../../middleware/errorHandler.js';

const router = Router();
router.use(requireAdmin);

router.get('/', async (_req, res, next) => {
  try {
    const returns = await ReturnRequest.find().sort({ createdAt: -1 }).lean();
    res.json(returns.map(r => toReturnDto(r as never)));
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const ret = await ReturnRequest.findOneAndUpdate(
      { legacyId: req.params.id },
      { status: req.body.status },
      { new: true },
    );
    if (!ret) return next(new ApiError(404, 'Return request not found'));
    res.json(toReturnDto(ret));
  } catch (err) {
    next(err);
  }
});

export default router;
