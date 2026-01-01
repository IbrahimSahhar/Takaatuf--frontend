import { ROLES } from "@/constants/roles";

/* Role checks */
export const isGazaUser = (user) => user?.role === ROLES.KP;
export const isOutsideGazaUser = (user) => user?.role === ROLES.KR;

/* Optional: direct checks */
export const hasRole = (user, role) => user?.role === role;
