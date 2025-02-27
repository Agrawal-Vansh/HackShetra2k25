import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional for Google Auth
    userType: { type: String, enum: ["startup", "investor"], required: true },
    name: { type: String, required: true },
    profilePhoto: { type: String }, // For Google Auth profile picture

    // Startup-specific fields (Required only if userType is "startup")
    companyInfo: {
        name: { type: String, required: function() { return this.userType === "startup"; } },
        description: { type: String, required: function() { return this.userType === "startup"; } },
        logo: { type: String },
        industry: { 
            type: String, 
            enum: ["Tech", "Healthcare", "Finance", "E-commerce", "AI", "Blockchain", "EdTech", "Other"], 
            required: function() { return this.userType === "startup"; } 
        },
        foundingDate: { type: Date },
        location: { type: String },
        website: { type: String },
    },
    funding: {
        stage: { 
            type: String, 
            enum: ["Pre-seed", "Seed", "Series A", "Series B", "Series C", "Other"] ,
            required: function() { return this.userType === "startup"; } 
        },
        amountNeeded: 
        { type: Number, 
          required: function() { return this.userType === "startup"; } 
        },
        equityOffering: 
        { type: Number,
          required: function() { return this.userType === "startup"; }  
        },
      
    },
    metrics: {
        revenue: 
        { 
            type: Number ,
            default:0,
        },
        users: 
        { type: Number,
            default:0 
        },
        growth: { 
            type: Number,
            default:0  }
    },

    // Investor-specific fields (Required only if userType is "investor")
    investorInfo: {
        firmName: { type: String, required: function() { return this.userType === "investor"; } },
        logo: { type: String },
        description: { type: String },
        website: { type: String },
        location: { type: String }
    },
    investmentCriteria: {
        minAmount: { type: Number, required: function() { return this.userType === "investor"; } },
        maxAmount: { type: Number, required: function() { return this.userType === "investor"; } },
        preferredStages: { 
            type: [String], 
            enum: ["Pre-seed", "Seed", "Series A", "Series B", "Series C", "Other"], 
            required: function() { return this.userType === "investor"; } 
        },
        preferredIndustries: { 
            type: [String], 
            enum: ["Tech", "Healthcare", "Finance", "E-commerce", "AI", "Blockchain", "EdTech", "Other"], 
            required: function() { return this.userType === "investor"; } 
        }
    },
    pastInvestments: {
        type: [
            {
                startupName: { type: String, required: true },
                amount: { type: Number, required: true },
                year: { type: Number, required: true }
            }
        ],
        required: function () { return this.userType === "investor"; }  // Required only for investors
    }

}, { timestamps: true });

export default mongoose.model('User', UserSchema);
