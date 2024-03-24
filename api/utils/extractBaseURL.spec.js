const extractBaseURL = require('./extractBaseURL');

describe('extractBaseURL', () => {
  const baseURLs = [
    'https://localhost:8080/v1',
    'https://localhost:8080/v1/openai',
    'https://fake.open.ai/v1/openai',
    'https://api.openai.com/v1',
    'https://gateway.ai.cloudflare.com/v1/ACCOUNT_TAG/GATEWAY/openai',
    'https://open.ai/v1',
    'https://open.ai/v1/ACCOUNT/GATEWAY/openai',
    'https://api.example.com/v1',
    'https://instance-name.openai.azure.com',
  ];

  const urls = [
    'https://localhost:8080/v1/chat/completions',
    'https://localhost:8080/v1/openai',
    'https://fake.open.ai/v1/openai/you-are-cool',
    'https://api.openai.com/v1/chat/completions',
    'https://gateway.ai.cloudflare.com/v1/ACCOUNT_TAG/GATEWAY/openai/completions',
    'https://open.ai/v1/chat',
    'https://open.ai/v1/ACCOUNT/GATEWAY/openai/completions',
    'https://api.example.com/v1/azure-openai/something',
    'https://api.example.com/v1/replicate/anotherthing',
    'https://api.example.com/v1/huggingface/yetanotherthing',
    'https://api.example.com/v1/workers-ai/differentthing',
    'https://api.example.com/v1/aws-bedrock/somethingelse',
    'https://api.example.com/v1/some/path/azure-openai',
    'https://api.example.com/v1/replicate/deep/path/segment',
    'https://instance-name.openai.azure.com/openai/deployments/deployment-name',
  ];

  test.each(urls)(
    'should extract base URL up to /v1 for standard endpoints',
    (url) => {
      const extractedBaseURL = extractBaseURL(url);
      expect(baseURLs).toContain(extractedBaseURL);
    },
  );

  test('should return input if the URL does not match the expected pattern', () => {
    const url = 'https://someotherdomain.com/notv1';
    expect(extractBaseURL(url)).toBe(url);
  });
});

// helper functions
const isAzureOpenAI = (url) => {
  return url.includes('openai.azure.com');
};

const getSuffixIndex = (url) => {
  return url.indexOf('/', url.indexOf('/v1') + 1);
};

const extractBaseURL = (url) => {
  if (isAzureOpenAI(url)) {
    return url;
  }

  const suffixIndex = getSuffixIndex(url);
  const suffix = suffixIndex !== -1 ? url.slice(suffixIndex) : '';

  if (suffix && suffix !== '/openai') {
    const baseURL = url.slice(0, suffixIndex);
    return baseURL + suffix;
  }

  return url.slice(0, getSuffixIndex(url, '/v1') + 1);
};
