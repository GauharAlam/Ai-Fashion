const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  outfit: {
    styleTitle: { type: String, required: true },
    outfitDescription: { type: String, required: true },
    colorPalette: [{
      name: { type: String, required: true },
      hex: { type: String, required: true }
    }],
    occasionFit: [String],
    accessories: [String],
    imagePrompt: { type: String, required: true },
    imageUrl: { type: String } // Add this line
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('History', HistorySchema);