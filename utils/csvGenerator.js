const { Parser } = require('json2csv');

exports.generateCSV = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('No data provided for CSV generation');
  }

  // Ensure the field names match your data keys
  const fields = ['id', 'user_id', 'amount', 'description', 'category', 'created_at'];
  const opts = { fields };

  try {
    const parser = new Parser(opts);
    const csv = parser.parse(data); // Generate CSV string
    console.log('CSV generated successfully');
    return csv;
  } catch (err) {
    console.error('Error generating CSV:', err);
    console.error('Input data:', JSON.stringify(data, null, 2)); // Debugging: Log input data
    throw new Error('Failed to generate CSV');
  }
};
