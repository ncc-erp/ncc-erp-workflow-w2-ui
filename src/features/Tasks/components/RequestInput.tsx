import { TextGroup } from 'common/components/TextGroup/TextGroup';
import { convertToCase, extractContent, parseDateStrings } from 'utils';

interface IRequestProps {
  inputRequestDetail: Record<string, Record<string, string> | string>;
}

export const RequestInput = ({ inputRequestDetail }: IRequestProps) => {
  return (
    <>
      {Object.keys(inputRequestDetail).map((key) => {
        const value = inputRequestDetail[key];
        if (!value) {
          return null;
        }
        if (typeof value === 'object') {
          const { displayName } = value as { displayName?: string };
          if (displayName) {
            return (
              <TextGroup
                key={key}
                label={convertToCase(key)}
                content={displayName}
              />
            );
          }
        } else {
          const dates = parseDateStrings(value);
          return (
            <TextGroup
              key={key}
              label={convertToCase(key)}
              content={extractContent(value)}
              dates={dates}
              isMarkdown
            />
          );
        }
      })}
    </>
  );
};
