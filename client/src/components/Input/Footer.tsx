import { useGetStartupConfig } from 'librechat-data-provider/react-query';
import { useLocalize } from '~/hooks';

type FooterProps = {
  className?: string;
};

export default function Footer(props: FooterProps) {
  const { data: config } = useGetStartupConfig();
  const localize = useLocalize();

  return (
    <div
      className={props.className}
      title="Footer"
    >
      {config?.customFooter ? (
        config.customFooter
      ) : (
        <>
          <a
            href="https://librechat.ai"
            target="_blank"
            rel="noreferrer"
            className="underline"
            aria-label="Visit LibreChat website"
          >
            {config?.appTitle || 'LibreChat'} v0.6.10
          </a>
          {' - '} {localize?.('com_ui_pay_per_call') || 'Pay per call'}
        </>
      )}
    </div>
  );
}

