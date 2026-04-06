'use client';

import { ResponsivePie } from '@nivo/pie';
import { motion } from 'framer-motion';

interface DecisionPieChartProps {
  data: {
    id: string;
    label: string;
    value: number;
    color: string;
  }[];
}

const DecisionPieChart = ({ data }: DecisionPieChartProps) => {
  return (
    <motion.div 
      className="h-[300px] w-full"
      initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <ResponsivePie
        data={data}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        innerRadius={0.6}
        padAngle={2}
        cornerRadius={8}
        activeOuterRadiusOffset={8}
        colors={{ datum: 'data.color' }}
        borderWidth={2}
        borderColor="#0a0a0f"
        enableArcLabels
        arcLabel={(d) => `${d.value}`}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor="#ffffff"
        arcLabelsRadiusOffset={0.6}
        enableArcLinkLabels
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="rgba(255,255,255,0.7)"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: 'color' }}
        animate
        motionConfig={{
          mass: 1,
          tension: 170,
          friction: 26,
        }}
        transitionMode="startAngle"
        theme={{
          labels: {
            text: {
              fontSize: 14,
              fontWeight: 600,
            },
          },
        }}
        tooltip={({ datum }) => (
          <div className="custom-tooltip">
            <strong style={{ color: datum.color }}>{datum.label}</strong>
            <div className="mt-1">{datum.value} invoices</div>
          </div>
        )}
        legends={[
          {
            anchor: 'bottom',
            direction: 'row',
            justify: false,
            translateX: 0,
            translateY: 20,
            itemsSpacing: 20,
            itemWidth: 80,
            itemHeight: 20,
            itemTextColor: 'rgba(255,255,255,0.7)',
            itemDirection: 'left-to-right',
            itemOpacity: 1,
            symbolSize: 12,
            symbolShape: 'circle',
          },
        ]}
      />
    </motion.div>
  );
};

export default DecisionPieChart;
