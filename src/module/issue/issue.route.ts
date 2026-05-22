import { Router } from "express";
import { issueController } from "./issue.controller";

const route = Router();

route.post('/issue', issueController.createIssue)


export const issueRoute = route;