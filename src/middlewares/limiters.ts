import limit from "express-rate-limit";

export const postLimiter = limit({
  windowMs: 1000 * 60 * 2,
  limit: Number(process.env.POST_LIMIT) || 5,
});

export const commentLimiter = limit({
  windowMs: 1000 * 60 * 2,
  limit: Number(process.env.COMMENT_LIMIT) || 8,
});

export const userLimiter = limit({
  windowMs: 1000 * 60 * 60,
  limit: Number(process.env.USER_LIMIT) || 1,
});
