import React, { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { SettingContainer } from "../../ui/SettingContainer";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";
import { useSettings } from "@/hooks/useSettings";
import { open } from "@tauri-apps/plugin-dialog";

export const ObsidianTranscriptsPath: React.FC = () => {
  const { t } = useTranslation();
  const { getSetting, updateSetting, isUpdating } = useSettings();
  const currentPath = (getSetting("obsidian_transcripts_path") as string) || "";
  const [localPath, setLocalPath] = useState<string>(currentPath);

  const updating = isUpdating("obsidian_transcripts_path");

  const placeholder = useMemo(
    () => t("settings.hotkeys.obsidian.path.placeholder"),
    [t],
  );

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalPath(e.target.value);
    },
    [],
  );

  const onBlur = useCallback(async () => {
    // Persist when leaving the field
    await updateSetting("obsidian_transcripts_path", localPath);
  }, [localPath, updateSetting]);

  const onBrowse = useCallback(async () => {
    try {
      const selected = await open({ directory: true, multiple: false });
      if (typeof selected === "string" && selected.length > 0) {
        setLocalPath(selected);
        await updateSetting("obsidian_transcripts_path", selected);
      }
    } catch (e) {
      // Silently ignore browse cancellation/errors
      console.error(e);
    }
  }, [updateSetting]);

  const onClear = useCallback(async () => {
    setLocalPath("");
    await updateSetting("obsidian_transcripts_path", "");
  }, [updateSetting]);

  return (
    <SettingContainer
      title={t("settings.hotkeys.obsidian.path.title")}
      description={t("settings.hotkeys.obsidian.path.description")}
      descriptionMode="inline"
      grouped
      layout="horizontal"
    >
      <div className="flex items-center gap-2 w-[520px] max-w-full">
        <Input
          value={localPath}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={updating}
          className="w-full"
        />
        <Button variant="secondary" size="sm" onClick={onBrowse} disabled={updating}>
          {t("common.open")}
        </Button>
        <Button variant="secondary" size="sm" onClick={onClear} disabled={updating}>
          {t("common.reset")}
        </Button>
      </div>
    </SettingContainer>
  );
};
