const mongoose = require('mongoose');

const { Schema } = mongoose;

const connectionSchema = new Schema(
  {
    name: { type: String, required: [true, 'Name is required'] },
    topic: { type: String, required: [true, 'Topic is required'] },
    date: { type: Date, required: [true, 'Date is required'] },
    startTime: { type: String, required: [true, 'Start time is required'] },
    endTime: { type: String, required: [true, 'End time is required'] },
    location: { type: String, required: [true, 'Location is required'] },
    details: {
      type: String,
      required: [true, 'Details are required'],
      minlength: [10, 'the content should have at least 10 characters'],
    },
    image: { type: String, required: [true, 'Image is required'] },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

// collection name is connections in the database
module.exports = mongoose.model('Connection', connectionSchema);
