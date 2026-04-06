'use client';

import { ResponsiveSankey } from '@nivo/sankey';
import { motion } from 'framer-motion';

interface FraudFlowSankeyProps {
  data: {
    nodes: { id: string; label: string }[];
    links: { source: string; target: string; value: number }[];
  };
}

const FraudFlowSankey = ({ data }: FraudFlowSankeyProps) => {
  const colors: Record<string, string> = {
    'Invoice Upload': '#00f5ff',
    'DNA Layer': '#b829dd',
    'Physics Layer': '#ff0080',
    'Graph Layer': '#ff6b35',
    'LLM Layer': '#00ff88',
    'PSI Layer': '#ffcc00',
    'Approved': '#00ff88',
    'Hold': '#ffcc00',
    'Blocked': '#ff3366',
  };

  return (
    <motion.div 
      className="h-[400px] w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.3 }}
    >
      <ResponsiveSankey
        data={data}
        margin={{ top: 20, right: 120, bottom: 20, left: 20 }}
        align="justify"
        colors={(node) => colors[node.id] || '#00f5ff'}
        nodeOpacity={0.9}
        nodeHoverOthersOpacity={0.2}
        nodeThickness={24}
        nodeSpacing={24}
        nodeBorderWidth={0}
        nodeBorderRadius={4}
        linkOpacity={0.4}
        linkHoverOthersOpacity={0.1}
        linkContract={3}
        enableLinkGradient
        enableLabels
        labelPosition="outside"
        labelOrientation="vertical"
        labelPadding={16}
        labelTextColor={{ from: 'color', modifiers: [['darker', 1]] }}
        animate
        motionConfig={{
          mass: 1,
          tension: 170,
          friction: 26,
        }}
        theme={{
          labels: {
            text: {
              fill: '#ffffff',
              fontSize: 12,
              fontWeight: 600,
            },
          },
        }}
      />
    </motion.div>
  );
};

export default FraudFlowSankey;
