import React from "react";
import { useTranslation } from "react-i18next";
import { SettingsGroup } from "../../ui/SettingsGroup";
import { ShortcutInput } from "../ShortcutInput";
import { ObsidianTranscriptsPath } from "../obsidian/ObsidianTranscriptsPath";

export const HotkeysSettings: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="max-w-3xl w-full mx-auto space-y-6">
      <SettingsGroup title={t("settings.hotkeys.title")}>
        <div className="space-y-4">
          <ShortcutInput shortcutId="transcribe" />
          <ShortcutInput shortcutId="transcribe_with_post_process" />
          <ShortcutInput shortcutId="transcribe_to_obsidian" />
          <ShortcutInput shortcutId="cancel" />
        </div>
      </SettingsGroup>
      <SettingsGroup title={t("settings.hotkeys.obsidian.title")}>
        <ObsidianTranscriptsPath />
      </SettingsGroup>
    </div>
  );
};