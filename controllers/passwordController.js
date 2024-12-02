const bcrypt = require('bcrypt');
const { saveResetRequest, verifyResetRequest } = require('../models/userModel'); // Only import once
const crypto = require('crypto');
const User = require('../models/userModel');
const { v4: uuidv4 } = require('uuid');
const Sib = require('sib-api-v3-sdk');
const path = require('path'); // Required for path manipulation
require('dotenv').config();

// Configure SendinBlue API client
const client = Sib.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.API_KEY;

const tranEmailApi = new Sib.TransactionalEmailsApi();
const sender = { email: 'manishhp123@gmail.com' };

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    // Fetch user by email
    const user = await User.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'User with this email does not exist' });
    }

    // Generate a reset token
    const resetToken = uuidv4();
    const userId = user.id; // Extract the userId

    // Save reset token in ForgotPasswordRequests table
    await saveResetRequest(userId, resetToken);

    // Generate password reset link
    const resetLink = `http://localhost:3000/password/resetpassword/${resetToken}`;

    // Send email with the reset link
    await tranEmailApi.sendTransacEmail({
      sender,
      to: [{ email }],
      subject: 'Password Reset Request',
      textContent: `Click this link to reset your password: ${resetLink}`,
    });

    res.status(200).json({ message: 'Password reset email sent successfully' });
  } catch (error) {
    console.error('Error in forgotPassword:', error);
    res.status(500).json({ message: 'Error sending password reset email' });
  }
};

exports.resetPassword = async (req, res) => {
  const { requestId, newPassword } = req.body;

  if (!requestId || !newPassword) {
    return res.status(400).json({ message: 'Request ID and new password are required' });
  }

  try {
    // Verify the reset request
    const resetRequest = await verifyResetRequest(requestId);
    
    if (!resetRequest) {
      return res.status(400).json({ message: 'Invalid or expired reset request' });
    }

    // Check if the new password is the same as the old one (optional check)
    const user = await User.getUserById(resetRequest.userId);
    if (user.password === newPassword) {
      return res.status(400).json({ message: 'New password cannot be the same as the old password' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Log the hashed password to confirm it is being generated correctly
    console.log('Hashed Password:', hashedPassword);

    // Update the password in the database
    const updateResult = await User.updatePasswordById(resetRequest.userId, hashedPassword);
    console.log('Password update result:', updateResult);

    // Deactivate the reset request to prevent reuse
    await User.deactivateResetRequest(requestId);

    // Log to confirm the reset request deactivation
    console.log('Reset request deactivated for requestId:', requestId);

    // Send a success response
    res.status(200).json({ message: 'Password reset successfully!' });
  } catch (error) {
    console.error('Error in resetPassword:', error);
    res.status(500).json({ message: 'Error resetting password' });
  }
};

exports.getResetPasswordPage = async (req, res) => {
  const { id } = req.params; // Reset token from URL parameters

  try {
    // Verify if the reset request is valid and active
    const resetRequest = await verifyResetRequest(id);
    if (!resetRequest) {
      return res.status(404).json({ message: 'Invalid or expired reset link' });
    }

    // Serve the reset password page (or send appropriate response)
    res.sendFile(path.join(__dirname, '../public/resetPassword.html')); // Adjust path as needed
  } catch (error) {
    console.error('Error in getResetPasswordPage:', error);
    res.status(500).json({ message: 'Error loading reset password page' });
  }
};
