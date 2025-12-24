import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export const getSession = async () => getServerSession(authOptions)

export const isAdmin = (session: Awaited<ReturnType<typeof getSession>>) =>
  session?.user?.role === "admin"

export const isSameUser = (
  session: Awaited<ReturnType<typeof getSession>>,
  userId: string,
) => session?.user?.id === userId
