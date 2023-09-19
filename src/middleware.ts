export { default } from "next-auth/middleware"
export const config = { matcher: ["/","/task/add","/task/edit/:path*"] }