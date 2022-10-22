export const cookieConstants = {
  // time in ms
  maxAge: 60000 * 15,
  httpOnly: true,
};

export const jwtTokenConstants = {
  accessToken: {
    expiresIn: '1d',
  },
};

export const CLOUDINARY = 'Cloudinary';
