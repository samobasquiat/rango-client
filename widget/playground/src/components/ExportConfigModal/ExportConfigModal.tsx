import type {
  ExportConfigModalProps,
  ExportType,
} from './ExportConfigModal.types';

import {
  CloseIcon,
  Divider,
  ExternalLinkIcon,
  KeyIcon,
  Modal,
  ModalHeader,
  TextField,
  Typography,
} from '@samo-dev/ui';
import React, { Fragment, useState } from 'react';
import {
  atomDark as dark,
  prism,
} from 'react-syntax-highlighter/dist/esm/styles/prism';

import { PLAYGROUND_CONTAINER_ID } from '../../constants';
import { useTheme } from '../../hooks/useTheme';
import { initialConfig, useConfigStore } from '../../store/config';
import { filterConfig, formatConfig } from '../../utils/export';

import { CodeBlock } from './CodeBlock';
import {
  APIKeyInputContainer,
  BackdropTab,
  ButtonsContainer,
  ExternalLinkIconContainer,
  Head,
  HelpLinksContainer,
  Label,
  Link,
  LinkContainer,
  ModalFlex,
  StyledButton,
  StyledIconButton,
} from './ExportConfigModal.styles';
import { typesOfCodeBlocks } from './ExportConfigModal.types';

const TAB_WIDTH = 333;

export function ExportConfigModal(props: ExportConfigModalProps) {
  const { open, onClose, config } = props;

  const { activeTheme } = useTheme();
  const [selected, setSelected] = useState<ExportType>('embedded');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const syntaxHighlighterTheme = activeTheme === 'dark' ? dark : prism;
  const { filteredConfigForExport } = filterConfig(config, initialConfig);
  const formatedConfig = formatConfig(filteredConfigForExport);
  const apiKey = useConfigStore.use.config().apiKey;
  const onChangeApiKey = useConfigStore.use.onChangeApiKey();

  return (
    <Modal
      container={
        document.getElementById(PLAYGROUND_CONTAINER_ID) as HTMLElement
      }
      containerStyle={{
        maxWidth: '1109px',
        width: '90%',
        maxHeight: '865px',
        height: '90%',
        padding: '$20',
      }}
      hasLogo={false}
      header={
        <ModalHeader>
          <Typography variant="headline" size="large">
            Export Code
          </Typography>
          <ModalFlex>
            <StyledIconButton onClick={onClose} variant="ghost">
              <CloseIcon color="gray" size={22} />
            </StyledIconButton>
          </ModalFlex>
        </ModalHeader>
      }
      open={open}
      onClose={onClose}
      title="Export Code"
      anchor="center">
      <Divider size={30} />
      <Head>
        <APIKeyInputContainer>
          <TextField
            size="large"
            variant="contained"
            style={{ background: '$neutral100', borderRadius: '10px' }}
            onChange={(e) => {
              onChangeApiKey(e.target.value);
            }}
            name="apiKey"
            value={apiKey}
            label={
              <Label>
                <KeyIcon /> <Divider direction="horizontal" size={'4'} />
                Replace your key
              </Label>
            }
            labelProps={{
              color: '$neutral600',
              size: 'medium',
              variant: 'label',
            }}
            type="string"
            placeholder="Enter API Key"
          />
        </APIKeyInputContainer>
        <HelpLinksContainer>
          <LinkContainer>
            <Typography variant="title" size="xmedium" color="$neutral700">
              <Link
                href="https://docs.rango.exchange/widget-integration/overview"
                target="_blank">
                <ExternalLinkIconContainer className="icon_container">
                  <ExternalLinkIcon color="gray" size={16} />
                </ExternalLinkIconContainer>
                &nbsp;Full Instructions
              </Link>
            </Typography>
          </LinkContainer>
          <LinkContainer>
            <Typography variant="title" size="xmedium" color="$neutral700">
              <Link
                href="https://github.com/rango-exchange/widget-examples"
                target="_blank">
                <ExternalLinkIconContainer className="icon_container">
                  <ExternalLinkIcon color="gray" size={16} />
                </ExternalLinkIconContainer>
                &nbsp;More Examples
              </Link>
            </Typography>
          </LinkContainer>
        </HelpLinksContainer>
      </Head>
      <Divider size={30} />

      <ButtonsContainer>
        {Object.keys(typesOfCodeBlocks).map((type, index) => {
          const key = `block-${index}`;
          return (
            <Fragment key={key}>
              <StyledButton
                size="medium"
                disableRipple={true}
                type={selected === type ? 'secondary' : undefined}
                variant={selected !== type ? 'contained' : undefined}
                onClick={() => {
                  setSelectedIndex(index);
                  setSelected(type as ExportType);
                }}>
                {type}
              </StyledButton>
            </Fragment>
          );
        })}
        <BackdropTab
          css={{
            transform: `translateX(${TAB_WIDTH * selectedIndex}px)`,
          }}
        />
      </ButtonsContainer>
      <Divider size={10} />
      <CodeBlock
        selectedType={selected}
        language={typesOfCodeBlocks[selected].language}
        theme={syntaxHighlighterTheme}>
        {typesOfCodeBlocks[selected].generateCode(formatedConfig)}
      </CodeBlock>
    </Modal>
  );
}
