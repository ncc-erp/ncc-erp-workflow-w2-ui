import { Roles } from "common/constants";
import { LocalStorageKeys } from "common/enums";
import { useMemo } from "react";
import { parseJwt } from "utils/parseJwt";

export function useIsAdmin() {
    const token = localStorage.getItem(LocalStorageKeys.accessToken);
    const decodedToken = useMemo(() => {
        if (token) {
            return parseJwt(token);
        }
        return null;
    }, [token]);

    const isAdmin = decodedToken ? decodedToken.role === Roles.Admin : false;

    return isAdmin;
}