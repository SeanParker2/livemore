
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ResourceDownloadButton from "./ResourceDownloadButton";

export default async function ResourcesPage() {
  const supabase = await createClient();
  const { data: resources, error } = await supabase
    .from("resources")
    .select("*, profile:profiles(billing_status)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching resources:", error);
    // 在生产环境中，您可能希望向用户显示一个更友好的错误消息
    return <div>加载资源失败，请稍后重试。</div>;
  }
  
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="container mx-auto py-12">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight">会员资源库</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          精选高价值的独家资源，助力您的成长与决策。
        </p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {resources.map((resource) => (
          <Card key={resource.id} className="flex flex-col">
            <CardHeader>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={resource.cover_image} alt={resource.title} className="w-full h-48 object-cover rounded-t-lg" />
              <CardTitle className="mt-4">{resource.title}</CardTitle>
              <CardDescription>{resource.description}</CardDescription>
            </CardHeader>
            <CardContent className="grow flex flex-col justify-end">
              <ResourceDownloadButton resource={resource} userId={user?.id} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
