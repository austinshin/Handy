import React from "react";
import { useTranslation } from "react-i18next";
import { ToggleSwitch } from "../ui/ToggleSwitch";
import { useSettings } from "../../hooks/useSettings";

interface LivePreviewEnabledProps {
  descriptionMode?: "inline" | "tooltip";
  grouped?: boolean;
}

export const LivePreviewEnabled: React.FC<LivePreviewEnabledProps> = React.memo(
  ({ descriptionMode = "tooltip", grouped = false }) => {
    const { t } = useTranslation();
    const { getSetting, updateSetting, isUpdating } = useSettings();

    const enabled = getSetting("live_preview_enabled") ?? true;

    return (
      <ToggleSwitch
        checked={enabled}
        onChange={(next) => updateSetting("live_preview_enabled", next)}
        isUpdating={isUpdating("live_preview_enabled")}
        label={t("settings.advanced.livePreviewEnabled.label")}
        description={t("settings.advanced.livePreviewEnabled.description")}
        descriptionMode={descriptionMode}
        grouped={grouped}
      />
    );
  },
);

