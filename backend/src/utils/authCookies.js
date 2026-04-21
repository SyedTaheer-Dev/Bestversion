const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export const getCookieName = () => process.env.COOKIE_NAME || 'bv_token';

export const getCookieOptions = () => {
  const sameSite = process.env.COOKIE_SAME_SITE || (process.env.NODE_ENV === 'production' ? 'none' : 'lax');
  const secure = process.env.COOKIE_SECURE === 'true' || sameSite === 'none';

  return {
    httpOnly: true,
    secure,
    sameSite,
    path: '/',
    maxAge: Number(process.env.COOKIE_MAX_AGE_DAYS || 7) * ONE_DAY_MS,
  };
};

export const setAuthCookie = (res, token) => {
  res.cookie(getCookieName(), token, getCookieOptions());
};

export const clearAuthCookie = (res) => {
  res.clearCookie(getCookieName(), {
    ...getCookieOptions(),
    maxAge: undefined,
    expires: new Date(0),
  });
};
