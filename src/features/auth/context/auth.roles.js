const normalizeRole = (role) =>
  String(role || "")
    .toLowerCase()
    .trim();

// role aliases -> canonical role
const ROLE_ALIASES = {
  // kp (Gaza)
  knowledge_provider: "kp",
  provider: "kp",

  // kr (Outside Gaza)
  knowledge_requester: "kr",
  requester: "kr",

  // admin
  administrator: "admin",
};

// allowed canonical roles in the app
const CANONICAL = new Set(["kp", "kr", "admin"]);

// return kp/kr/admin when possible, otherwise normalized value
export const canonicalizeRole = (role) => {
  const r = normalizeRole(role);
  if (!r) return "";

  if (CANONICAL.has(r)) return r;

  const mapped = ROLE_ALIASES[r];
  if (mapped) return mapped;

  return r;
};
