import { cn } from '~/utils';

const QuestionMark = ({ className = '', size = '3.5', ...rest }) => {
  return (
    <span>
      <div
        className={cn(
          `border-token-border-medium text-token-text-tertiary ml-2 flex h-${size} w-${size} cursor-default items-center justify-center rounded-full border text-[0.5rem] font-medium leading-none`,
          className,
        )}
        {...rest}
      >
        ?
      </div>
    </span>
  );
};

export default QuestionMark;
