const axios = require("axios");

// EXECUTE CODE
const executeCode = async (req, res) => {
  try {
    const { code, language, versionIndex } = req.body;

    const response = await axios.post("https://api.jdoodle.com/v1/execute", {
      clientId: process.env.JDOODLE_CLIENT_ID,

      clientSecret: process.env.JDOODLE_CLIENT_SECRET,

      script: code,

      language,

      versionIndex,
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.log(error.response?.data || error.message);

    res.status(500).json({
      message: "Code execution failed",
    });
  }
};

module.exports = {
  executeCode,
};
