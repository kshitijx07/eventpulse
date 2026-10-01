const getHealth = (req, res) => {
  res.json({ success: true, message: 'EventPulse API is running', timestamp: new Date().toISOString() });
};

module.exports = { getHealth };
