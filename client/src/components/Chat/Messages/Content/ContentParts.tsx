import { Suspense, forwardRef } from 'react';
import type { TMessageContentParts, TMessageProps } from 'librechat-data-provider';
import { UnfinishedMessage } from './MessageContent';
import { DelayedRender } from '~/components/ui';
import Part from './Part';

type ContentPartsProps = TMessageProps & {
  error?: string;
  unfinished?: boolean;
  isSubmitting: boolean;
  isLast: boolean;
};

const ContentParts = forwardRef<HTMLDivElement, ContentPartsProps>((props, ref) => {
  if (props.error) {
    return <ErrorMessage text={props.error} />;
  } else {
    const { message } = props;
    const { messageId } = message;

    return (
      <div ref={ref}>
        {props.content
          .filter((part): part is TMessageContentParts => part !== undefined)
          .map((part, idx) => {
            const showCursor = idx === props.content.length - 1 && props.isLast;
            return (
              <Part
                key={`display-${messageId}-${idx}`}
                showCursor={showCursor && props.isSubmitting}
                isSubmitting={props.isSubmitting}
                part={part}
                {...props}
              />
            );
          })}
        {!props.isSubmitting && props.unfinished && (
          <Suspense>
            <DelayedRender delay={250}>
              <UnfinishedMessage key={`unfinished-${messageId}`} />
            </DelayedRender>
          </Suspense>
        )}
      </div>
    );
  }
});

export default ContentParts;
