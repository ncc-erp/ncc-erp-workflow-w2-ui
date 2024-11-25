import { TextGroup } from 'common/components/TextGroup/TextGroup';
import { convertToCase, extractContent, parseDateStrings } from 'utils';

interface IRequestProps {
  inputRequestDetail: Record<string, Record<string, string> | string>;
}
const { VITE_PUBLIC_IMAGE_URL } = import.meta.env;

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
          if (
            value.includes(
              VITE_PUBLIC_IMAGE_URL ?? 'https://cdn-api.mezon.vn/dev-nccerp'
            )
          ) {
            return (
              <TextGroup
                key={key}
                label={convertToCase(key)}
                content={extractContent(value)}
                urls={value.split(',')}
              />
            );
          }
          const dates = parseDateStrings(value);
          return (
            <TextGroup
              key={key}
              label={convertToCase(key)}
              content={extractContent(value)}
              dates={dates}
            />
          );
        }
      })}
    </>
  );
};
