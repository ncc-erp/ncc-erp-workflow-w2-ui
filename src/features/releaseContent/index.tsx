import Page from 'common/components/Page';
import { ReleaseContentBody } from './components/ReleaseContentBody';
import { useMediaQuery } from 'hooks/useMediaQuery';
import { MobileHeader } from 'common/components/MobileHeader';

const ReleaseContent = () => {
  const isLargeScreen = useMediaQuery('(min-width: 1024px)');

  return (
    <Page>
      {!isLargeScreen && <MobileHeader />}
      <Page.Header
        paddingBottom={isLargeScreen ? undefined : '0px'}
        height={isLargeScreen ? undefined : '60px'}
        margin={isLargeScreen ? undefined : '0px'}
        marginTop={isLargeScreen ? '0px' : '50px'}
      >
        <Page.HeaderLeft>
          <Page.Heading>Releases Note</Page.Heading>
        </Page.HeaderLeft>
        <Page.HeaderRight />
      </Page.Header>
      <Page.Body>
        <ReleaseContentBody />
      </Page.Body>
    </Page>
  );
};

export default ReleaseContent;
