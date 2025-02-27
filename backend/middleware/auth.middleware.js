import jwt from "jsonwebtoken"
import joi from "joi";

export const ensureAuthenticated = async (req, res, next) => {
    const authorization = req.headers.authorization;
    const token = authorization && authorization.startsWith('Bearer ')? authorization.split(' ')[1]: authorization; // Fallback to the full value if no 'Bearer'
    
    // const token = req.headers.authorization?.split(' ')[1]  ;
    // console.log("request received");
    if (!token) {
      return res.status(403).json({ message: 'No token provided' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user =decoded;
    //   console.log("token verified");
      next();
    } catch (error) {
    
      res.status(401).json([{ message: `Failed to authenticate token: ${error.message}` },{error:`${error}`}]);
    }
  };


// **Signup Validation**
export const signupValidation = (req, res, next) => {
    const Schema = joi.object({
        name: joi.string().min(3).max(100).required(),
        email: joi.string().email().required(),
        password: joi.string().min(4).max(100).required(),
        userType: joi.string().valid("startup", "investor").required(), // Ensuring valid user type
    });

    const { error } = Schema.validate(req.body);
    
    if (error) {
        return res.status(400).json({ 
            message: "Bad request - Invalid format", 
            error: error.details.map(err => err.message)  // Returns all validation errors
        });
    }
    next();
};

// **Login Validation**
export const loginValidation = (req, res, next) => {
    const Schema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().min(4).max(100).required(),
    });

    const { error } = Schema.validate(req.body);

    if (error) {
        return res.status(400).json({ 
            message: "Bad request - Invalid login details", 
            error: error.details.map(err => err.message) 
        });
    }
    next();
};
