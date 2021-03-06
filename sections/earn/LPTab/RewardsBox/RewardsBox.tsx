import { FC, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';

import { appReadyState } from 'store/app';
import smallWaveSVG from 'assets/svg/app/small-wave.svg';
import Connector from 'containers/Connector';
import Currency from 'components/Currency';

import useSelectedPriceCurrency from 'hooks/useSelectedPriceCurrency';
import {
	formatCurrency,
	formatFiatCurrency,
	toBigNumber,
	formatNumber,
} from 'utils/formatters/number';
import { CryptoCurrency, CurrencyKey } from 'constants/currency';
import { DEFAULT_CRYPTO_DECIMALS } from 'constants/defaults';
import { ESTIMATE_VALUE } from 'constants/placeholder';
import { getGasEstimateForTransaction } from 'utils/transactions';
import { normalizeGasLimit } from 'utils/network';
import GasSelector from 'components/GasSelector';

import {
	FlexDivColCentered,
	ModalContent,
	ModalItem,
	ModalItemTitle,
	ModalItemText,
} from 'styles/common';
import TxConfirmationModal from 'sections/shared/modals/TxConfirmationModal';

import { getContract } from '../StakeTab/StakeTab';
import { StyledButton } from '../../common';

type RewardsBoxProps = {
	tokenRewards: number;
	SNXRate: number;
	stakedAsset: CurrencyKey;
	handleClaim: () => void;
	setClaimGasPrice: (num: number) => void;
	claimTxModalOpen: boolean;
	setClaimTxModalOpen: (open: boolean) => void;
	claimError: string | null;
	setClaimError: (err: string | null) => void;
};

const RewardsBox: FC<RewardsBoxProps> = ({
	tokenRewards,
	SNXRate,
	stakedAsset,
	handleClaim,
	setClaimGasPrice,
	claimTxModalOpen,
	setClaimTxModalOpen,
	claimError,
	setClaimError,
}) => {
	const { t } = useTranslation();
	const { signer } = Connector.useContainer();
	const { selectedPriceCurrency, getPriceAtCurrentRate } = useSelectedPriceCurrency();
	const [gasLimitEstimate, setGasLimitEstimate] = useState<number | null>(null);
	const isAppReady = useRecoilValue(appReadyState);

	useEffect(() => {
		const getGasLimitEstimate = async () => {
			if (isAppReady) {
				try {
					setClaimError(null);
					const contract = getContract(stakedAsset, signer);
					let gasEstimate = await getGasEstimateForTransaction([], contract.estimateGas.getReward);
					setGasLimitEstimate(normalizeGasLimit(Number(gasEstimate)));
				} catch (error) {
					setClaimError(error.message);
					setGasLimitEstimate(null);
				}
			}
		};
		getGasLimitEstimate();
	}, [stakedAsset, signer, setClaimError, isAppReady]);

	return (
		<>
			<RewardsContainer>
				<RewardsTitle>{t('earn.actions.rewards.title')}</RewardsTitle>
				<Currency.Icon currencyKey={CryptoCurrency.SNX} width="48" height="48" />
				<RewardsAmountSNX>
					{formatCurrency(CryptoCurrency.SNX, tokenRewards, {
						currencyKey: CryptoCurrency.SNX,
						decimals: 2,
					})}
				</RewardsAmountSNX>
				<RewardsAmountUSD>
					{ESTIMATE_VALUE}{' '}
					{formatFiatCurrency(getPriceAtCurrentRate(toBigNumber(tokenRewards * SNXRate)), {
						sign: selectedPriceCurrency.sign,
					})}
				</RewardsAmountUSD>
				<StyledButton variant="primary" onClick={handleClaim} disabled={tokenRewards === 0}>
					{t('earn.actions.claim.claim-snx-button')}
				</StyledButton>
				<GasSelector
					altVersion={true}
					gasLimitEstimate={gasLimitEstimate}
					setGasPrice={setClaimGasPrice}
				/>
			</RewardsContainer>
			{claimTxModalOpen && (
				<TxConfirmationModal
					onDismiss={() => setClaimTxModalOpen(false)}
					txError={claimError}
					attemptRetry={handleClaim}
					content={
						<ModalContent>
							<ModalItem>
								<ModalItemTitle>{t('earn.actions.claim.claiming')}</ModalItemTitle>
								<ModalItemText>
									{t('earn.actions.claim.amount', {
										amount: formatNumber(tokenRewards, { decimals: DEFAULT_CRYPTO_DECIMALS }),
										asset: CryptoCurrency.SNX,
									})}
								</ModalItemText>
							</ModalItem>
						</ModalContent>
					}
				/>
			)}
		</>
	);
};

const RewardsContainer = styled(FlexDivColCentered)`
	height: 272px;
	width: 200px;
	margin-left: 20px;
	padding: 10px;
	border: 1px solid ${(props) => props.theme.colors.pink};
	border-radius: 4px;
	background-image: url(${smallWaveSVG.src});
	background-size: cover;
`;

const RewardsTitle = styled.div`
	font-family: ${(props) => props.theme.fonts.extended};
	font-size: 12px;
	color: ${(props) => props.theme.colors.white};
	margin-bottom: 15px;
`;

const RewardsAmountSNX = styled.div`
	font-family: ${(props) => props.theme.fonts.extended};
	font-size: 24px;
	color: ${(props) => props.theme.colors.white};
	margin-top: 10px;
`;

const RewardsAmountUSD = styled.div`
	font-family: ${(props) => props.theme.fonts.interSemiBold};
	font-size: 14px;
	color: ${(props) => props.theme.colors.gray};
	margin-top: 5px;
	margin-bottom: 20px;
`;

export default RewardsBox;
