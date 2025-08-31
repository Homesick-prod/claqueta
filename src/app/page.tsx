import { redirect } from "next/navigation";

export default function Page() {
  // ส่งผู้ใช้ไปหน้า Project Hub
  redirect("/hub");
}
