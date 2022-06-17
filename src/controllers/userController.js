const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserModal = require('../models/userModel');

exports.signIn = async (req, res) => {
	const {email} = req.body;
	try {
		const existingUser = await UserModal.findOne({email});
		if (!existingUser)
			return res.status(404).json({status: false, message: "User doesn't exist"});

		const payload = {
			id: existingUser._id,
			email: existingUser.email,
			orgId: existingUser.orgId,
		};
		const token = jwt.sign(payload, process.env.JWT_PRIVATE_KEY, {
			expiresIn: '24h',
		});

		res.status(200).json({
			staus: true,
			message: 'Service 1 Sign In Success',
			token: token,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({status: false, message: 'Something went wrong'});
	}
};

exports.signUp = async (req, res) => {
	const {email, password, userName, orgId} = req.body;

	if (!email || !password || !userName) {
		return res.status(400).json({
			status: false,
			message: 'userName, email, password, orgId required',
		});
	}

	try {
		const existingUser = await UserModal.findOne({email});
		if (existingUser)
			return res.status(400).json({status: false, message: 'User already exists'});

		const hashedPassword = await bcrypt.hash(password, 12);
		const newUser = await UserModal.create({
			email: email,
			password: hashedPassword,
			userName: userName,
			orgId: orgId,
		});

		const payload = {
			id: newUser._id,
			email: newUser.email,
			orgId: newUser.orgId,
		};

		const token = jwt.sign(payload, process.env.JWT_PRIVATE_KEY, {
			expiresIn: '1h',
		});

		res.status(201).json({
			status: true,
			message: 'Service 1 Sign Up success',
			token: token,
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
	res.status(200).json({status: true, data: req.user});
};
