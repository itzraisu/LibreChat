const fs = require('fs');
const path = require('path');
const { createOpenAPIPlugin } = require('./OpenAPIPlugin');

jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
  },
  existsSync: jest.fn(),
}));

const readFileMock = jest.fn();
const existsSyncMock = jest.fn();

beforeEach(() => {
  fs.promises.readFile = readFileMock;
  fs.existsSync = existsSyncMock;

  readFileMock.mockReset();
  existsSyncMock.mockReset();
});

describe('readSpecFile', () => {
  it('reads JSON file correctly', async () => {
    const filePath = 'test.json';
    const fileContent = JSON.stringify({ test: 'value' });

    readFileMock.mockResolvedValue(fileContent);

    const result = await readSpecFile(filePath);

    expect(result).toEqual({ test: 'value' });
    expect(readFileMock).toBeCalledWith(path.resolve(filePath), 'utf-8');
  });

  it('reads YAML file correctly', async () => {
    const filePath = 'test.yaml';
    const fileContent = 'test: value';

    readFileMock.mockResolvedValue(fileContent);

    const result = await readSpecFile(filePath);

    expect(result).toEqual({ test: 'value' });
    expect(readFileMock).toBeCalledWith(path.resolve(filePath), 'utf-8');
  });

  it('handles error correctly', async () => {
    const filePath = 'test.json';
    const errorMessage = 'test error';

    readFileMock.mockRejectedValue(new Error(errorMessage));

    const result = await readSpecFile(filePath);

    expect(result).toBe(false);
    expect(readFileMock).toBeCalledWith(path.resolve(filePath), 'utf-8');
  });
});

describe('getSpec', () => {
  it('fetches spec from url correctly', async () => {
    const url = 'https://www.instacart.com/.well-known/ai-plugin.json';
    const parsedJson = await getSpec(url);
    const isObject = typeof parsedJson === 'object';

    expect(isObject).toEqual(true);
  });

  it('reads spec from file correctly', async () => {
    const filePath = 'test.json';
    const fileContent = JSON.stringify({ test: 'value' });
    existsSyncMock.mockReturnValue(true);

    readFileMock.mockResolvedValue(fileContent);

    const result = await getSpec(filePath);

    expect(result).toEqual({ test: 'value' });
    expect(readFileMock).toBeCalledWith(path.resolve(filePath), 'utf-8');
  });

  it('returns false when file does not exist', async () => {
    const filePath = 'test.json';

    existsSyncMock.mockReturnValue(false);

    const result = await getSpec(filePath);

    expect(result).toBe(false);
  });
});

describe('createOpenAPIPlugin', () => {
  it('returns null when getSpec throws an error', async () => {
    const errorMessage = 'test error';

    getSpec.mockRejectedValue(new Error(errorMessage));

    const result = await createOpenAPIPlugin({ data: { api: { url: 'invalid' } } });

    expect(result).toBe(null);
  });

  it('returns null when no spec is found', async () => {
