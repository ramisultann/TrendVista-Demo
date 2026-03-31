'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface TrendChartProps {
  data: Array<{
    date: string
    sentiment: number
    mentions?: number
  }>
  height?: number
  compact?: boolean
  fill?: boolean
}

export default function TrendChart({ data, height = 300, compact = false, fill = false }: TrendChartProps) {
  return (
    <div
      className={`backdrop-blur-md bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all flex flex-col ${
        compact ? 'p-4' : 'p-6'
      }`}
      style={fill ? { height } : undefined}
    >
      <h3
        className={`text-sm font-light tracking-wider text-white/60 uppercase ${
          compact ? 'mb-3' : 'mb-6'
        }`}
      >
        Sentiment Trend
      </h3>
      <div className={fill ? 'flex-1 min-h-0' : ''} style={fill ? undefined : { height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 8,
              right: 10,
              left: 0,
              bottom: compact ? 2 : 6,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="date"
              stroke="rgba(255,255,255,0.4)"
              style={{ fontSize: '12px', fontFamily: 'inherit', fontWeight: 300 }}
              tickMargin={8}
              minTickGap={compact ? 14 : 6}
            />
            <YAxis
              stroke="rgba(255,255,255,0.4)"
              style={{ fontSize: '12px', fontFamily: 'inherit', fontWeight: 300 }}
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              width={compact ? 26 : 34}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0,0,0,0.8)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: 'white',
                fontSize: '12px',
                fontFamily: 'inherit',
                fontWeight: 300,
              }}
              labelStyle={{ color: 'rgba(255,255,255,0.6)', fontWeight: 400 }}
              formatter={(value: any) => {
                const v = typeof value === 'number' ? value : Number(value || 0)
                return [`${Math.round(v)} / 100`, 'Sentiment']
              }}
            />
            <Line
              type="monotone"
              dataKey="sentiment"
              stroke="#06b6d4"
              strokeWidth={2}
              dot={compact ? false : { fill: '#06b6d4', r: 4 }}
              activeDot={compact ? { r: 5 } : { r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
