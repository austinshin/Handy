import React from "react";
import { useTranslation } from "react-i18next";
import { ToggleSwitch } from "../ui/ToggleSwitch";
import { useSettings } from "../../hooks/useSettings";

interface LivePreviewLowFrequencyProps {
  descriptionMode?: "inline" | "tooltip";
  grouped?: boolean;
}

export const LivePreviewLowFrequency: React.FC<LivePreviewLowFrequencyProps> =
  React.memo(({ descriptionMode = "tooltip", grouped = false }) => {
    const { t } = useTranslation();
    const { getSetting, updateSetting, isUpdating } = useSettings();

    const previewEnabled = getSetting("live_preview_enabled") ?? true;
    const lowFrequencyEnabled = getSetting("live_preview_low_frequency") ?? false;

    return (
      <ToggleSwitch
        checked={lowFrequencyEnabled}
        onChange={(next) => updateSetting("live_preview_low_frequency", next)}
        isUpdating={isUpdating("live_preview_low_frequency")}
        disabled={!previewEnabled}
        label={t("settings.advanced.livePreviewLowFrequency.label")}
        description={t("settings.advanced.livePreviewLowFrequency.description")}
        descriptionMode={descriptionMode}
        grouped={grouped}
      />
    );
  });

