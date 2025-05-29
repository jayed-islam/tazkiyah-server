import express from "express";
import { userRoutes } from "../modules/User/user.routes";
import { AdminRoutes } from "../modules/Admin/admin.routes";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { PatientRoutes } from "../modules/Patient/patient.route";
import { MetaRoutes } from "../modules/Meta/meta.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/admin",
    route: AdminRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/patient",
    route: PatientRoutes,
  },
  {
    path: "/meta",
    route: MetaRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
