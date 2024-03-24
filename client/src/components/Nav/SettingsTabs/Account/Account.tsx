import React from 'react';
import { useRecoilState } from 'recoil';
import { SettingsTabValues } from 'librechat-data-provider';
import { Switch } from '~/components/ui';
import { useLocalize } from '~/hooks';
import Avatar from './Avatar';
import { useTabs } from '@radix-ui/react-tabs';
import { store } from '~/store';

type AccountProps = {
  onCheckedChange?: (value: boolean) => void;
};

const Account: React.FC<AccountProps> = ({ onCheckedChange }) => {
  const [UsernameDisplay, setUsernameDisplay] = useRecoilState<boolean>(store.UsernameDisplay);
  const localize = useLocalize();

  const handleCheckedChange = (value: boolean) => {
    setUsernameDisplay(value);
    if (onCheckedChange) {
      onCheckedChange(value);
    }
  };

  const { onValueChange } = useTabs();

  return (
    <Tabs.Content
      value={SettingsTabValues.ACCOUNT}
      data-testid="account-tab-content"
      aria-label={localize('com_nav_user_settings_account')}
      onValueChange={onValueChange}
    >
      <Avatar alt={localize('com_nav_user_name_display')} />
      <Switch
        id="UsernameDisplay"
        name="UsernameDisplay"
        checked={UsernameDisplay}
        onCheckedChange={handleCheckedChange}
        className="ml-4 mt-2"
        defaultChecked={UsernameDisplay}
        data-testid="Username
