import { TextGroup } from 'common/components/TextGroup/TextGroup';
import { extractContent, parseDateStrings } from 'utils';
import { useTranslation } from 'react-i18next';

interface IRequestProps {
  inputRequestDetail: Record<string, Record<string, string> | string>;
}

const getRequestFieldI18nKey = (fieldKey: string): string => {
  const fieldMappings: Record<string, string> = {
    Staff: 'MY_REQUESTS_PAGE.LABELS.STAFF',
    Project: 'MY_REQUESTS_PAGE.LABELS.PROJECT',
    CurrentOffice: 'MY_REQUESTS_PAGE.LABELS.CURRENT_OFFICE',
    Content: 'MY_REQUESTS_PAGE.LABELS.CONTENT',
    StartDate: 'MY_REQUESTS_PAGE.LABELS.START_DATE',
    EndDate: 'MY_REQUESTS_PAGE.LABELS.END_DATE',
    shortHeader: 'MY_REQUESTS_PAGE.LABELS.SHORT_HEADER',
  };

  return (
    fieldMappings[fieldKey] ||
    `MY_REQUESTS_PAGE.LABELS.${fieldKey.toUpperCase()}`
  );
};

export const RequestInput = ({ inputRequestDetail }: IRequestProps) => {
  const { t } = useTranslation();

  return (
    <>
      {Object.keys(inputRequestDetail).map((key) => {
        const value = inputRequestDetail[key];
        if (!value) {
          return null;
        }

        const fieldI18nKey = getRequestFieldI18nKey(key);
        const fieldLabel = t(fieldI18nKey);

        if (typeof value === 'object') {
          const { displayName } = value as { displayName?: string };
          if (displayName) {
            return (
              <TextGroup key={key} label={fieldLabel} content={displayName} />
            );
          }
        } else {
          const dates = parseDateStrings(value);
          return (
            <TextGroup
              key={key}
              label={fieldLabel}
              content={extractContent(value)}
              dates={dates}
            />
          );
        }
      })}
    </>
  );
};
