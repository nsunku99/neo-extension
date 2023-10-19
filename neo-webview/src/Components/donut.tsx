// // /* Styling component for donut charts */
// // // TRY A USEREF?

import { ResponsiveContainer, PieChart, Pie, Cell, Label } from 'recharts';

type DonutProps = {
  donutData: number[];
  donutName: string;
  csize: number;
  overallScore: number;
  color: string;
};

const DonutChart = ({ donutData, donutName, csize, overallScore, color }: DonutProps) => {

  console.log('donut data: ', donutData);

  return (
    <ResponsiveContainer width={csize} height={csize}>
      <PieChart>
        <Pie
          data={[
            { name: 'Segment 1', value: donutData[0] },
            { name: 'Segment 2', value: donutData[1] },
          ]}
          cx="50%"
          cy="50%"
          innerRadius="40%" // Adjust the inner radius for the donut effect
          outerRadius="80%"
          fill="#8884d8"
          dataKey='value'
        >
          <Cell key="cell-1" fill={color} />
          <Cell key="cell-2" fill="white" />
          <Label
            value={overallScore.toFixed(2)}
            position="center"
            fontSize={donutName === 'Overall' ? 24 : 16}
          />
        </Pie>
        <Label
          value={donutName}
          position="top"
          fontSize={donutName === 'Overall' ? 24 : 16}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default DonutChart;