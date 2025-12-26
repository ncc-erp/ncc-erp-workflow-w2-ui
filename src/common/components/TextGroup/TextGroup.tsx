import { useOffices } from 'api/apiHooks/requestHooks';
import styles from './style.module.scss';
import { TbDownload, TbEye, TbFile } from 'react-icons/tb';
import { Icon, IconButton, Tooltip, HStack, Text } from '@chakra-ui/react';
import { useDownloadFile } from 'api/apiHooks';

interface ITextGroup {
  label: string;
  content?: string | number | null;
  color?: string;
  dates?: string[];
  urls?: string[];
}

export const TextGroup = ({
  label,
  content,
  color,
  dates,
  urls,
}: ITextGroup) => {
  const { data: offices } = useOffices();
  const currentOffice = offices?.find((office) => office.code === content)
    ?.displayName;
  const downloadFile = useDownloadFile();
  const handleDownload = (fileName: string) => {
    downloadFile(fileName);
  };

  return (
    <div className={styles.textGroup}>
      <label className={styles.label}>{label}</label>
      {dates && (
        <div className={styles.dates}>
          {dates &&
            dates.map((date, index) => (
              <p className={styles.date} key={index}>
                {date}
              </p>
            ))}
        </div>
      )}
      {urls && (
        <div className={styles.attachments}>
          {urls.map((url, index) => {
            const fileName = url.split('/').pop() ?? '';

            return (
              <HStack
                key={index}
                className={styles.attachmentRow}
                spacing={3}
                align="center"
              >
                <Icon
                  as={TbFile}
                  className={styles.attachmentIcon}
                  boxSize={6}
                />
                <Tooltip label={fileName} hasArrow>
                  <Text className={styles.fileName} isTruncated maxW="100%">
                    {fileName}
                  </Text>
                </Tooltip>
                <HStack spacing={2} className={styles.attachmentActions}>
                  <Tooltip label="Preview" hasArrow>
                    <IconButton
                      aria-label="Preview file"
                      icon={<Icon as={TbEye} boxSize={5} />}
                      size="sm"
                      variant="ghost"
                      as="a"
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                    />
                  </Tooltip>
                  <Tooltip label="Download" hasArrow>
                    <IconButton
                      aria-label="Download file"
                      icon={<Icon as={TbDownload} boxSize={5} />}
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownload(fileName)}
                    />
                  </Tooltip>
                </HStack>
              </HStack>
            );
          })}
        </div>
      )}
      {!dates && !urls && (
        <p
          className={`${styles.content} ${
            color ? styles[`content-${color}`] : ''
          }`}
        >
          {currentOffice ? currentOffice : content}
        </p>
      )}
    </div>
  );
};
