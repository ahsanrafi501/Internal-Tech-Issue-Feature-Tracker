import { Router } from "express";
import { issueController } from "./issue.controller";
import auth from "../../middleware/auth";
import { userRole } from "../../types";


const route = Router();

route.post('/issue', auth(userRole.contributor, userRole.maintainer), issueController.createIssue)


export const issueRoute = route;