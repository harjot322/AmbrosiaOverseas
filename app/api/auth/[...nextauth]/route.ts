import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import NextAuth from "next-auth/next"
import clientPromise from "@/lib/mongodb"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email/Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.error("Missing email or password.")
          return null
        }
      
        try {
          console.log("Connecting to MongoDB...");
          const client = await clientPromise
          const db = client.db("ambrosia")
          console.log("Connected to database:", db.databaseName);
      
          const usersCollection = db.collection("users")
          console.log("Using collection:", usersCollection.collectionName);
      
          console.log("Searching for user with email:", credentials.email);
          const user = await usersCollection.findOne({ email: credentials.email })
      
          if (!user) {
            console.error("User not found.")
            return null
          }
      
          console.log("User found:", user.email);
          const isPasswordValid = await compare(credentials.password, user.password)
      
          if (!isPasswordValid) {
            console.error("Invalid password.");
            return null
          }
      
          console.log("Authentication successful for:", user.email);
      
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role || "user",
          }
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      }
      ,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string
        session.user.id = token.id as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.JWT_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
