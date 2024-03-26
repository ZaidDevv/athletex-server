import { Router } from "express";
import { authenticated } from "../middleware/middleware";
import path from 'path';
import { AuthController } from "../controller/auth_controller";

const DashboardRouter = Router();

DashboardRouter.get(`/login`, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'dashboard', 'login.html'));
});
DashboardRouter.get('/dashboard', authenticated(true), (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'dashboard', 'dashboard.html'));
});

DashboardRouter.get('/dashboard/add_exercise', authenticated(true), (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'dashboard', 'add_exercise.html'));
});

DashboardRouter.get('/dashboard/exercises', authenticated(true), (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'dashboard', 'exercises.html'));
});

export default DashboardRouter;
