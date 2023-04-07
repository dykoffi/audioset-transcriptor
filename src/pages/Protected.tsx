import { Navigate, useLocation } from "react-router";
import { COOKIES } from "../config/constants";

export default function RequireAuth({ children }: { children: JSX.Element }) {

    let location = useLocation();

    if (!COOKIES.get("transcriptor_token") || !COOKIES.get("transcriptor_info")) {
        return <Navigate to={"/signin"} state={{ from: location }} replace={true} />
    }

    return children;
}
