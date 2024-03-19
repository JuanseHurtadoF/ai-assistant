"use client";
import { useEffect } from "react";
import { PieChart, Pie, Legend, Tooltip, ResponsiveContainer } from "recharts";

type CustomPieChartItem = {
  name: string;
  value: number;
  fill: string;
};

type CustomPieChartProps = {
  data: CustomPieChartItem[];
};

const CustomPieChart = ({ data }: CustomPieChartProps) => {
  return (
    <div className="bg-slate-200">
      <ResponsiveContainer width={600} height={300}>
        <PieChart width={400} height={400}>
          <Pie
            dataKey="value"
            isAnimationActive={false}
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-400 p-2">
        <p>{label}</p>
        <p>
          <strong>Value:</strong> {payload[0].value}
        </p>
      </div>
    );
  }

  return null;
};

export { CustomPieChart };
