import copy from 'copy-to-clipboard';
import { InformationCircleIcon } from '@heroicons/react/outline';
import { CheckIcon } from '@heroicons/react/solid';
import cn from 'classnames';
import React, { useRef, useState } from 'react';

type CodeBarProps = {
  lang: string;
  isPlugin?: boolean;
  isError?: boolean;
};

type CodeBlockProps = CodeBarProps & {
  children: React.ReactNode;
  className?: string;
};

const CodeBar: React.FC<CodeBarProps> = ({ lang, isPlugin, isError, children }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    const codeString = children.current?.textContent;
    if (codeString) {
      setIsCopied(true);
      copy(codeString);

      setTimeout(() => {
        setIsCopied(false);
      }, 3000);
    }
  };

  return (
    <div
      className={cn(
        'flex items-center rounded-tl-md rounded-tr-md bg-gray-700 px-4 py-2 font-sans text-xs text-gray-200 dark:bg-gray-700',
        {
          'justify-between': !isPlugin && !isError,
          'justify-end': isPlugin || isError,
        },
      )}
    >
      <span className="">{lang}</span>
      {isPlugin || isError ? (
        children
      ) : (
        <button
          className="ml-auto flex gap-2 text-white/50"
          onClick={handleCopy}
        >
          {isCopied ? (
            <>
              <CheckIcon className="h-4 w-4" />
              {isError ? '' : 'Copied!'}
            </>
          ) : (
            <>
              <InformationCircleIcon className="h-4 w-4" />
              {isError ? '' : 'Copy code'}
            </>
          )}
        </button>
      )}
    </div>
  );
};

const CodeBlock: React.FC<CodeBlockProps> = ({
  lang,
  children,
  className,
  isPlugin,
  isError,
}) => {
  const language = isPlugin || isError ? 'json' : lang;
  const codeRef = useRef<HTMLPreElement>(null);

  return (
    <div
      className={cn(
        'w-full rounded-md bg-gray-900 text-xs text-white/80',
        className,
      )}
    >
      <CodeBar lang={lang} isPlugin={isPlugin} isError={isError}>
        {children}
      </CodeBar>
      <pre
        ref={codeRef}
        className={cn(
          isPlugin || isError ? '!whitespace-pre-wrap' : `language-${language} !whitespace-pre`,
          'overflow-y-auto p-4',
        )}
      >
        {children}
      </pre>
    </div>
  );
};

export default CodeBlock;
