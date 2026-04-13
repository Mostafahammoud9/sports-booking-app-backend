const db = require('../config/db');
const bcrypt = require('bcrypt');

const registerUser = (req, res) => {
  const { full_name, email, password } = req.body;

  if (!full_name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required',
    });
  }

  const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';

  db.query(checkEmailQuery, [email], (err, results) => {
    if (err) {
      console.error('Error checking email:', err);
      return res.status(500).json({
        success: false,
        message: 'Database error',
      });
    }

    if (results.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists',
      });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const insertUserQuery =
      'INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)';

    db.query(insertUserQuery, [full_name, email, hashedPassword], (err, result) => {
      if (err) {
        console.error('Error inserting user:', err);
        return res.status(500).json({
          success: false,
          message: 'Database error',
        });
      }

      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user: {
          id: result.insertId,
          full_name,
          email,
        },
      });
    });
  });
};

const loginUser = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required',
    });
  }

  const getUserQuery = 'SELECT * FROM users WHERE email = ?';

  db.query(getUserQuery, [email], (err, results) => {
    if (err) {
      console.error('Error fetching user:', err);
      return res.status(500).json({
        success: false,
        message: 'Database error',
      });
    }

    if (results.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const user = results[0];
    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User logged in successfully',
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
      },
    });
  });
};

module.exports = {
    registerUser,
    loginUser,
};