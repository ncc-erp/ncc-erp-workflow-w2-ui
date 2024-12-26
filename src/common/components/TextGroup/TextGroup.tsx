import { useOffices } from 'api/apiHooks/requestHooks';
import styles from './style.module.scss';
import { TbDownload, TbEye, TbFile } from 'react-icons/tb';
import { Icon } from '@chakra-ui/react';
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
        <div>
          {urls.map((url, index) => (
            <p key={index}>
              <Icon as={TbFile} />
              <span>{url.split('/').pop()}</span>
              <a href={url} target="_blank">
                <Icon as={TbEye} />
              </a>
              <Icon
                cursor="pointer"
                as={TbDownload}
                onClick={() => handleDownload(url.split('/').pop() ?? '')}
              />
            </p>
          ))}
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
