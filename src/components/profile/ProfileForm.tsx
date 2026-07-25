"use client";

import { useState } from "react";
import type { EmergencyTone, RecoveryProfile } from "@/types/recovery";
import {
  COMMON_ACTIVITIES,
  COMMON_TRIGGERS,
  EMERGENCY_TONES,
  RECOVERY_STAGES,
} from "@/lib/constants";
import { cn } from "@/lib/cn";
import {
  ChipInput,
  FormField,
  inputClassName,
  primaryButtonClassName,
  secondaryButtonClassName,
  selectClassName,
} from "./ProfileFormFields";

interface ProfileFormProps {
  initialProfile?: RecoveryProfile;
  onComplete: (profile: RecoveryProfile) => void;
  onCancel?: () => void;
}

const STEPS = [
  { title: "About You", subtitle: "Let's start with the basics." },
  {
    title: "Your Support Network",
    subtitle: "Who and what matters in your recovery.",
  },
  {
    title: "Your Toolkit",
    subtitle: "Activities and tone that work for you.",
  },
] as const;

const emptyProfile: RecoveryProfile = {
  name: "",
  recoveryStage: RECOVERY_STAGES[0],
  substance: "",
  triggers: [],
  trustedPerson: { name: "", relationship: "" },
  healthyActivities: [],
  emergencyTone: "calm",
};

