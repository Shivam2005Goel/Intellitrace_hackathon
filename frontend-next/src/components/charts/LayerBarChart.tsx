'use client';

import { ResponsiveBar } from '@nivo/bar';
import { motion } from 'framer-motion';

interface LayerBarChartProps {
  data: {
    layer: string;
    score: number;
    color: string;
  }[];
}

const LayerBarChart = ({ data }: LayerBarChartProps) => {
  return (
    <motion.div 
      className="h-[250px] w-full"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
      <ResponsiveBar
        data={data}
        keys={['score']}
        indexBy="layer"
        margin={{ top: 20, right: 30, bottom: 50, left: 40 }}
        padding={0.4}
        valueScale={{ type: 'linear', max: 10 }}
        colors={({ data }) => data.color}
        borderRadius={6}
        borderWidth={0}
        enableLabel
        label={(d) => `${d.value}`}
        labelTextColor="#ffffff"
        labelSkipHeight={20}
        animate
        motionConfig={{
          mass: 1,
          tension: 170,
          friction: 26,
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: '',
          legendPosition: 'middle',
          legendOffset: 32,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Risk Score',
          legendPosition: 'middle',
          legendOffset: -35,
        }}
        theme={{
          background: 'transparent',
          text: {
            fill: '#ffffff',
            fontSize: 12,
          },
          axis: {
            domain: { line: { stroke: 'rgba(255,255,255,0.2)' } },
            ticks: { line: { stroke: 'rgba(255,255,255,0.2)' }, text: { fill: 'rgba(255,255,255,0.7)' } },
            legend: { text: { fill: 'rgba(255,255,255,0.7)', fontSize: 12 } },
          },
          grid: {
            line: { stroke: 'rgba(255,255,255,0.05)' },
          },
          labels: {
            text: { fontSize: 12, fontWeight: 600 },
          },
        }}
        tooltip={({ value, indexValue }) => (
          <div className="custom-tooltip">
            <strong className="text-cyan-400">{indexValue}</strong>
            <div className="mt-1">Score: {value}/10</div>
          </div>
        )}
      />
    </motion.div>
  );
};

export default LayerBarChart;
