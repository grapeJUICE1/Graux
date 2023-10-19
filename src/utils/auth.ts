import { Response } from "express"
import { sign } from "jsonwebtoken"
import dataSource from "../data-source"
import User from "../entities/User"

export const createAccessToken = (user: User) => {
  return sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  })
}

export const createRefreshToken = (user: User) => {
  return sign(
    { userId: user.id, tokenVersion: user.tokenVersion },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  )
}

export const sendRefreshToken = (res: Response, user: User | null) => {
  res?.cookie("jid", user ? createRefreshToken(user) : "", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    path: "/refresh_token",
  })
}

export const sendAccessToken = (res: Response, user: User) => {
  res.cookie("jid", user ? createAccessToken(user) : "", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  })
}

export const revokeRefreshTokens = async (userId) => {
  try {
    await dataSource
      .getRepository(User)
      .increment({ id: userId }, "tokenVersion", 1)
    return true
  } catch (err) {
    return false
  }
}
