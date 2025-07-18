import { Router } from 'express';
import { accessTokenMiddleware } from '../middlewares/accesTokenMiddleware.js';
import { getTodos, createTodo, deleteTodo, updateTodo } from '../controllers/todosController.js';

const router = Router();


router.use(accessTokenMiddleware);

router.get('/', getTodos);
router.post('/', createTodo);
router.put('/:id', updateTodo);
router.delete('/:id', deleteTodo);

export default router;