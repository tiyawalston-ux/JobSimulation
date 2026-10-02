import { notFound } from "next/navigation";
import { getCareer } from "@/lib/careers";
import SimDay from "@/components/SimDay";

export default async function SimPage({ params }: { params: Promise<{ career: string }> }) {
  const { career: careerId } = await params;
  const career = getCareer(careerId);
  if (!career || !career.available) notFound();
  return <SimDay career={career} />;
}
