const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const User = require('../models/user');

const getUsers = async(req, res, next) => {

  let users;

  try {
    users = await User.find({}, '-password');
  }
  catch (err) {
    const error = new HttpError('Getting users failed, please try again later.', 500);
    return next(error);
  }

  res.json({users: users.map(user => user.toObject({getters: true}))});
  
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed, please check your data.', 422));
  }
  const { name, email, password } = req.body;

  let existingUsers;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError('Signing up failed, please try again later.', 500);
    return next(error);
  }
  if (existingUser) {
    const error = new HttpError('User already exists, please login instead.', 422);
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    image: 'https://scontent.fsjj1-1.fna.fbcdn.net/v/t39.30808-6/321957392_693435785762814_1336614374388040005_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=hz8cXqScI7EAX8ONQWs&_nc_ht=scontent.fsjj1-1.fna&oh=00_AfDvwa8rpypd-mNNP_Wvjr6B9A6-_P_bNlhsQexC19kyUA&oe=647E057B',
    password, 
    places: []
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError('Signing up failed, please try again.', 500);
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({getters: true}) });

};

const login = async(req, res, next) => {
  const { email, password } = req.body;

  let existingUsers;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError('Logging up failed, please try again later.', 500);
    return next(error);
  }
  
  if(!existingUser || existingUser.password !== password) {
    const error = new HttpError('Invalid credentials, please try again.', 401);
    return next(error);
  }
  
  res.json({ message: 'Logged in', user: existingUser.toObject({getters: true}) });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
