import { Router } from "express";
import { authenticated } from "../middleware/middleware";
import path from 'path';

const DashboardRouter = Router();

DashboardRouter.get(`/login`, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'form', 'login.html'));
});

DashboardRouter.get('/dashboard', authenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'form', 'dashboard.html'));
});

DashboardRouter.get('/dashboard/add_exercise', authenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'form', 'add_exercise.html'));
});

export default DashboardRouter;
