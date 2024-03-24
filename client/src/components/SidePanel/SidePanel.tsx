import throttle from 'lodash/throttle';
import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { useGetEndpointsQuery, useUserKeyQuery } from 'librechat-data-provider/react-query';
import type { ImperativePanelHandle } from 'react-resizable-panels';
import { EModelEndpoint, type TEndpointsConfig } from 'librechat-data-provider';
import type { NavLink } from '~/common';
import { ResizableHandleAlt, ResizablePanel, ResizablePanelGroup } from '~/components/ui/Resizable';
import { TooltipProvider, Tooltip } from '~/components/ui/Tooltip';
import { Blocks, AttachmentIcon } from '~/components/svg';
import { useMediaQuery, useLocalStorage } from '~/hooks';
import { Separator } from '~/components/ui/Separator';
import NavToggle from '~/components/Nav/NavToggle';
import PanelSwitch from './Builder/PanelSwitch';
import FilesPanel from './Files/Panel';
import Switcher from './Switcher';
import Nav from './Nav';

interface SidePanelProps {
  defaultLayout?: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize?: number;
  children: React.ReactNode;
}

const defaultMinSize = 20;

const NavToggleWithResize = ({
  navVisible,
  isHovering,
  onToggle,
  setIsHovering,
  className,
  translateX,
  side,
}: {
  navVisible: boolean;
  isHovering: boolean;
  onToggle: () => void;
  setIsHovering: (value: boolean) => void;
  className?: string;
  translateX?: boolean;
  side?: 'left' | 'right';
}) => {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <div
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className={cn(
            'fixed top-1/2',
            side === 'right' ? 'mr-16' : 'ml-16',
            translateX ? 'translate-x-full' : '',
          )}
        >
          <NavToggle
            navVisible={navVisible}
            isHovering={isHovering}
            onToggle={onToggle}
            setIsHovering={setIsHovering}
            className={cn('', className)}
            translateX={translateX}
            side={side}
          />
        </div>
      </Tooltip>
    </TooltipProvider>
  );
};

const ResizableHandleWithHandle = ({
  className,
}: {
  className?: string;
}) => {
  return (
    <ResizableHandleAlt withHandle className={cn('bg-transparent dark:text-white', className)} />
  );
};

export default function SidePanel({
  defaultLayout = [97, 3],
  defaultCollapsed = false,
  navCollapsedSize = 3,
  children,
}: SidePanelProps) {
  const [minSize, setMinSize] = useState(defaultMinSize);
  const [isHovering, setIsHovering] = useState(false);
  const [newUser, setNewUser] = useLocalStorage('newUser', true);
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [collapsedSize, setCollapsedSize] = useState(navCollapsedSize);
  const { data: endpointsConfig = {} as TEndpointsConfig } = useGetEndpointsQuery();
  const { data: keyExpiry = { expiresAt: undefined } } = useUserKeyQuery(EModelEndpoint.assistants);
  const isSmallScreen = useMediaQuery('(max-width: 767px)');

  const panelRef = useRef<ImperativePanelHandle>(null);

  const activePanel = localStorage.getItem('side:active-panel');
  const defaultActive = activePanel ? activePanel : undefined;

  const Links = useMemo(() => {
    const links: NavLink[] = [];
    const assistants = endpointsConfig?.[EModelEndpoint.assistants];
    const userProvidesKey = !!assistants?.userProvide;
    const keyProvided = userProvidesKey ? !!keyExpiry?.expiresAt : true;
    if (assistants && assistants.disableBuilder !== true && keyProvided) {
      links.push({
        title: 'com_sidepanel_assistant_builder',
        label: '',
        icon: Blocks,
        id: 'assistants',
        Component: PanelSwitch,
      });
    }

    links.push({
      title: 'com_sidepanel_attach_files',
      label: '',
      icon: AttachmentIcon,
      id: 'files',
      Component: FilesPanel,
    });

    return links;
  }, [endpointsConfig, keyExpiry?.expiresAt]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const throttledSaveLayout = useCallback(
    throttle((sizes: number[]) => {
      localStorage.setItem('react-resizable-panels:layout', JSON.stringify(sizes));
    }, 350),
    [],
  );

  useEffect(() => {
    if (isSmallScreen) {
      setIsCollapsed(true);

