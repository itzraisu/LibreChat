const OpenAI = require('openai');
const { createReadStream } = require('fs');
const { join } = require('path');
const { promisify } = require('util');
const pipeline = promisify(require('stream').pipeline);

const { logger } = require('~/config');

jest.mock('openai');

const processFileURL = jest.fn();

jest.mock('~/server/services/Files/images', () => ({
  getImageBasename: jest.fn().mockImplementation((url) => {
    const imageExtensionRegex = /\.(jpg|jpeg|png|gif|bmp|tiff|svg)$/i;
    const basename = join(...url.split('/').slice(0, -1)).split('/').pop();
    return imageExtensionRegex.test(basename) ? basename : '';
  }),
}));

const generate = jest.fn();
OpenAI.mockImplementation(() => ({
  images: {
    generate,
  },
}));

jest.mock('fs', () => {
  return {
    existsSync: jest.fn(),
    mkdirSync: jest.fn(),
    createReadStream: jest.fn(),
  };
});

jest.mock('path', () => {
  return {
    resolve: jest.fn(),
    join: jest.fn(),
    relative: jest.fn(),
    extname: jest.fn().mockImplementation((filename) => {
      return filename.slice(filename.lastIndexOf('.'));
    }),
  };
});

describe('DALLE3', () => {
  let originalEnv;
  let dalle;
  const mockApiKey = 'mock_api_key';

  beforeAll(() => {
    originalEnv = { ...process.env };
  });

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv, DALLE_API_KEY: mockApiKey };
    dalle = new DALLE3({ processFileURL });
  });

  afterEach(() => {
    jest.clearAllMocks();
    process.env = originalEnv;
  });

  it('should throw an error if all potential API keys are missing', () => {
    delete process.env.DALLE3_API_KEY;
    delete process.env.DALLE_API_KEY;
    expect(() => new DALLE3()).toThrow('Missing DALLE_API_KEY environment variable.');
  });

  it('should replace unwanted characters in input string', () => {
    const input = 'This is a test\nstring with "quotes" and new lines.';
    const expectedOutput = 'This is a test string with quotes and new lines.';
    expect(dalle.replaceUnwantedChars(input)).toBe(expectedOutput);
  });

  it('should generate markdown image URL correctly', () => {
    const imageName = 'test.png';
    const markdownImage = dalle.wrapInMarkdown(imageName);
    expect(markdownImage).toBe('![generated image](test.png)');
  });

  it('should call OpenAI API with correct parameters', async () => {
    const mockData = {
      prompt: 'A test prompt',
      quality: 'standard',
      size: '1024x1024',
      style: 'vivid',
    };

    const mockResponse = {
      data: [
        {
          url: 'http://example.com/img-test.png',
        },
      ],
    };

    generate.mockResolvedValue(mockResponse);
    processFileURL.mockResolvedValue({
      filepath: 'http://example.com/img-test.png',
    });

    await dalle._call(mockData);

    expect(generate).toHaveBeenCalledWith({
      model: 'dall-e-3',
      quality: mockData.quality,
      style: mockData.style,
      size: mockData.size,
      prompt: mockData.prompt,
      n: 1,
    });
  });

  it('should use the system prompt if provided', () => {
    process.env.DALLE3_SYSTEM_PROMPT = 'System prompt for testing';
    jest.resetModules();
    const DALLE3 = require('../DALLE3');
    const dalleWithSystemPrompt = new DALLE3();
    expect(dalleWithSystemPrompt.description_for_model).toBe('System prompt for testing');
  });

  it('should not use the system prompt if not provided', async () => {
    delete process.env.DALLE3_SYSTEM_PROMPT;
    const dalleWithoutSystemPrompt = new DALLE3();
    expect(dalleWithoutSystemPrompt.description_for_model).not.toBe('System prompt for testing');
  });

  it('should throw an error if prompt is missing', async () => {
    const mockData = {
      quality: 'standard',
      size: '1024x1024',
      style: 'vivid',
    };
    await expect(dalle._call(mockData)).rejects.toThrow('Missing required field: prompt');
  });

  it('should log appropriate debug values', async () => {
    const mockData = {
      prompt: 'A test prompt',
    };
    const mockResponse = {
      data: [
        {
          url: 'http://example.com/invalid-url',
        },
      ],
    };

    generate.mockResolvedValue(mockResponse);
    await dalle._call(mockData);

    expect(logger.debug).toHaveBeenCalledWith('[DALL-E-3]', {
      data: { url: 'http://example.com/invalid-url' },
      theImageUrl: 'http://example.com/invalid-url',
      extension: expect.any(String),
      imageBasename: expect.any(String),
      imageExt: expect.any(String),
      imageName: expect.any(String),
    });
  });

  it('should log an error and return the image URL
