const express = require('express');
const routeLabel = require('route-label');
const router = express.Router();
const namedRouter = routeLabel(router);
const userController = require('webservice/user.controller');
// const config = require(appRoot + '/config/index');
const multer = require('multer');
const fs = require("fs");

const Storage = multer.diskStorage({
  destination: (req, file, callback) => {
    if (!fs.existsSync("./public/uploads/user/profile_pic")) {
      fs.mkdirSync("./public/uploads/user/profile_pic");
    }
    
    
    if (file.fieldname == 'profile_pic') {
        callback(null, "./public/uploads/user/profile_pic");
    }
  },
  filename: (req, file, callback) => {
    callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname.replace(/\s/g, '_'));
  }
});

const uploadFile = multer({
  storage: Storage
});

const request_param = multer();

//User signup Route
/**
 * @api {post} /user/signup Signup
 * @apiVersion 1.0.0
 * @apiGroup User
 * @apiParam { String } full_name Full Name
 * @apiParam { String } email Email
 * @apiParam { String } password Password
 * @apiParam {string} role [enter the value of _id of role]
 * @apiSuccessExample {json} Success
 * {
    "status": 200,
    "data": {
        "first_name": "Hello",
        "last_name": "User",
        "full_name": "Hello User",
        "email": "hello@yopmail.com",
        "password": "$2b$08$TDAVkdegUwavQUo6IJqrUukgHC71mLB6etZzpMkYbE3RycfdWGQHu",
        "role": "645c8b90ef5a641d4d2e47a7",
        "profile_pic": "",
        "gender": "",
        "dob": null,
        "deviceToken": "",
        "deviceType": "",
        "register_type": "normal",
        "emailOTP": "",
        "phoneOTP": "",
        "social_id": "",
        "isMobileVerified": false,
        "isEmailVerified": false,
        "isSignupCompleted": false,
        "isDeleted": false,
        "isActive": true,
        "_id": "646227734d7e4bd61bcf1daf",
        "createdAt": "2023-05-15T12:37:07.540Z",
        "updatedAt": "2023-05-15T12:37:07.540Z"
    },
    "message": "Please verify the link sent to your mail."
}
*/
namedRouter.post('api.user.signup', '/user/signup', request_param.any(), async (req, res) => {
  try {
      const success = await userController.signup(req);
      res.status(success.status).send(success);
  } catch (error) {
      res.status(error.status).send(error.message);
  }
});

//User Verify Email OTP
/**
 * @api {post} /user/email-verify Email Verify
 * @apiVersion 1.0.0
 * @apiGroup User
 * @apiParam { String } email User Email
 * @apiParam { String } emailOTP OTP
 * @apiSuccessExample {json} Success
 * {
    "status": 200,
    "data": {},
    "message": "Email Verified"
}
*/
namedRouter.post('api.user.verifyEmailOTP', '/user/email-verify', request_param.any(), async (req, res) => {
  try {
      const success = await userController.verifyEmailOTP(req);
      res.status(success.status).send(success);
  } catch (error) {
      res.status(error.status).send(error.message);
  }
});


//User Verify Email Link
/**
 * @api {post} /user/email-link-verify Email Link Verify
 * @apiVersion 1.0.0
 * @apiGroup User
 * @apiParam { String } encoded_id Encoded Id
 * @apiSuccessExample {json} Success
 * {
    "status": 200,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0NjIyNzczNGQ3ZTRiZDYxYmNmMWRhZiIsImlhdCI6MTY4NDE1NDI1NCwiZXhwIjoxNjg2NzQ2MjU0fQ.Asf02BxDl9hfFCx9cXFhvjDhcvLAPSxX2DwosyAK2PE",
    "message": "Code has been verified Successfully. Registration Successful",
    "data": {
        "_id": "646227734d7e4bd61bcf1daf",
        "first_name": "Hello",
        "last_name": "User",
        "full_name": "Hello User",
        "email": "hello@yopmail.com",
        "password": "$2b$08$TDAVkdegUwavQUo6IJqrUukgHC71mLB6etZzpMkYbE3RycfdWGQHu",
        "role": "645c8b90ef5a641d4d2e47a7",
        "profile_pic": "",
        "gender": "",
        "dob": null,
        "deviceToken": "",
        "deviceType": "",
        "register_type": "normal",
        "emailOTP": "",
        "phoneOTP": "",
        "social_id": "",
        "isMobileVerified": false,
        "isEmailVerified": true,
        "isSignupCompleted": false,
        "isDeleted": false,
        "isActive": true,
        "createdAt": "2023-05-15T12:37:07.540Z",
        "updatedAt": "2023-05-15T12:37:34.842Z"
    }
}
*/
namedRouter.post('api.user.verifyEmailLink', '/user/email-link-verify', request_param.any(), async (req, res) => {
    try {
        const success = await userController.verifyEmailLink(req);
        res.status(success.status).send(success);
    } catch (error) {
        res.status(error.status).send(error.message);
    }
});


