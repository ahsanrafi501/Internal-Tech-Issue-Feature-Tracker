import express, { type Application, type Request, type Response } from "express"
import cors from "cors"
import { ApiResponse } from "./utility/sendResponse"
import { userRoute } from "./module/user/user.route"
import { issueRoute } from "./module/issue/issue.route"






const app: Application = express()
app.use(express.json())
app.use(cors({origin: "http://localhost/3000" }))

app.get('/', (req: Request, res: Response) => {
  res.status(200).json(new ApiResponse(200, "Welcome to Internal-Ttech-Issue-Failure-Tracker backend"))
})


app.use("/api", userRoute);
app.use("/api", issueRoute);

export default app;