const mongoose = require("mongoose");

const especialistaSchema = new mongoose.Schema({
  ubicacion: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
        type: [Number],
        required: true
    }
  },
});

especialistaSchema.index({ ubicacion: '2dsphere'});

module.exports = mongoose.model("Especialista", especialistaSchema);