//User Check Email Route
/**
 * @api {post} /user/resend-otp Resend OTP
 * @apiVersion 1.0.0
 * @apiGroup User
 * @apiParam { String } email User Email
 * @apiSuccessExample {json} Success
 * {
    "status": 200,
    "data": {},
    "message": "OTP sent successfully! Please check your email inbox."
}
*/
namedRouter.post('api.user.resendOTP', '/user/resend-otp', request_param.any(), async (req, res) => {
    try {
        const success = await userController.resendOTP(req);
        res.status(success.status).send(success);
    } catch (error) {
        res.status(error.status).send(error.message);
    }
  });

//User signin Route
/**
 * @api {post} /user/signin Signin
 * @apiVersion 1.0.0
 * @apiGroup User
 * @apiParam { String } email Email
 * @apiParam { String } password Password
 * @apiSuccessExample {json} Success
 * {
    "status": 200,
    "data": {
        "_id": "646227fa3811b97e1fc073f3",
        "first_name": "Hello",
        "last_name": "User",
        "full_name": "Hello User",
        "email": "hello@yopmail.com",
        "password": "$2b$08$dxBlvZPtJYmsweQ3Br60aO19iCcTo14w0LoXtFUfXwAS/8obgdYpu",
        "role": "645c8b90ef5a641d4d2e47a7",
        "profile_pic": "",
        "gender": "",
        "dob": null,
        "deviceToken": "",
        "deviceType": "",
        "register_type": "normal",
        "emailOTP": "",
        "phoneOTP": "",
        "social_id": "",
        "isMobileVerified": false,
        "isEmailVerified": true,
        "isSignupCompleted": false,
        "isDeleted": false,
        "isActive": true,
        "createdAt": "2023-05-15T12:39:22.175Z",
        "updatedAt": "2023-05-15T13:13:12.779Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0NjIyN2ZhMzgxMWI5N2UxZmMwNzNmMyIsInRva2VuX2tleSI6IjU0OTY5MDY0IiwiaWF0IjoxNjg0MTU2MzkyLCJleHAiOjE2ODY3NDgzOTJ9.RI7oT0PqebYj64YqkHQEbf-2stgpqzSEMnJqcw8YlD4",
    "message": "Logged in successfully!"
}
*/
namedRouter.post('api.user.signin', '/user/signin', request_param.any(), async (req, res) => {
  try {
      const success = await userController.signin(req);
      res.status(success.status).send(success);
  } catch (error) {
      res.status(error.status).send(error.message);
  }
});

//User Forget Password Request
/**
 * @api {post} /user/forget-password-request Forget Password Request
 * @apiVersion 1.0.0
 * @apiGroup User
 * @apiParam { String } email Email
 * @apiSuccessExample {json} Success
 * {
    "status": 200,
    "data": {},
    "message": "OTP triggered to your email address associated with this account."
}
 */
namedRouter.post('api.user.forgetPasswordRequest', '/user/forget-password-request', request_param.any(), async (req, res) => {
  try {
      const success = await userController.forgetPasswordRequest(req);
      res.status(success.status).send(success);
  } catch (error) {
      res.status(error.status).send(error.message);
  }
});

//User Forget Password Verify
/**
 * @api {post} /user/forget-password-verify Forget Password Verify
 * @apiVersion 1.0.0
 * @apiGroup User
 * @apiParam { String } otp OTP
 * @apiParam { String } email Email
 * @apiSuccessExample {json} Success
 * {
    "status": 200,
    "data": {},
    "message": "OTP verifcation successfully done"
}
 */
namedRouter.post('api.user.forgetPasswordVerify', '/user/forget-password-verify', request_param.any(), async (req, res) => {
  try {
      const success = await userController.forgetPasswordVerify(req);
      res.status(success.status).send(success);
  } catch (error) {
      res.status(error.status).send(error.message);
  }
});

//User Reset Password
/**
 * @api {post} /user/reset-password Reset Password
 * @apiVersion 1.0.0
 * @apiGroup User
 * @apiParam { String } password New Password
 * @apiParam { String } confirm_password Confirm Password
 * @apiParam { ObjectId } user_id Userid
 * @apiSuccessExample {json} Success
 * {
    "status": 200,
    "data": {},
    "message": "Password changed successfully"
}
 */
namedRouter.post('api.user.resetPassword', '/user/reset-password', request_param.any(), async (req, res) => {
  try {
      const success = await userController.resetPassword(req);
      res.status(success.status).send(success);
  } catch (error) {
      res.status(error.status).send(error.message);
  }
});

