import "next-auth";
import { DefaultSession } from "next-auth";
import { Role } from "@smartedu/shared";

declare module "next-auth" {
  interface User {
    id: string;
    role: Role;
    schoolId: string;
    firstName: string;
    lastName: string;
  }

  interface Session {
    user: User & DefaultSession["user"];
  }
}
