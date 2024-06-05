export function isRouteProtected(url: string) {
  if (url.includes("/api/users")) {
    return true;
  }
  if (url.includes("/api/customer")) {
    return true;
  }
  if (url.includes("/api/order")) {
    return true;
  }
  if (url.includes("/api/product")) {
    return true;
  }
  if (url.includes("/api/supplier")) {
    return true;
  }
  if (url.includes("/api/store")) {
    return true;
  }
  return false;
}