// //User Social signin/signup Route
// namedRouter.post('api.user.socialSignupSignin', '/user/social-signup', request_param.any(), userController.socialSignupSignin);



namedRouter.all('/user*', auth.authenticateAPI);  

//User Update Profile Route
/**
 * @api {post} /user/update-profile Update Profile
 * @apiVersion 1.0.0
 * @apiGroup User
 * @apiHeader { string } x-access-token User Token
 * @apiParam { String } full_name Full Name
 * @apiParam { String } first_name First Name
 * @apiParam { String } last_name Last Name
 * @apiParam { String } profile_pic Profile Pic
 * @apiSuccessExample {json} Success
 * {
    "status": 200,
    "data": {
        "_id": "6458af0c6c0b6f1520504689",
        "first_name": "John",
        "last_name": "Dalton",
        "full_name": "John Dalton",
        "email": "johndalton@yopmail.com",
        "password": "$2b$08$QveliBbSBQx6XWAGv6usuuKErlJJJmNzZmY1W8ba1zU7pLqXrf4we",
        "role": "5ff30fa0026424da732724ce",
        "profile_pic": "profile_pic_1683542380724_user1.jpg",
        "emailOTP": "",
        "phoneOTP": "",
        "deviceToken": "",
        "deviceType": "",
        "register_type": "normal",
        "social_id": "",
        "isMobileVerified": false,
        "isEmailVerified": true,
        "isSignupCompleted": false,
        "isDeleted": false,
        "isActive": true,
        "createdAt": "2023-05-08T08:13:00.288Z",
        "updatedAt": "2023-05-08T10:39:40.732Z"
    },
    "message": "Profile updated successfully"
}
 * 
 */
namedRouter.post('api.user.updateProfile', '/user/update-profile', uploadFile.any(), async (req, res) => {
  try {
      const success = await userController.updateProfile(req);
      res.status(success.status).send(success);
  } catch (error) {
      res.status(error.status).send(error.message);
  }
});
//User Change Password Route
/**
 * @api {post} /user/change-password Change Password
 * @apiVersion 1.0.0
 * @apiGroup User
 * @apiHeader { string } x-access-token User Token
 * @apiParam { String } old_password Old Password
 * @apiParam { String } new_password New Password
 * @apiSuccessExample {json} Success
 * {
    "status": 200,
    "data": {},
    "message": "Password changed successfully"
}
 * 
 */
namedRouter.post("api.user.changePassword", '/user/change-password', request_param.any(), async (req, res) => {
  try {
      const success = await userController.changePassword(req);
      res.status(success.status).send(success);
  } catch (error) {
      res.status(error.status).send(error.message);
  }
});

// User Profile Details route
/**
 * @api {get} /user/details User details
 * @apiVersion 1.0.0
 * @apiGroup User
 * @apiHeader { string } x-access-token User Token
 * @apiSuccessExample {json} Success
 * {
    "status": 200,
    "data": {
        "_id": "6458af0c6c0b6f1520504689",
        "first_name": "John",
        "last_name": "Dalton",
        "full_name": "John Dalton",
        "email": "johndalton@yopmail.com",
        "password": "$2b$08$QveliBbSBQx6XWAGv6usuuKErlJJJmNzZmY1W8ba1zU7pLqXrf4we",
        "role": "5ff30fa0026424da732724ce",
        "profile_pic": "profile_pic_1683542380724_user1.jpg",
        "emailOTP": "",
        "phoneOTP": "",
        "deviceToken": "",
        "deviceType": "",
        "register_type": "normal",
        "social_id": "",
        "isMobileVerified": false,
        "isEmailVerified": true,
        "isSignupCompleted": false,
        "isDeleted": false,
        "isActive": true,
        "createdAt": "2023-05-08T08:13:00.288Z",
        "updatedAt": "2023-05-08T10:39:40.732Z"
    },
    "message": "User profile details fetched successfully"
}
 * 
 */
namedRouter.get("api.user.details", '/user/details', async (req, res) => {
  try {
      const success = await userController.userDetails(req);
      res.status(success.status).send(success);
  } catch (error) {
      res.status(error.status).send(error.message);
  }
});

// User Profile Delete route
/**
 * @api {get} /user/logout User Logout
 * @apiVersion 1.0.0
 * @apiGroup User
 * @apiHeader { string } x-access-token User Token
 * @apiSuccessExample {json} Success
 * {
    "status": 200,
    "data": {},
    "message": "Logged out successfully"
}
 * 
 */
namedRouter.get("api.user.logout", '/user/logout', async (req, res) => {
  try {
      const success = await userController.userLogout(req);
      res.status(success.status).send(success);
  } catch (error) {
      res.status(error.status).send(error.message);
  }
});

// // User Profile Delete route
// namedRouter.get('api.user.delete', '/user/delete', userController.userDelete);

module.exports = router;