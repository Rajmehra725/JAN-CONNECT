import { redirect } from "next/navigation";

export default function BoothWorkerLoginRedirect() {
  redirect("/login");
}
