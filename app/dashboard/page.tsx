
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { updateProfile } from "@/lib/actions/user-actions";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*, subscription:subscriptions(*)")
    .eq("id", user.id)
    .single();

  if (!profile) {
    // This case should ideally not happen for a logged-in user
    // unless there's a data consistency issue.
    redirect("/");
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">用户中心</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: User Profile Card */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="items-center">
              <Avatar className="w-24 h-24 mb-4">
                <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
                <AvatarFallback>{getInitials(profile.full_name || 'U')}</AvatarFallback>
              </Avatar>
              <CardTitle>{profile.full_name}</CardTitle>
              <Badge variant={profile.billing_status === 'premium' ? 'default' : 'secondary'}>
                {profile.billing_status || 'Free'}
              </Badge>
            </CardHeader>
          </Card>
        </div>

        {/* Right Column: Settings */}
        <div className="md:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>我的订阅</CardTitle>
              <CardDescription>查看您当前的订阅计划和状态。</CardDescription>
            </CardHeader>
            <CardContent>
              <p>当前计划: <span className="font-semibold">{profile.billing_status === 'premium' ? 'Premium' : 'Free'}</span></p>
              {/* In a real app, you'd show expiry date from Stripe data */}
              {profile.billing_status === 'premium' && <p className="text-sm text-muted-foreground mt-2">会员资格有效。</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>账户设置</CardTitle>
              <CardDescription>管理您的账户信息。</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={updateProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">昵称</Label>
                  <Input id="fullName" name="fullName" defaultValue={profile.full_name ?? ''} />
                </div>
                <Button type="submit">更新昵称</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
