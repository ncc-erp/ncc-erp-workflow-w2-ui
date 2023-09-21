import { TextGroup } from 'common/components/TextGroup/TextGroup';
import { convertToCase, extractContent, parseDateStrings } from 'utils';

interface IRequestProps {
  inputRequestDetail: Record<string, Record<string, string> | string>;
}

export const RequestInput = ({ inputRequestDetail }: IRequestProps) => {
  const TextGroupRequest = Object.keys(inputRequestDetail).map((key) => {
    const value = inputRequestDetail[key];

    if (typeof value === 'object' && value !== null) {
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
        />
      );
    }
  });

  return <>{TextGroupRequest}</>;
};
