import { redirect } from "next/navigation";

export default function CitizenLoginRedirect() {
  redirect("/login");
}
