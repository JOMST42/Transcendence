export const cookieConstants = {
  // time in ms
  maxAge: 60000 * 15,
  httpOnly: true,
};

export const jwtTokenConstants = {
  accessToken: {
    expiresIn: '15m',
  },
  refreshToken: {
    expiresIn: '2d',
  },
};
