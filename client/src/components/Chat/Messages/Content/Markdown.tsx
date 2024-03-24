import { memo, useContext } from 'react';
import type { TMessage } from 'librechat-data-provider';
import type { PluggableList } from 'unified';
import CodeBlock from '~/components/Messages/Content/CodeBlock';
import { cn, langSubset, validateIframe, processLaTeX } from '~/utils';
import { useChatContext } from '~/Providers';
import store from '~/store';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import supersub from 'remark-supersub';
import rehypeKatex from 'rehype-katex';

type TCodeProps = {
  inline: boolean;
  className?: string;
  children: React.ReactNode;
};

type TContentProps = {
  content: string;
  message: TMessage;
  showCursor?: boolean;
};

const code = memo(({ inline, className, children }: TCodeProps) => {
  const match = /language-(\w+)/.exec(className || '');
  const lang = match && match[1];

  if (inline) {
    return <code className={className}>{children}</code>;
  } else {
    return <CodeBlock lang={lang || 'text'} codeChildren={children} />;
  }
});

const p = memo(({ children }: { children: React.ReactNode }) => {
  return <p className="mb-2 whitespace-pre-wrap">{children}</p>;
});

const cursor = ' ';

const Markdown = memo(({ content, message, showCursor }: TContentProps) => {
  const { isSubmitting, latestMessage } = useChatContext();
  const LaTeXParsing = useRecoilValue<boolean>(store.LaTeXParsing);

  const isInitializing = content === '';

  const { isEdited, messageId } = message ?? {};
  const isLatestMessage = messageId === latestMessage?.messageId;

  let currentContent = content;
  if (!isInitializing) {
    currentContent = currentContent?.replace('z-index: 1;', '') ?? '';
    currentContent = LaTeXParsing ? processLaTeX(currentContent) : currentContent;
  }

  const rehypePlugins: PluggableList = [
    [rehypeKatex, { output: 'mathml' }],
    [
      rehypeHighlight,
      {
        detect: true,
        ignoreMissing: true,
        subset: langSubset,
      },
    ],
    [rehypeRaw],
  ];

  const isValidIframe = !isEdited ? validateIframe(currentContent) : false;

  if (isEdited || (!isInitializing && !isLatestMessage && !isValidIframe)) {
    rehypePlugins.pop();
  }

  return (
    <ReactMarkdown
      remarkPlugins={[supersub, remarkGfm, [remarkMath, { singleDollarTextMath: true }]]}
      rehypePlugins={rehypePlugins}
      linkTarget="_new"
      components={{
        code,
        p,
      }}
    >
      {isLatestMessage && isSubmitting && !isInitializing && showCursor
        ? currentContent + cursor
        : currentContent}
    </ReactMarkdown>
  );
});

export default Markdown;
