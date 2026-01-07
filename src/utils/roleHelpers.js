import { ROLES } from "@/constants/roles";

/** Role checks */
export const isGazaUser = (user) => user?.role === ROLES.KP; // kp = غزاوي
export const isOutsideGazaUser = (user) => user?.role === ROLES.KR; // kr = برا غزة

/** Optional: direct checks */
export const hasRole = (user, role) => user?.role === role;
