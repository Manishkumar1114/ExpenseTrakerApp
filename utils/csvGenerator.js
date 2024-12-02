const { Parser } = require('json2csv');

exports.generateCSV = (data) => {
  const fields = ['id', 'user_id', 'amount', 'description', 'category', 'created_at'];
  const opts = { fields };

  try {
    const parser = new Parser(opts);
    return parser.parse(data);
  } catch (err) {
    console.error('Error generating CSV:', err);
    throw new Error('Failed to generate CSV');
  }
};
