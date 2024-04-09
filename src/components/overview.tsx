import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface Props {
  month: string;
  compras: number;
  gastos: number;
}

export function Overview(props: { resultsList: Props[] }) {
  const { resultsList } = props;
  console.log(resultsList);
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={resultsList}>
        <XAxis
          dataKey="month"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Bar
          dataKey="compras"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
        <Bar
          dataKey="gastos"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-amber-400"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
