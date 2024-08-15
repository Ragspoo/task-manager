import Task from '../models/Task';
import * as Yup from 'yup';

class TaskController {

  async index(req, res) {
    const tasks = await Task.findAll({
      where: { user_id: req.userId, check: false },
    });

    return res.json(tasks);
  }

  async store(req, res) {

    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      status: Yup.string().required(),
      priority: Yup.string().required(),
      due_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Failed to register.' });
    }

    const { title, description, status, priority, due_date } = req.body;

    const tasks = await Task.create({
      user_id: req.userId,
      title,
      description,
      status,
      priority,
      due_date
    });

    return res.json(tasks);
  }

  async update(req, res) {

    const { task_id } = req.params;
    const task = await Task.findByPk(task_id);

    if (!task) {
      return res.status(400).json({ error: 'Task does not exist.' });
    }

    await task.update(req.body);

    return res.json(task);
  }

  async delete(req, res) {
    const { task_id } = req.params;
    const task = await Task.findByPk(task_id);

    if (!task) {
      return res.status(400).json({ error: 'Task does not exist.' });
    }

    if (task.user_id !== req.userId) {
      return res.status(401).json({ error: 'Unauthorized request.' });
    }

    await task.destroy();

    return res.send();
  }
}

export default new TaskController();