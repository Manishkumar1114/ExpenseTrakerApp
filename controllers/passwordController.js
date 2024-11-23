const Sib = require('sib-api-v3-sdk');
const crypto = require('crypto');
const User = require('../models/userModel');
require('dotenv').config();

// Configure SendinBlue API client
const client = Sib.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.API_KEY;

const tranEmailApi = new Sib.TransactionalEmailsApi();

const sender = {
  email: 'manishhp123@gmail.com',
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const user = await User.getUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: 'User with this email does not exist' });
    }

    // Generate a secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiration = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiration

    // Save the token and its expiration in the database
    await User.saveResetToken(email, resetToken, resetTokenExpiration);

    // Password reset link
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

    // Send password reset email
    await tranEmailApi.sendTransacEmail({
      sender,
      to: [{ email }],
      subject: 'Password Reset Request',
      textContent: `You requested a password reset. Click the link to reset your password: ${resetLink}. This link is valid for 1 hour.`,
    });

    res.status(200).json({ message: 'Password reset email sent successfully' });
  } catch (error) {
    console.error('Error in forgotPassword:', error);
    res.status(500).json({ message: 'Error sending password reset email' });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ message: 'Token and new password are required' });
  }

  try {
    // Verify the token
    const user = await User.verifyResetToken(token);

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    await User.updatePassword(user.email, hashedPassword);

    res.status(200).json({ message: 'Password reset successfully!' });
  } catch (error) {
    console.error('Error in resetPassword:', error);
    res.status(500).json({ message: 'Error resetting password' });
  }
};
