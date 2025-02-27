import User from '../models/users.model.js';

    export async function getOppositeUserTypeDetails(req, res) {
        try {
            // Extract the userType from the URL parameter
            const { userType } = req.params;

            // Validate the userType to be either "startup" or "investor"
            if (userType !== 'startup' && userType !== 'investor') {
                return res.status(400).json({ message: 'Invalid userType parameter' });
            }
            // Determine the opposite userType
            const oppositeUserType = userType === 'startup' ? 'investor' : 'startup';

            // Fetch all users of the opposite userType
            const oppositeUsers = await User.find({ userType: oppositeUserType });

            // Map the opposite users to only include relevant details
            const oppositeUsersDetails = oppositeUsers.map(oppositeUser => {
                if (oppositeUser.userType === 'startup') {
                    return {
                        name: oppositeUser.name,
                        companyInfo: oppositeUser.companyInfo,
                        funding: oppositeUser.funding,
                        metrics: oppositeUser.metrics,
                        email:oppositeUser.email
                    };
                } else if (oppositeUser.userType === 'investor') {
                    return {
                        name: oppositeUser.name,
                        investorInfo: oppositeUser.investorInfo,
                        investmentCriteria: oppositeUser.investmentCriteria,
                        pastInvestments: oppositeUser.pastInvestments,
                        email:oppositeUser.email
                    };
                }
            });

            // Send the opposite users' details as a response
            return res.status(200).json(oppositeUsersDetails);

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    }

