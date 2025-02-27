import mongoose from 'mongoose';

const FundingSchema = new mongoose.Schema({
    startupId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    investorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    equity: { type: Number, required: true },
    status: { type: String, enum: ["proposed", "reviewing", "accepted", "rejected"], default: "proposed" },
    notes: { type: String }
}, { timestamps: true }); 

export default mongoose.model('Funding', FundingSchema);
