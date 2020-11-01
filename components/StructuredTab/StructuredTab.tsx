import { FC, ReactNode, useState } from 'react';
import styled from 'styled-components';
import { TabButton, TabList, TabPanel } from '../Tab';

export type TabInfo = {
	title: string;
	tabChildren: ReactNode;
};

interface StructuredTabProps {
	tabData: TabInfo[];
	boxHeight: number;
	boxWidth: number;
	boxPadding: number;
}

const StructuredTab: FC<StructuredTabProps> = ({ tabData, boxHeight, boxWidth, boxPadding }) => {
	const [activeTab, setActiveTab] = useState<string>(tabData[0].title);
	return (
		<>
			<TabList padding={boxPadding} width={boxWidth}>
				{tabData.map(({ title }, index) => (
					<TabButton
						numberTabs={tabData.length}
						key={`${title}-${index}-button`}
						name={title}
						active={activeTab === title}
						onClick={() => setActiveTab(title)}
					>
						{title}
					</TabButton>
				))}
			</TabList>
			{tabData.map(({ title, tabChildren }, index) => (
				<TabPanel
					padding={boxPadding}
					height={boxHeight}
					width={boxWidth}
					key={`${title}-${index}-panel`}
					name={title}
					activeTab={activeTab}
				>
					{tabChildren}
				</TabPanel>
			))}
		</>
	);
};

export default StructuredTab;