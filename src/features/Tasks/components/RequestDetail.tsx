import { useOffices } from 'api/apiHooks/requestHooks';
import { TextGroup } from 'common/components/TextGroup/TextGroup';
import { requestTemplateWorkflow } from 'common/constants';
import { IRequest } from 'models/task';
import { extractContent } from 'utils/extractContent';

interface IRequestProps {
  type: string | undefined;
  inputRequestDetail: IRequest | undefined;
}

export const RequestDetail = ({ type, inputRequestDetail }: IRequestProps) => {
  const { data: offices } = useOffices();
  const RequestComponent = {
    [requestTemplateWorkflow.WFH_REQUEST]: (
      <>
        <TextGroup
          label="Current office"
          content={
            offices?.find(
              (office) => office.code === inputRequestDetail?.CurrentOffice
            )?.displayName
          }
        />
        <TextGroup label="Project" content={inputRequestDetail?.Project} />
        <TextGroup
          label="Reason"
          content={extractContent(inputRequestDetail?.Reason)}
        />
        <TextGroup
          label="Dates"
          dates={
            inputRequestDetail?.Dates
              ? inputRequestDetail?.Dates.split(',')
              : []
          }
        />
      </>
    ),
    [requestTemplateWorkflow.OFFICE_EQUIPMENT]: (
      <>
        <TextGroup
          label="Current office"
          content={
            offices?.find(
              (office) => office.code === inputRequestDetail?.CurrentOffice
            )?.displayName
          }
        />
        <TextGroup label="Equipment" content={inputRequestDetail?.Equipment} />
        <TextGroup
          label="Reason"
          content={extractContent(inputRequestDetail?.Reason)}
        />
      </>
    ),
    [requestTemplateWorkflow.CHANGE_OFFICE]: (
      <>
        <TextGroup
          label="Current office"
          content={
            offices?.find(
              (office) => office.code === inputRequestDetail?.CurrentOffice
            )?.displayName
          }
        />
        <TextGroup
          label="Destination Office"
          content={inputRequestDetail?.DestinationOffice}
        />
        <TextGroup
          label="Content"
          content={extractContent(inputRequestDetail?.Content)}
        />
        <TextGroup label="Start date" content={inputRequestDetail?.StartDate} />
        <TextGroup label="End date" content={inputRequestDetail?.EndDate} />
      </>
    ),
    [requestTemplateWorkflow.DEVICE_REQUEST]: (
      <>
        <TextGroup
          label="Current office"
          content={
            offices?.find(
              (office) => office.code === inputRequestDetail?.CurrentOffice
            )?.displayName
          }
        />
        <TextGroup label="Project" content={inputRequestDetail?.Project} />
        <TextGroup label="Device" content={inputRequestDetail?.Device} />
        <TextGroup
          label="Reason"
          content={extractContent(inputRequestDetail?.Reason)}
        />
      </>
    ),
  };

  return type && RequestComponent[type];
};
