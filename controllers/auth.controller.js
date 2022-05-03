const bcrypt = require('bcrypt');

const User = require('../models/user.model');

const cache = require('../utils/cache');
const jwt = require('../utils/jwt');

const jwtConfig = require('../config/jwt');

exports.register = async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  await User.sync();

  const user = await User.create({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    password: hashedPassword,
    role: req.body.role,
    username: req.body.username,
  });

  return res.json(user);
}

exports.login = async (req, res) => {
  await User.sync();

  const user = await User.findOne({
    where: {
      username: req.body.username
    }
  });

  if (user) {
    const isMatched = await bcrypt.compare(req.body.password, user.password);
    if (isMatched) {
      const token = await jwt.createToken({ id: user.id });
      return res.json({
        access_token: token,
        token_type: 'Bearer',
        expires_in: jwtConfig.ttl
      });
    }
  }

  return res.status(401).json({ error: 'Unauthorized' });
}

exports.getUser = async (req, res) => {
  await User.sync();

  const user = await User.findByPk(req.user.id);
  return res.json(user);
}

exports.logout = async (req, res) => {
  const token = req.token;
  const now = new Date();
  const expire = new Date(req.user.exp);
  const milliseconds = now.getTime() - expire.getTime();
  /* ----------------------------- BlackList Token ---------------------------- */
  await cache.set(token, token, milliseconds);

  return res.json({ message: 'Logged out successfully' });
}
