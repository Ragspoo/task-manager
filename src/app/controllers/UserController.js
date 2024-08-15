import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  async store(req, res) {

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed.' });
    }

    const userExists = await User.findOne({
      where: { name: req.body.name }
    });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    const { id, name } = await User.create(req.body);

    return res.json({
      id,
      name
    });
  }

  async update(req, res) {

    const schema = Yup.object().shape({
      name: Yup.string(),
      oldPassword: Yup.string().min(6),
      password: Yup.string().min(6).when('oldPassword', (oldPassword, field) =>
        oldPassword ? field.required() : field
      ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed.' });
    }

    const { oldPassword } = req.body;
    const user = await User.findByPk(req.userId);

    if (name !== user.name) {
      const userExists = await User.findOne({
        where: { name }
      });

      if (userExists) {
        return res.status(400).json({ error: 'User already exists.' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Invalid password.' });
    }

    const { id, name } = await user.update(req.body);

    return res.json({
      id,
      name
    });
  }
}

export default new UserController();