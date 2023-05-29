const router = require('express').Router();
const { HTTP_STATUS_NOT_FOUND } = require('http2').constants;

const userRouter = require('./users');
const cardRouter = require('./cards');

router.use(userRouter);
router.use(cardRouter);
router.use('/*', (req, res) => res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Страница не найдена' }));

module.exports = router;
