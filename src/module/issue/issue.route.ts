import { Router } from "express";
import { issueController } from "./issue.controller";
import auth from "../../middleware/auth";
import { userRole } from "../../types";


const route = Router();

route.post('/issues', auth(userRole.contributor, userRole.maintainer), issueController.createIssue)
route.get('/issues', issueController.getAllIssues)
route.get('/issues/:id', issueController.getSingleIssue)
route.put('/issues/:id', auth(userRole.maintainer, userRole.contributor), issueController.updateIssues)
route.delete('/issues/:id', auth(userRole.maintainer), issueController.deleteIssure)


export const issueRoute = route;