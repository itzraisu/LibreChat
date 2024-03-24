import { useParams } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useCallback, useEffect, useState, useMemo, memo } from 'react';
import type { ConversationListResponse } from 'librechat-data-provider';
import {
  useMediaQuery,
  useAuthContext,
  useConversation,
  useLocalStorage,
  useNavScrolling,
  useConversations,
} from '~/hooks';
import { useSearchInfiniteQuery, useConversationsInfiniteQuery } from '~/data-provider';
import { TooltipProvider, Tooltip } from '~/components/ui';
import { Conversations } from '~/components/Conversations';
import { Spinner } from '~/components/svg';
import SearchBar from './SearchBar';
import NavToggle from './NavToggle';
import NavLinks from './NavLinks';
import NewChat from './NewChat';
import { cn } from '~/utils';
import store from '~/store';

const Nav = ({ navVisible, setNavVisible }) => {
  const { conversationId } = useParams();
  const { isAuthenticated } = useAuthContext();

  const [navWidth, setNavWidth] = useState('260px');
  const [isHovering, setIsHovering] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width: 768px)');
  const [newUser, setNewUser] = useLocalStorage('newUser', true);
  const [isToggleHovering, setIsToggleHovering] = useState(false);

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
  }, []);

  useEffect(() => {
    if (isSmallScreen) {
      setNavWidth('320px');
    } else {
      setNavWidth('260px');
    }
  }, [isSmallScreen]);

  const [pageNumber, setPageNumber] = useState(1);
  const [showLoading, setShowLoading] = useState(false);

  const searchQuery = useRecoilValue(store.searchQuery);
  const isSearchEnabled = useRecoilValue(store.isSearchEnabled);
  const { newConversation, searchPlaceholderConversation } = useConversation();

  const { refreshConversations } = useConversations();
  const setSearchResultMessages = useSetRecoilState(store.searchResultMessages);

  const { data: conversationsData, fetchNextPage: fetchConversationsNextPage, hasNextPage: conversationsHasNextPage, isFetchingNextPage: conversationsIsFetchingNextPage } = useConversationsInfiniteQuery(
    { pageNumber: pageNumber.toString() },
    { enabled: isAuthenticated },
  );

  const { data: searchData, fetchNextPage: fetchSearchNextPage, hasNextPage: searchHasNextPage, isFetchingNextPage: searchIsFetchingNextPage } = useSearchInfiniteQuery(
    { pageNumber: pageNumber.toString(), searchQuery: searchQuery },
    { enabled: isAuthenticated && !!searchQuery.length },
  );

  const { containerRef, moveToTop } = useNavScrolling({
    setShowLoading,
    hasNextPage: searchQuery ? searchHasNextPage : conversationsHasNextPage,
    fetchNextPage: searchQuery ? fetchSearchNextPage : fetchConversationsNextPage,
    isFetchingNextPage: searchQuery ? searchIsFetchingNextPage : conversationsIsFetchingNextPage,
  });

  const conversations = useMemo(
    () =>
      (searchQuery ? searchData?.pages.flatMap((page) => page.conversations) : conversationsData?.pages.flatMap((page) => page.conversations)) ||
      [],
    [conversationsData, searchData, searchQuery],
  );

  const onSearchSuccess = useCallback(({ data }: { data: ConversationListResponse }) => {
    const res = data;
    searchPlaceholderConversation();
    setSearchResultMessages(res.messages);
  }, []);

  useEffect(() => {
    if (searchData && searchData.pages[0]) {
      onSearchSuccess({ data: searchData.pages[0] });
    }
  }, [searchData, onSearchSuccess]);

  const clearSearch = () => {
    setPageNumber(1);
    refreshConversations();
    if (conversationId == 'search') {
      newConversation();
    }
  };

  const toggleNavVisible = () => {
    setNavVisible((prev) => {
      localStorage.setItem('navVisible', JSON.stringify(!prev));
      return !prev;
    });
    if (newUser) {
      setNewUser(false);
    }
  };

  const itemToggleNav = () => {
    if (isSmallScreen) {
      toggleNavVisible();
    }
  };

  return (
    <TooltipProvider delayDuration={250}>
      <Tooltip>
        <div
          className={
            'nav active max-w-[320px] flex-shrink-0 overflow-x-hidden bg-gray-50 dark:bg-gray-750 md:max-w-[260px]'
          }
          style={{
            width: navVisible ? navWidth : '0px',
            visibility: navVisible ? 'visible' : 'hidden',
            transition: 'width 0.2s, visibility 0.2s',
          }}
        >
          <div className="h-full w-[320px] md:w-[260px]">
            <div className="flex h-full min-h-0 flex-col">
              <div
                className={cn(
                  'flex h-full min-h-0 flex-col transition-opacity',
                  isToggleHovering && !isSmallScreen ? 'opacity-50' : 'opacity-100',
                )}
             
