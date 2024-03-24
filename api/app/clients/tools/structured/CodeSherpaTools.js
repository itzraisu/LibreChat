const { StructuredTool } = require('langchain/tools');
const axios = require('axios');
const { z } = require('zod');

function getServerURL() {
  const url = process.env.CODESHERPA_SERVER_URL || '';
  if (!url) {
    throw new Error('Missing CODESHERPA_SERVER_URL environment variable.');
  }
  return url;
}

const headers = {
  'Content-Type': 'application/json',
};

class CodeRunner extends StructuredTool {
  constructor(fields) {
    super();
    this.name = 'RunCode';
    this.url = fields.CODESHERPA_SERVER_URL || getServerURL();
    this.description = `A plugin for interactive code execution. Follow the guidelines to get the best results.`;
    this.headers = headers;
    this.schema = z.object({
      code: z.string().optional().describe('The code to be executed in the REPL-like environment.'),
      language: z
        .string()
        .optional()
        .describe('The programming language of the code to be executed.'),
    });
  }

  async _call({ code, language = 'python' }) {
    const response = await axios({
      url: `${this.url}/repl`,
      method: 'post',
      headers: this.headers,
      data: { code, language },
    });
    return response.data.result;
  }
}

class CommandRunner extends StructuredTool {
  constructor(fields) {
    super();
    this.name = 'RunCommand';
    this.url = fields.CODESHERPA_SERVER_URL || getServerURL();
    this.description = 'A plugin for interactive shell command execution. Follow the guidelines to get the best results.';
    this.headers = headers;
    this.schema = z.object({
      command: z.string().describe('The terminal command to be executed.'),
    });
  }

  async _call(data) {
    const response = await axios({
      url: `${this.url}/command`,
      method: 'post',
      headers: this.headers,
      data,
    });
    return response.data.result;
  }
}

// class FileUploader extends StructuredTool {
//   constructor(fields) {
//     super();
//     this.name = 'UploadFile';
//     this.url = fields.CODESHERPA_SERVER_URL || getServerURL();
//     this.description = 'Endpoint to upload a file.';
//     this.headers = headers;
//     this.schema = z.object({
//       file: z.string().describe('The file to be uploaded.'),
//     });
//   }

//   async _call(data) {
//     const formData = new FormData();
//     formData.append('file', fs.createReadStream(data.file));

//     const response = await axios({
//       url: `${this.url}/upload`,
//       method: 'post',
//       headers: {
//         ...this.headers,
//         'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
//       },
//       data: formData,
//     });
//     return response.data;
//   }
// }

module.exports = [
  CodeRunner,
  CommandRunner,
  // FileUploader
];
