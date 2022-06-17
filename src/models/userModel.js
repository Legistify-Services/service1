const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	userName: {
		type: String,
		trim: true,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		unique: true,
		required: [true, 'email required'],
	},
	orgId: {
		type: String,
		required: [true, 'orgId required'],
	},
});

module.exports = mongoose.model('User', userSchema);
