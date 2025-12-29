import { TextGroup } from 'common/components/TextGroup/TextGroup';
import { convertToCase, extractContent, parseDateStrings } from 'utils';

interface IRequestProps {
  inputRequestDetail: Record<string, Record<string, string> | string>;
}

export const RequestInput = ({ inputRequestDetail }: IRequestProps) => {
  return (
    <>
      {Object.keys(inputRequestDetail).map((key) => {
        if (key.endsWith('_label')) {
          return null;
        }

        const value = inputRequestDetail[key];
        if (!value) {
          return null;
        }

        const labelKey = `${key}_label`;
        const labelValue = inputRequestDetail[labelKey];
        const displayContent = labelValue || value;

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
              content={extractContent(displayContent as string)}
              dates={dates}
            />
          );
        }
      })}
    </>
  );
};
