const getCustomConfig = require('~/server/services/Config/getCustomConfig');
const { isDomainAllowed } = require('./AuthService');

jest.mock('~/server/services/Config/getCustomConfig', () => jest.fn());

describe('AuthService - isDomainAllowed', () => {
  const defaultConfig = {
    registration: {
      allowedDomains: ['domain1.com', 'domain2.com'],
    },
  };

  beforeEach(() => {
    getCustomConfig.mockReset();
  });

  it('should allow domain when customConfig is not available', async () => {
    getCustomConfig.mockResolvedValue(null);
    const result = await isDomainAllowed('test@domain1.com');
    expect(result).toBe(true);
  });

  it('should allow domain when allowedDomains is not defined in customConfig', async () => {
    getCustomConfig.mockResolvedValue({});
    const result = await isDomainAllowed('test@domain1.com');
    expect(result).toBe(true);
  });

  it('should reject an email if it is falsy', async () => {
    getCustomConfig.mockResolvedValue({});
    const result = await isDomainAllowed('');
    expect(result).toBe(false);
  });

  it('should allow a domain if it is included in the allowedDomains', async () => {
    getCustomConfig.mockResolvedValue(defaultConfig);
    const result = await isDomainAllowed('user@domain1.com');
    expect(result).toBe(true);
  });

  it('should reject a domain if it is not included in the allowedDomains', async () => {
    getCustomConfig.mockResolvedValue(defaultConfig);
    const result = await isDomainAllowed('user@domain3.com');
    expect(result).toBe(false);
  });

  it('should return false if customConfig throws an error', async () => {
    getCustomConfig.mockRejectedValue(new Error('Custom config error'));
    const result = await isDomainAllowed('test@domain1.com');
    expect(result).toBe(false);
  });
});
