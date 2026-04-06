'use client';

import { ResponsiveRadar } from '@nivo/radar';
import { motion } from 'framer-motion';

interface RiskRadarChartProps {
  data: {
    layer: string;
    score: number;
  }[];
}

const RiskRadarChart = ({ data }: RiskRadarChartProps) => {
  const chartData = data.map(d => ({
    metric: d.layer,
    score: d.score,
  }));

  return (
    <motion.div 
      className="h-[300px] w-full"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <ResponsiveRadar
        data={chartData}
        keys={['score']}
        indexBy="metric"
        maxValue={10}
        margin={{ top: 40, right: 60, bottom: 40, left: 60 }}
        curve="linearClosed"
        borderWidth={2}
        borderColor={{ from: 'color', modifiers: [] }}
        gridLevels={5}
        gridShape="circular"
        gridLabelOffset={20}
        enableDots
        dotSize={8}
        dotColor="#00f5ff"
        dotBorderWidth={2}
        dotBorderColor="#0a0a0f"
        enableDotLabel
        dotLabel="value"
        dotLabelYOffset={-12}
        colors={['#b829dd']}
        fillOpacity={0.3}
        blendMode="normal"
        animate
        motionConfig={{
          mass: 1,
          tension: 170,
          friction: 26,
        }}
        theme={{
          background: 'transparent',
          text: {
            fill: '#ffffff',
            fontSize: 12,
            fontWeight: 600,
          },
          axis: {
            domain: { line: { stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 } },
            ticks: { line: { stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 } },
          },
          grid: {
            line: { stroke: 'rgba(0,245,255,0.2)', strokeWidth: 1, strokeDasharray: '4 4' },
          },
        }}
      />
    </motion.div>
  );
};

export default RiskRadarChart;
