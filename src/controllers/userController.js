const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserModal = require('../models/userModel');

exports.signIn = async (req, res) => {
	const {email} = req.body;
	try {
		const existingUser = await UserModal.findOne({email});
		if (!existingUser)
			return res.status(404).json({status: false, message: "User doesn't exist"});

		// const isPasswordCorrect = await bcrypt.compare(
		//   password,
		//   existingUser.password
		// );

		// if (!isPasswordCorrect)
		//   return res
		//     .status(401)
		//     .json({ status: false, message: "Invalid password" });

		const token = jwt.sign(
			{
				id: existingUser._id,
				email: existingUser.email,
			},
			process.env.JWT_PRIVATE_KEY,
			{
				expiresIn: '24h',
			}
		);

		res.status(200).json({
			staus: true,
			message: 'Sign In Success',
			result: {
				userName: existingUser.userName,
				email: existingUser.email,
			},
			token : token,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({status: false, message: 'Something went wrong'});
	}
};

exports.signUp = async (req, res) => {
	const {email, password, userName} = req.body;

	if (!email || !password || !userName) {
		return res.status(400).json({
			status: false,
			message: 'userName, email, password required',
		});
	}

	try {
		const existingUser = await UserModal.findOne({email});
		if (existingUser)
			return res.status(400).json({status: false, message: 'User already exists'});

		const hashedPassword = await bcrypt.hash(password, 12);
		const newUser = await UserModal.create({
			email,
			password: hashedPassword,
			userName: userName,
		});

		const token = jwt.sign(
			{id: newUser._id, email: newUser.email},
			process.env.JWT_PRIVATE_KEY,
			{
				expiresIn: '1h',
			}
		);

		res.status(201).json({
			status: true,
			data: {
				message: 'Sign Up success',
				user: {
					userName: newUser.userName,
					email: newUser.email,
				},
				'x-auth-token': token,
			},
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			status: false,
			message: 'Something went wrong',
		});
	}
};

exports.findRole = async (req, res) => {
	res.status(200).json({status: true, message: 'find role not set up yet...'});
};
