"use client";

import { useCallback, useEffect, useState } from "react";
import type { RecoveryProfile } from "@/types/recovery";
import {
  clearProfile as removeProfile,
  getProfile,
  saveProfile as persistProfile,
} from "@/lib/storage";

export function useProfile() {
  const [profile, setProfile] = useState<RecoveryProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setProfile(getProfile());
    setIsLoading(false);
  }, []);

  const saveProfile = useCallback((next: RecoveryProfile) => {
    persistProfile(next);
    setProfile(next);
  }, []);

  const clearProfile = useCallback(() => {
    removeProfile();
    setProfile(null);
  }, []);

  return { profile, isLoading, saveProfile, clearProfile };
}
