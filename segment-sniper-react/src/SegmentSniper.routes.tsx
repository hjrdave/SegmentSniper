import { useEffect } from "react";
import {
  Routes as RRRoutes,
  Route,
  useLocation,
  useNavigate,
  Outlet,
} from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import { AppRoutes } from "./enums/AppRoutes";
import Login from "./pages/Login";

interface Props {
  defaultPage?: string;
}

export default function Routes({ defaultPage }: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (defaultPage) {
      navigate(defaultPage);
    } else {
      navigate(location.pathname);
    }
  }, []);

  return (
    <>
      <RRRoutes>
        <Route path="/app" element={<Outlet />}>
          <Route path={AppRoutes.Home} element={<Home />} />
          <Route path={AppRoutes.Register} element={<Register />} />
          <Route path={AppRoutes.Login} element={<Login />} />
        </Route>
      </RRRoutes>
    </>
  );
}