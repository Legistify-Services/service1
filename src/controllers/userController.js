const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserModal = require('../models/userModel');

exports.signIn = async (req, res) => {
	console.log(req.cookies)
	console.log(req.cookies.refreshToken);
	if (!req.cookies || !req.cookies.refreshToken) {
		return res.status(400).send({status: false, code: 400, msg: "No refresh token" });
	}
	try {
		let refreshToken = req.cookies.refreshToken;
		console.log(refreshToken)
		const decodedTokenData = jwt.verify(refreshToken, process.env.JWT_PRIVATE_KEY_FOR_AUTH_BACKEND);

		if(!decodedTokenData) return res.status(500).send({ status: false, code: 400, msg: "invalid token" });
		console.log(decodedTokenData)
		const userData = decodedTokenData

		const existingUser = await UserModal.findOne({email: userData.email});
		console.log(existingUser,"existingUser")
		if (!existingUser)
			return res.status(404).send({status: false, message: "User doesn't exist"});

		const payload = {
			id: existingUser._id,
			email: existingUser.email,
			orgId: existingUser.orgId,
			service: "service1"
		};
		const token = jwt.sign(payload, process.env.JWT_PRIVATE_KEY, {
			expiresIn: '24h',
		});

		res.status(200).send({
			staus: true,
			message: 'Service 1 Sign In Success',
			token: token,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).send({status: false, message: 'Something went wrong'});
	}
};

exports.signUp = async (req, res) => {
	const {email, password, userName, orgId} = req.body;

	if (!email || !password || !userName) {
		return res.status(400).send({
			status: false,
			message: 'userName, email, password, orgId required',
		});
	}

	try {
		const existingUser = await UserModal.findOne({email});
		if (existingUser)
			return res.status(400).send({status: false, message: 'User already exists'});

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

		res.status(201).send({
			status: true,
			message: 'Service 1 Sign Up success',
			token: token,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).send({
			status: false,
			message: 'Something went wrong',
		});
	}
};

exports.findRole = async (req, res) => {
	res.status(200).send({status: true, data: req.user});
};