export function ProfileForm({
  initialProfile,
  onComplete,
  onCancel,
}: ProfileFormProps) {
  const [step, setStep] = useState(initialProfile ? 0 : -1);
  const [profile, setProfile] = useState<RecoveryProfile>(
    initialProfile ?? emptyProfile
  );
  const [error, setError] = useState("");

  function updateProfile(partial: Partial<RecoveryProfile>) {
    setProfile((current) => ({ ...current, ...partial }));
  }

  function validateStep(currentStep: number): string | null {
    if (currentStep === 0) {
      if (!profile.name.trim()) return "Please enter your name.";
      if (!profile.recoveryStage) return "Please select a recovery stage.";
    }

    if (currentStep === 1) {
      if (profile.triggers.length === 0) {
        return "Add at least one trigger so Sentinel can support you.";
      }
      if (!profile.trustedPerson.name.trim()) {
        return "Please add a trusted person to reach out to.";
      }
    }

    if (currentStep === 2) {
      if (profile.healthyActivities.length === 0) {
        return "Add at least one healthy activity.";
      }
    }

    return null;
  }

  function goNext() {
    const validationError = validateStep(step);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    if (step < STEPS.length - 1) {
      setStep((current) => current + 1);
      return;
    }

    onComplete({
      ...profile,
      name: profile.name.trim(),
      substance: profile.substance?.trim() || undefined,
      trustedPerson: {
        name: profile.trustedPerson.name.trim(),
        relationship: profile.trustedPerson.relationship?.trim() || undefined,
      },
    });
  }

  function goBack() {
    setError("");
    if (step > 0) {
      setStep((current) => current - 1);
      return;
    }

    if (onCancel) {
      onCancel();
      return;
    }

    setStep(-1);
  }

  if (step === -1) {
    return (
      <div className="flex h-full flex-col justify-center space-y-8 text-center px-6">
        <div className="space-y-4">
          <p className="text-7xl animate-bounce">🌱</p>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Welcome to Sentinel
          </h2>
          <p className="text-lg text-slate-600 max-w-md mx-auto">
            Set up your Recovery Passport so Sentinel can support you in a way
            that feels personal and safe.
          </p>
        </div>

        <ul className="space-y-3 text-left text-sm font-medium">
          <li className="rounded-2xl bg-gradient-to-r from-blue-100 to-blue-50 border border-blue-200 px-4 py-3 text-blue-900">
            ✨ Your profile stays on this device only.
          </li>
          <li className="rounded-2xl bg-gradient-to-r from-cyan-100 to-cyan-50 border border-cyan-200 px-4 py-3 text-cyan-900">
            💭 Sentinel uses it to personalize conversations — never to judge.
          </li>
          <li className="rounded-2xl bg-gradient-to-r from-emerald-100 to-emerald-50 border border-emerald-200 px-4 py-3 text-emerald-900">
            ⚙️ You can update it anytime from the chat screen.
          </li>
        </ul>

        <button
          type="button"
          onClick={() => setStep(0)}
          className={cn(primaryButtonClassName, "w-full text-lg py-4")}
        >
          Create My Recovery Passport
        </button>
      </div>
    );
  }

  const currentStep = STEPS[step];

  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-blue-50 to-white px-6">
      <div className="mb-8 space-y-4">
        <div className="flex items-center justify-between text-sm font-medium text-slate-600">
          <span>
            Step {step + 1} of {STEPS.length}
          </span>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="text-slate-600 hover:text-slate-900 font-semibold"
            >
              Cancel
            </button>
          )}
        </div>

        <div className="flex gap-2">
          {STEPS.map((_, index) => (
            <div
              key={index}
              className={cn(
                "h-2 flex-1 rounded-full transition-all",
                index <= step ? "bg-gradient-to-r from-blue-500 to-cyan-500" : "bg-slate-300"
              )}
            />
          ))}
        </div>

        <div>
          <h2 className="text-3xl font-bold text-slate-900">
            {currentStep.title}
          </h2>
          <p className="mt-1 text-lg text-slate-600">{currentStep.subtitle}</p>
        </div>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto pr-1">
        {step === 0 && (
          <>
            <FormField label="Your name">
              <input
                value={profile.name}
                onChange={(event) => updateProfile({ name: event.target.value })}
                placeholder="What should Sentinel call you?"
                className={inputClassName}
              />
            </FormField>

            <FormField label="Recovery stage">
              <select
                value={profile.recoveryStage}
                onChange={(event) =>
                  updateProfile({ recoveryStage: event.target.value })
                }
                className={selectClassName}
              >
                {RECOVERY_STAGES.map((stage) => (
                  <option key={stage} value={stage}>
                    {stage}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField
              label="Primary substance (optional)"
              description="Only if you feel comfortable sharing."
            >
              <input
                value={profile.substance ?? ""}
                onChange={(event) =>
                  updateProfile({ substance: event.target.value })
                }
                placeholder="e.g. Alcohol"
                className={inputClassName}
              />
            </FormField>
          </>
        )}

        {step === 1 && (
          <>
            <ChipInput
              label="Known triggers"
              description="Situations or feelings that make recovery harder."
              values={profile.triggers}
              onChange={(triggers) => updateProfile({ triggers })}
              suggestions={COMMON_TRIGGERS}
              placeholder="Add a trigger and press Enter"
            />

            <FormField label="Trusted person">
              <input
                value={profile.trustedPerson.name}
                onChange={(event) =>
                  updateProfile({
                    trustedPerson: {
                      ...profile.trustedPerson,
                      name: event.target.value,
                    },
                  })
                }
                placeholder="Name of someone you trust"
                className={inputClassName}
              />
            </FormField>

            <FormField
              label="Relationship (optional)"
              description="Friend, sponsor, family member, etc."
            >
              <input
                value={profile.trustedPerson.relationship ?? ""}
                onChange={(event) =>
                  updateProfile({
                    trustedPerson: {
                      ...profile.trustedPerson,
                      relationship: event.target.value,
                    },
                  })
                }
                placeholder="e.g. Friend"
                className={inputClassName}
              />
            </FormField>
          </>
        )}

        {step === 2 && (
          <>
            <ChipInput
              label="Healthy activities"
              description="Things that help you feel grounded or better."
              values={profile.healthyActivities}
              onChange={(healthyActivities) =>
                updateProfile({ healthyActivities })
              }
              suggestions={COMMON_ACTIVITIES}
              placeholder="Add an activity and press Enter"
            />

            <FormField
              label="Emergency tone"
              description="How should Sentinel speak during difficult moments?"
            >
              <div className="space-y-2">
                {EMERGENCY_TONES.map((tone) => (
                  <label
                    key={tone.value}
                    className={cn(
                      "flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-4 transition",
                      profile.emergencyTone === tone.value
                        ? "border-blue-500 bg-gradient-to-r from-blue-50 to-cyan-50"
                        : "border-slate-300 hover:border-blue-300"
                    )}
                  >
                    <input
                      type="radio"
                      name="emergencyTone"
                      value={tone.value}
                      checked={profile.emergencyTone === tone.value}
                      onChange={() =>
                        updateProfile({
                          emergencyTone: tone.value as EmergencyTone,
                        })
                      }
                      className="mt-1"
                    />
                    <span>
                      <span className="block font-bold text-slate-900">
                        {tone.label}
                      </span>
                      <span className="block text-sm text-slate-600">
                        {tone.description}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </FormField>
          </>
        )}
      </div>

      {error && (
        <p className="mt-4 rounded-2xl bg-red-100 border-2 border-red-300 px-4 py-3 text-sm font-medium text-red-900">
          ⚠️ {error}
        </p>
      )}

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={goBack}
          className={cn(secondaryButtonClassName, "flex-1")}
        >
          Back
        </button>
        <button
          type="button"
          onClick={goNext}
          className={cn(primaryButtonClassName, "flex-1")}
        >
          {step === STEPS.length - 1 ? "Save & Continue" : "Continue"}
        </button>
      </div>
    </div>
  );
}
