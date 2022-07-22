const mongoose = require('mongoose');

const EntrySchema = mongoose.Schema({
	custName: {
		type: String,
		required: true
	},
	entryNo: {
		type: String,
		required: true
	},
	entryStatus: {
		type: String,
		required: true
	},
	entryDate: {
		type: Date
	}
});

module.exports = mongoose.model('Entry', EntrySchema);