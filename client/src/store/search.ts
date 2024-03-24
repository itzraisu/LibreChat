import { TMessage } from 'librechat-data-provider';
import { atom, selector, useRecoilState, useSetRecoilState } from 'recoil';
import { buildTree } from '~/utils';

export type SearchState = {
  isSearchEnabled: boolean | null;
  searchQuery: string;
  searchResultMessages: TMessage[] | null;
};

const searchStateAtom = atom<SearchState>({
  key: 'searchState',
  default: {
    isSearchEnabled: null,
    searchQuery: '',
    searchResultMessages: null,
  },
});

const searchResultMessagesTreeSelector = selector<TMessage[]>({
  key: 'searchResultMessagesTree',
  get: ({ get }) => {
    const searchState = get(searchStateAtom);
    return buildTree({ messages: searchState.searchResultMessages, groupAll: true });
  },
});

export const useSearch = () => {
  const [searchState, setSearchState] = useRecoilState(searchStateAtom);

  const setIsSearchEnabled = (isSearchEnabled: boolean | null) => {
    setSearchState((prevState) => ({ ...prevState, isSearchEnabled }));
  };

  const setSearchQuery = (searchQuery: string) => {
    setSearchState((prevState) => ({ ...prevState, searchQuery }));
  };

  const setSearchResultMessages = (searchResultMessages: TMessage[] | null) => {
    setSearchState((prevState) => ({ ...prevState, searchResultMessages }));
  };

  return {
    isSearchEnabled: searchState.isSearchEnabled,
    searchQuery: search
