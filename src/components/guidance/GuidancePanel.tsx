"use client";

import type { GuidanceResponse, RecoveryStatus } from "@/types/recovery";
import { AlertCircle, Lightbulb, Users } from "lucide-react";
import { cn } from "@/lib/cn";

const STATUS_STYLES: Record<
  RecoveryStatus,
  { badge: string; label: string; icon: string }
> = {
  Stable: {
    badge: "bg-emerald-100 text-emerald-900 border border-emerald-300",
    label: "Stable & Strong",
    icon: "✨",
  },
  "Needs Attention": {
    badge: "bg-yellow-100 text-yellow-900 border border-yellow-300",
    label: "Needs Attention",
    icon: "⚠️",
  },
  "Immediate Support": {
    badge: "bg-red-100 text-red-900 border border-red-300",
    label: "Immediate Support",
    icon: "🆘",
  },
};

interface GuidancePanelProps {
  guidance: GuidanceResponse | null;
  trustedPersonName?: string;
}

export function GuidancePanel({
  guidance,
  trustedPersonName,
}: GuidancePanelProps) {
  if (!guidance) return null;

  const statusStyle = STATUS_STYLES[guidance.recoveryStatus];

  return (
    <div className="px-6 space-y-3">
      {/* Status Badge */}
      <div className="flex items-center justify-between">
        <div className={cn(
          "rounded-full px-4 py-2 text-sm font-semibold inline-flex items-center gap-2",
          statusStyle.badge
        )}>
          <span>{statusStyle.icon}</span>
          {statusStyle.label}
        </div>
        <span className="text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
          {guidance.confidence}% confident
        </span>
      </div>

      {/* Emergency Alert */}
      {guidance.emergency && (
        <div className="rounded-2xl border-2 border-red-400 bg-gradient-to-r from-red-50 to-red-100 p-4 text-red-900 shadow-md">
          <div className="flex gap-3">
            <AlertCircle className="flex-shrink-0 text-red-600" size={24} />
            <div>
              <p className="font-bold text-lg">You may need immediate support</p>
              {guidance.emergencyScript && (
                <p className="mt-2 leading-relaxed text-red-900">
                  {guidance.emergencyScript}
                </p>
              )}
              {trustedPersonName && (
                <p className="mt-3 font-semibold text-red-800">
                  💬 Consider reaching out to {trustedPersonName}.
                  <br />
                  If you are in danger, contact emergency services immediately.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Activity Suggestion */}
      {guidance.shouldSuggestActivity && guidance.suggestedActivity && (
        <div className="rounded-2xl border-2 border-cyan-300 bg-gradient-to-r from-cyan-50 to-blue-50 p-4 text-slate-900 shadow-md">
          <div className="flex gap-3">
            <Lightbulb className="flex-shrink-0 text-cyan-600" size={24} />
            <div>
              <p className="font-bold text-lg">Try something that helps</p>
              <p className="mt-1 text-slate-900">{guidance.suggestedActivity}</p>
              {guidance.activityReason && (
                <p className="mt-2 text-sm text-slate-700 italic">
                  {guidance.activityReason}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Caregiver Alert */}
      {guidance.caregiverAlert && trustedPersonName && (
        <div className="rounded-2xl border-2 border-orange-300 bg-gradient-to-r from-orange-50 to-yellow-50 p-4 text-orange-900 shadow-md">
          <div className="flex gap-3">
            <Users className="flex-shrink-0 text-orange-600" size={24} />
            <div>
              <p className="font-semibold">Share with your support person</p>
              <p className="mt-1">
                It would help to let <span className="font-bold">{trustedPersonName}</span> know you could use some support right now.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
