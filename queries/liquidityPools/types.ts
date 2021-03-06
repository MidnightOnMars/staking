export type LiquidityPoolData = {
	distribution: number;
	address: string;
	price: number;
	balance: number;
	periodFinish: number;
	rewards: number;
	staked: number;
	allowance: number;
	duration: number;
	userBalance: number;
	needsToSettle?: boolean;
};
