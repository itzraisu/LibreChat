import { atom } from 'recoil';
import { SettingsViews } from 'librechat-data-provider';
import type { TOptionSettings } from '~/common';

function localStorageAtom<T>(key: string, defaultValue: T): atom<T> {
  return atom<T>({
    key,
    default: defaultValue,
    effects: [
      ({ setSelf, onSet }) => {
        const savedValue = localStorage.getItem(key);
        if (savedValue !== null) {
          setSelf(JSON.parse(savedValue));
        }

        onSet((newValue: T) => {
          localStorage.setItem(key, JSON.stringify(newValue));
        });
      },
    ],
  });
}

export const abortScroll = atom<boolean>({
  key: 'abortScroll',
  default: false,
});

export const showFiles = atom<boolean>({
  key: 'showFiles',
  default: false,
});

export const optionSettings = atom<TOptionSettings>({
  key: 'optionSettings',
  default: {} as TOptionSettings,
});

export const showPluginStoreDialog = atom<boolean>({
  key: 'showPluginStoreDialog',
  default: false,
});

export const showAgentSettings = atom<boolean>({
  key: 'showAgentSettings',
  default: false,
});

export const currentSettingsView = atom<SettingsViews>({
  key: 'currentSettingsView',
  default: SettingsViews.default,
});

export const showBingToneSetting = atom<boolean>({
  key: 'showBingToneSetting',
  default: false,
});

export const showPopover = atom<boolean>({
  key: 'showPopover',
  default: false,
});

export const autoScroll = localStorageAtom<boolean>('autoScroll', false);
export const showCode = localStorageAtom<boolean>('showCode', false);
export const hideSidePanel = localStorageAtom<boolean>('hideSidePanel', false);
export const modularChat = localStorageAtom<boolean>('modularChat', false);
export const LaTeXParsing = localStorageAtom<boolean>('LaTeXParsing', true);
export const UsernameDisplay = localStorageAtom<boolean>('UsernameDisplay', true);
