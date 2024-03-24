import '@testing-library/jest-dom/extend-expect';
import 'test/matchMedia.mock';
import { render, screen, waitFor, fireEvent } from 'test/layout-test-utils';
import userEvent from '@testing-library/user-event';
import { TPlugin } from 'librechat-data-provider';
import PluginStoreItem from '../PluginStoreItem';

const mockPlugin = {
  name: 'Test Plugin',
  description: 'This is a test plugin',
  icon: 'test-icon.png',
};

describe('PluginStoreItem', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    delete window.matchMedia;
  });

  it('renders the plugin name and description', () => {
    render(
      <PluginStoreItem
        plugin={mockPlugin as TPlugin}
        onInstall={() => {
          return;
        }}
        onUninstall={() => {
          return;
        }}
      />,
    );
    expect(screen.getByText('Test Plugin')).toBeInTheDocument();
    expect(screen.getByText('This is a test plugin')).toBeInTheDocument();
  });

  it('calls onInstall when the install button is clicked', async () => {
    const onInstall = jest.fn();
    render(
      <PluginStoreItem
        plugin={mockPlugin as TPlugin}
        onInstall={onInstall}
        onUninstall={() => {
          return;
        }}
      />,
    );
    const installButton = screen.getByText('Install');
    fireEvent.click(installButton);
    await waitFor(() => expect(onInstall).toHaveBeenCalled());
  });

  it('calls onUninstall when the uninstall button is clicked', async () => {
    const onUninstall = jest.fn();
    render(
      <PluginStoreItem
        plugin={mockPlugin as TPlugin}
        onInstall={() => {
          return;
        }}
        onUninstall={onUninstall}
        isInstalled
      />,
    );
    const
