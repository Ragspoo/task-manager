import jwt from 'jsonwebtoken';
import User from '../models/User.js';

import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    const { password  } = req.body;

    const user = await User.findOne({ where: { name } });

    if (!user) {
      return res.status(401).json({ error: 'User does not exist.' });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Invalid password.' });
    }

    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      })
    });
  }
}

export default new SessionController();