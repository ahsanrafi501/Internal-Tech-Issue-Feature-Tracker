import express, { type Application, type Request, type Response } from "express"
import cors from "cors"
import { ApiResponse } from "./utility/sendResponse"






const app: Application = express()
app.use(express.json())
app.use(cors({origin: "http://localhost/3000" }))

app.get('/', (req: Request, res: Response) => {
  console.log("hello");
  res.status(200).json(new ApiResponse(200, [], "Welcome to Internal tech issue failure tracker backend"))
})

export default app;