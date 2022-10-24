import { Request, Response } from 'express'

export default interface MyContext {
  req: Request
  res: Response
  payload?: { userId: String }
}
