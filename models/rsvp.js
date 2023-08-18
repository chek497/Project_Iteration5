const mongoose = require('mongoose');

const { Schema } = mongoose;

const rsvpSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  connectionId: { type: Schema.Types.ObjectId, ref: 'Connection' },
  status: { type: String, enum: ['Yes', 'No', 'Maybe'] },
  topic: { type: String },
  name: { type: String },
});

module.exports = mongoose.model('RSVP', rsvpSchema);
