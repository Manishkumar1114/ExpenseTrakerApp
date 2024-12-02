const { verifyResetRequest, deactivateResetRequest } = require('../models/userModel'); // Import model methods

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ message: 'Token and new password are required' });
  }

  try {
    // Verify the reset request
    const resetRequest = await verifyResetRequest(token);
    if (!resetRequest) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const userId = resetRequest.userId;

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    await User.updatePasswordById(userId, hashedPassword);

    // Deactivate the reset request
    await deactivateResetRequest(token);

    res.status(200).json({ message: 'Password reset successfully!' });
  } catch (error) {
    console.error('Error in resetPassword:', error);
    res.status(500).json({ message: 'Error resetting password' });
  }
};

