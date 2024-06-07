
// Import the dotenv package
require('dotenv').config();
// Import the jsonwebtoken package
const jwt = require("jsonwebtoken");
// A function to verify the token received from the frontend 
// Import the employee service 
const employeeService = require("../services/employee.service");

// A function to verify the token received from the frontend 
const verifyToken = async (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({
      status: "fail",
      message: "No token provided!"
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
// console.log(token)
    if (err) {
      return res.status(401).send({
        status: "fail",
        message: "Unauthorized!"
      });
    }
    // console.log("Here is the decoded token");
    // console.log(decoded);
    req.employee_email = decoded.employee_email;
    next();
  });
}
const isManager = async (req, res, next) => {
  try {
    const employee_email = req.employee_email;
    const employee = await employeeService.getEmployeeByEmail(employee_email);
    
    if (employee.length > 0 && employee[0].company_role_id === 3||  employee[0].company_role_id === 2) {
      // User is an employee, proceed to the next middleware or route handler
      next();
    } else {
      return res.status(403).json({
        status: "fail",
        error: "you don't have access!"
      });
    }
  } catch (error) {
    console.error('Error checking employee status:', error.message);
    return res.status(500).json({
      status: "error",
      error: "Internal Server Error"
    });
  }
};

// A function to check if the user is an admin
const isAdmin = async (req, res, next) => {
//   let token = req.headers["x-access-token"];
//   console.log(req.employee_email);
  const employee_email = req.employee_email;
  const employee = await employeeService.getEmployeeByEmail(employee_email);
  if (employee[0].company_role_id === 3) {

    next();
  } else {
    return res.status(403).send({
      status: "fail",
      error: "Not an Admin!"
    });
  }
}

const authMiddleware = {
  verifyToken,
  isManager,
  isAdmin
}

module.exports = authMiddleware;