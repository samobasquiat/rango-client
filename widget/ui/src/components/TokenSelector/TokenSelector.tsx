import React from 'react';
import { containsText } from '../../helper';
import { SecondaryPage } from '../SecondaryPage/SecondaryPage';
import { TokenList } from '../TokenList';
import { TokenWithAmount } from '../TokenList/TokenList';
import { LoadingStatus } from '../../types/meta';
import { Spinner } from '../Spinner';
import { LoadingFailedAlert } from '../Alert/LoadingFailedAlert';
import { NotFoundAlert } from '../Alert/NotFoundAlert';
import { styled } from '../../theme';

export const LoaderContainer = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  paddingTop: '33%',
  flex: 1,
});
export interface PropTypes {
  list: TokenWithAmount[];
  type?: 'Source' | 'Destination';
  selected: TokenWithAmount | null;
  onChange: (token: TokenWithAmount) => void;
  onBack?: () => void;
  loadingStatus: LoadingStatus;
  hasHeader?: boolean;
}

const filterTokens = (list: TokenWithAmount[], searchedFor: string) =>
  list.filter(
    (token) =>
      containsText(token.symbol, searchedFor) ||
      containsText(token.address || '', searchedFor) ||
      containsText(token.name || '', searchedFor)
  );

export function TokenSelector(props: PropTypes) {
  const { list, type, selected, hasHeader, onChange, onBack, loadingStatus } =
    props;

  return (
    <SecondaryPage
      textField={true}
      hasHeader={hasHeader}
      title={`Select ${type} Token`}
      onBack={onBack}
      textFieldPlaceholder="Search Token By Name"
    >
      {(searchedFor) => {
        const filteredTokens = filterTokens(list, searchedFor);

        return loadingStatus === 'loading' ? (
          <LoaderContainer>
            <Spinner size={24} />
          </LoaderContainer>
        ) : loadingStatus === 'failed' ? (
          <LoadingFailedAlert />
        ) : filteredTokens.length ? (
          <TokenList
            searchedText={searchedFor}
            list={filteredTokens}
            selected={selected}
            onChange={onChange}
          />
        ) : (
          <NotFoundAlert catergory="Token" searchedFor={searchedFor} />
        );
      }}
    </SecondaryPage>
  );
}
