const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const DealSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  description: { type: String },
  budget: { type: Number },
  startedAt: {
    type: Date,
    default: Date.now(),
  },
  endAt: {
    type: Date,
  },
  client: { type: Schema.Types.ObjectId },
  serviceProvider: { type: Schema.Types.ObjectId },
  status: {
    type: Boolean,
    default: false,
  },
});

const Deal = model("Deal", DealSchema);

module.exports = Deal;
