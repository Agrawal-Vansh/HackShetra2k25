import User from '../models/users.model.js';

export const matchStartupsWithInvestors = async (req, res) => {
    try {
        const startups = await User.find({ userType: 'startup' });
        const investors = await User.find({ userType: 'investor' });

        const matches = [];

        startups.forEach(startup => {
            investors.forEach(investor => {
                let score = 0;

                if (investor.investmentCriteria.preferredIndustries.includes(startup.companyInfo.industry)) score += 40;
                if (investor.investmentCriteria.preferredStages.includes(startup.funding.stage)) score += 30;
                if (startup.funding.amountNeeded >= investor.investmentCriteria.minAmount &&
                    startup.funding.amountNeeded <= investor.investmentCriteria.maxAmount) score += 20;
                if (investor.investorInfo.location === startup.companyInfo.location) score += 10;

                if (score > 50) {
                    matches.push({ startup, investor, score });
                }
            });
        });

        res.json(matches);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
