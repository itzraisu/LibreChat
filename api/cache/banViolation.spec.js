const banViolation = require('./banViolation');
const { getLogStores } = require('./getLogStores');
const Session = require('../models/Session');
const math = require('../server/utils/math');

jest.mock('keyv');
jest.mock('../models/Session');
jest.mock('./getLogStores', () => jest.fn());

const mockedGetLogStores = getLogStores as jest.MockedFunction<typeof getLogStores>;
const mockedSession = Session as jest.MockedClass<typeof Session>;

describe('banViolation', () => {
  let req, res, errorMessage, keyvMock, sessionMock;

  beforeEach(() => {
    req = {
      ip: '127.0.0.1',
      cookies: {
        refreshToken: 'someToken',
      },
    };
    res = {
      clearCookie: jest.fn(),
    };
    errorMessage = {
      type: 'someViolation',
      user_id: '12345',
      prev_count: 0,
      violation_count: 0,
    };
    process.env.BAN_VIOLATIONS = 'true';
    process.env.BAN_DURATION = '7200000'; // 2 hours in ms
    process.env.BAN_INTERVAL = '20';

    keyvMock = {
      get: jest.fn(),
      set: jest.fn(),
    };

    sessionMock = {
      getSession: jest.fn(),
      updateSession: jest.fn(),
    };

    mockedGetLogStores.mockReturnValueOnce(keyvMock);
    mockedSession.mockReturnValue(sessionMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not ban if BAN_VIOLATIONS are not enabled', async () => {
    process.env.BAN_VIOLATIONS = 'false';
    await banViolation(req, res, errorMessage);
    expect(errorMessage.ban).toBeFalsy();
  });

  it('should not ban if errorMessage is not provided', async () => {
    await banViolation(req, res, null);
    expect(errorMessage.ban).toBeFalsy();
  });

  // ... continue with the rest of the tests
});
