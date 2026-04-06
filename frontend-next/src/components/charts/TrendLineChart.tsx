'use client';

import { ResponsiveLine } from '@nivo/line';
import { motion } from 'framer-motion';

interface TrendLineChartProps {
  data: {
    id: string;
    color: string;
    data: { x: string; y: number }[];
  }[];
}

const TrendLineChart = ({ data }: TrendLineChartProps) => {
  return (
    <motion.div 
      className="h-[300px] w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <ResponsiveLine
        data={data}
        margin={{ top: 20, right: 20, bottom: 50, left: 50 }}
        xScale={{ type: 'point' }}
        yScale={{ type: 'linear', min: 0, max: 'auto' }}
        curve="monotoneX"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: -45,
          legend: '',
          legendOffset: 36,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Risk Score',
          legendOffset: -40,
        }}
        enableGridX={false}
        enableGridY
        gridYValues={5}
        enablePoints
        pointSize={8}
        pointColor="#0a0a0f"
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabelYOffset={-12}
        enableArea
        areaOpacity={0.15}
        useMesh
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
            fontSize: 11,
          },
          axis: {
            domain: { line: { stroke: 'rgba(255,255,255,0.2)' } },
            ticks: { 
              line: { stroke: 'rgba(255,255,255,0.2)' }, 
              text: { fill: 'rgba(255,255,255,0.5)' } 
            },
            legend: { text: { fill: 'rgba(255,255,255,0.7)', fontSize: 12 } },
          },
          grid: {
            line: { stroke: 'rgba(255,255,255,0.05)', strokeDasharray: '4 4' },
          },
          crosshair: {
            line: { stroke: '#00f5ff', strokeWidth: 1, strokeOpacity: 0.5 },
          },
        }}
        tooltip={({ point }) => (
          <div className="custom-tooltip">
            <strong style={{ color: point.seriesColor }}>{point.seriesId}</strong>
            <div className="mt-1">{point.data.x}: {point.data.y}</div>
          </div>
        )}
        defs={[
          {
            id: 'gradientA',
            type: 'linearGradient',
            colors: [
              { offset: 0, color: '#00f5ff' },
              { offset: 100, color: 'rgba(0,245,255,0)' },
            ],
          },
        ]}
        fill={[
          { match: '*', id: 'gradientA' },
        ]}
      />
    </motion.div>
  );
};

export default TrendLineChart;
