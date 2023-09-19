import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { cookies } from "next/headers";
import GoogleProvider from "next-auth/providers/google";
import { axiosInstance } from "@/shared/services/axiosInstance";
export const authOptions:NextAuthOptions= {
  secret: process.env.NEXTAUTH_SECRET,
    pages: {
      signIn: "/login"
    },

    providers: [
      CredentialsProvider({
        name: "Credentials",

        credentials: {
          email: {
            label: "email",
            type: "email",
            placeholder: "Enter your email",
          },
          password: {
            label: "password",
            type: "password",
            placeholder: "Enter your password",
          },
        },
        async authorize(credentials: any, req: any): Promise<any> {
          try {
            const response = await axiosInstance.post("/login", {
              email: credentials?.email,
              password: credentials?.password,
            });

            if (response.status === 200) {
              const user = {
                name: response.data.user._doc.name,
                email: response.data.user._doc.email,
                accessToken:response.data.user.token
              };
              // const cookie = response.headers["set-cookie"] || [];
              // const accessToken = cookie[0].split(";")[0].split("=")[1];
              // const cookieStore = cookies();  console.log("headers",req.headers.authorization)

              // cookieStore.set("accessToken", accessToken, {
              //   httpOnly: true, // Ensures the cookie is only accessible via HTTP(S)
              //   secure: true, // Ensures the cookie is only sent over HTTPS
              //   maxAge: 24 * 60 * 60 * 1000, // One day
              //   sameSite: "none",
              //   path: "/",
              //   domain: "localhost",
              // });

              return user;
            } else {
              throw new Error("Authentication failed");
            }
          } catch (error) {
            console.error("Authentication error:");
            return null;
          }
        },
      }),
      GoogleProvider({
        clientId: process.env.GOOGLE_ID as string,
        clientSecret: process.env.GOOGLE_SECRET as string,
      }),
    ],
    session: {
      strategy: "jwt",
    },
    callbacks: {
      async signIn({ user, account, profile, email, credentials }: any):Promise<any> {
        if (account.provider === "google") {
          try {
            const result = await axiosInstance.post("/user/google", {
              id: user.id,
              name: user.name,
              email: user.email,
              image: user.image,
            });
                user.accessToken= result.data.token
            // const cookie = result.headers["set-cookie"] || [];
            // const accessToken = cookie[0].split(";")[0].split("=")[1];
            // const cookieStore = cookies();
            // cookieStore.set("accessToken", accessToken, {
            //   httpOnly: true, // Ensures the cookie is only accessible via HTTP(S)
            //   secure: true, // Ensures the cookie is only sent over HTTPS
            //   maxAge: 24 * 60 * 60 * 1000, // One day
            //   sameSite: "none",
            //   path: "/",
            //   domain: "localhost",
            // });
          } catch (e) {
            return false;
          }

          return true;
        }
        if (account.provider === "credentials") {
          if (user) return true;
          return false;
        }
      },
      async jwt({ token, user }) {
        if (user) {
        
          token.accessToken = user.accessToken;
         
        }
  
        return token;
      },
      async session({ session, token }) {
        if(session){
        session.user.accessToken = token.accessToken;
        
        }
        return session;
      },
    },
  };



