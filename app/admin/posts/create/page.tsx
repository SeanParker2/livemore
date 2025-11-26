import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CreatePostForm } from "./_components/CreatePostForm";
import { Libre_Baskerville } from "next/font/google";
import { cn } from "@/lib/utils";

const libreBaskerville = Libre_Baskerville({
  weight: "700",
  subsets: ["latin"],
});

export default async function CreatePostPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("billing_status")
    .eq("id", user.id)
    .single();

  if (profile?.billing_status !== 'founder') {
    return redirect("/");
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className={cn("text-4xl md:text-5xl font-bold mb-8", libreBaskerville.className)}>
        Write New Analysis
      </h1>
      <CreatePostForm />
    </main>
  );
}
