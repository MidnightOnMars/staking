import React from 'react';
import { Svg } from 'react-optimized-image';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import {
	FlexDivRowCentered,
	FlexDivCentered,
	FlexDivColCentered,
	ExternalLink,
	boxShadowBlue,
} from 'styles/common';
import Success from 'assets/svg/app/success.svg';
import Link from 'next/link';

import { Transaction } from 'constants/network';
import ROUTES from 'constants/routes';
import { CryptoCurrency, Synths } from 'constants/currency';

import {
	SectionHeader,
	SectionSubtext,
	Container,
	InfoTitle,
	InfoContainer,
	InfoData,
	MiddleSection,
	IconContainer,
} from './common';
import Etherscan from 'containers/Etherscan';
import { amountToBurnState, amountToMintState, burnTypeState, mintTypeState } from 'store/staking';
import { useSetRecoilState } from 'recoil';
import Currency from 'components/Currency';

type ActionCompletedProps = {
	setTransactionState: (tx: Transaction) => void;
	isMint: boolean;
	hash?: string;
	from?: string;
	to?: string;
};

const ActionCompleted: React.FC<ActionCompletedProps> = ({
	setTransactionState,
	isMint,
	hash,
	from,
	to,
}) => {
	const { t } = useTranslation();
	const { push } = useRouter();
	const { etherscanInstance } = Etherscan.useContainer();
	const link = etherscanInstance != null ? etherscanInstance.txLink(hash ?? '') : undefined;
	const onMintTypeChange = useSetRecoilState(mintTypeState);
	const onBurnTypeChange = useSetRecoilState(burnTypeState);
	const onBurnChange = useSetRecoilState(amountToBurnState);
	const onMintChange = useSetRecoilState(amountToMintState);

	if (!isMint) {
		return (
			<Container>
				<SectionHeader>{t('staking.actions.burn.completed.title')}</SectionHeader>
				<MiddleSection>
					<IconContainer>
						<Svg src={Success} />
					</IconContainer>
					<FlexDivCentered>
						<InfoContainer key="one">
							<InfoTitle>{t('staking.actions.burn.completed.unstaking')}</InfoTitle>
							<InfoData>{from}</InfoData>
						</InfoContainer>
						<InfoContainer key="two">
							<InfoTitle>{t('staking.actions.burn.completed.burning')}</InfoTitle>
							<InfoData>{to}</InfoData>
						</InfoContainer>
					</FlexDivCentered>
				</MiddleSection>
				<ButtonWrap>
					{link ? (
						<ExternalLink href={link}>
							<LeftButton onClick={() => setTransactionState(Transaction.PRESUBMIT)}>
								{t('staking.actions.burn.completed.verify')}
							</LeftButton>
						</ExternalLink>
					) : null}
					<RightButton
						onClick={() => {
							setTransactionState(Transaction.PRESUBMIT);
							onBurnTypeChange(null);
							onBurnChange('');
						}}
					>
						{t('staking.actions.burn.completed.dismiss')}
					</RightButton>
				</ButtonWrap>
			</Container>
		);
	}
	return (
		<Container>
			<SectionHeader>
				{t('staking.actions.mint.completed.title', { synth: Synths.sUSD })}
			</SectionHeader>
			<MiddleSection>
				<Link href={ROUTES.Earn.Home}>
					<MainInfoBox>
						<Currency.Icon currencyKey={CryptoCurrency.CRV} width="20" height="20" />
						<MiddleInfoSection>
							{t('staking.actions.mint.completed.curve', { synth: Synths.sUSD })}
						</MiddleInfoSection>
						<RightInfoSection>
							<AprText>{t('staking.actions.mint.completed.est-apr')}</AprText>
							{/* @TODO: Replace with variable APR */}
							<AprValue>14%</AprValue>
						</RightInfoSection>
					</MainInfoBox>
				</Link>
			</MiddleSection>
			<SectionSubtext>{t('staking.actions.mint.completed.subtext')}</SectionSubtext>
			<ButtonWrap>
				<LeftButton
					onClick={() => {
						setTransactionState(Transaction.PRESUBMIT);
						onMintTypeChange(null);
						onMintChange('');
					}}
				>
					{t('staking.actions.mint.completed.dismiss')}
				</LeftButton>
				<RightButton onClick={() => push(ROUTES.Earn.Home)}>
					{t('staking.actions.mint.completed.see-more')}
				</RightButton>
			</ButtonWrap>
		</Container>
	);
};

const MainInfoBox = styled(FlexDivCentered)`
	background-color: ${(props) => props.theme.colors.navy};
	justify-content: space-around;
	color: ${(props) => props.theme.colors.white};
	height: 95px;
	width: 100%;
	border-radius: 4px;
	cursor: pointer;
`;

const MiddleInfoSection = styled.div`
	word-wrap: normal;
	height: auto;
	width: 180px;
	text-align: left;
	font-family: ${(props) => props.theme.fonts.interBold};
	font-size: 14px;
`;

const RightInfoSection = styled(FlexDivColCentered)`
	border: 1px solid #161b44;
	padding: 10px;
	font-size: 10px;
	border-radius: 4px;
	background: ${(props) => props.theme.colors.black};
	justify-content: center;
`;

const AprText = styled.div`
	color: ${(props) => props.theme.colors.gray};
	margin-bottom: 5px;
	font-family: ${(props) => props.theme.fonts.interBold};
	font-size: 12px;
	text-transform: uppercase;
`;

const AprValue = styled.div`
	color: ${(props) => props.theme.colors.white};
	margin-bottom: 5px;
	font-family: ${(props) => props.theme.fonts.extended};
	font-size: 14px;
`;

const BaseButton = styled.div`
	width: 175px;
	height: 50px;
	padding-top: 16px;
	font-family: ${(props) => props.theme.fonts.condensedMedium};
	font-size: 12px;
	border-radius: 4px;
	cursor: pointer;
`;

const ButtonWrap = styled(FlexDivRowCentered)`
	width: 100%;
`;

const LeftButton = styled(BaseButton)`
	background-color: ${(props) => props.theme.colors.black};
	color: ${(props) => props.theme.colors.white};
	border: 1px solid ${(props) => props.theme.colors.gray};
	text-transform: uppercase;
`;

const RightButton = styled(BaseButton)`
	${boxShadowBlue}
	background-color: ${(props) => props.theme.colors.grayBlue};
	color: ${(props) => props.theme.colors.blue};
	text-transform: uppercase;

`;

export default ActionCompleted;
