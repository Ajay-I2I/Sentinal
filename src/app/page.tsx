"use client";

import { useState } from "react";
import { ChatInterface } from "@/components/guidance/ChatInterface";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { useProfile } from "@/hooks/useProfile";
import type { RecoveryProfile } from "@/types/recovery";

type AppView = "chat" | "onboarding" | "edit";

export default function Home() {
  const { profile, isLoading, saveProfile } = useProfile();
  const [view, setView] = useState<AppView>("chat");

  function handleProfileComplete(nextProfile: RecoveryProfile) {
    saveProfile(nextProfile);
    setView("chat");
  }

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex h-full items-center justify-center text-zinc-500">
          Loading your space...
        </div>
      </AppShell>
    );
  }

  if (!profile || view === "onboarding") {
    return (
      <AppShell>
        <ProfileForm onComplete={handleProfileComplete} />
      </AppShell>
    );
  }

  if (view === "edit") {
    return (
      <AppShell>
        <ProfileForm
          initialProfile={profile}
          onComplete={handleProfileComplete}
          onCancel={() => setView("chat")}
        />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <ChatInterface
        profile={profile}
        onEditProfile={() => setView("edit")}
      />
    </AppShell>
  );
}

function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex h-screen w-screen bg-white">
      <div className="flex w-full flex-col">
        {children}
      </div>
    </main>
  );
}
