'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

interface SentimentChartProps {
  positive: number
  neutral: number
  negative: number
  height?: number
  fill?: boolean
}

const COLORS = ['#06b6d4', 'rgba(255,255,255,0.3)', '#f87171']

export default function SentimentChart({ positive, neutral, negative, height = 250, fill = false }: SentimentChartProps) {
  const data = [
    { name: 'Positive', value: positive },
    { name: 'Neutral', value: neutral },
    { name: 'Negative', value: negative },
  ]

  const total = positive + neutral + negative
  // In `fill` mode, `height` applies to the whole card (title + chart + legend + footer).
  // Give the chart area an explicit height so the SVG can never clip unexpectedly.
  const chartAreaHeight = fill ? Math.max(120, height - 170) : height
  const outerRadius = Math.max(42, Math.min(58, Math.floor(chartAreaHeight * 0.42)))

  return (
    <div
      className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-white/20 transition-all flex flex-col"
      style={fill ? { height } : undefined}
    >
      <h3 className="text-sm font-light tracking-wider text-white/60 uppercase mb-6">Sentiment Breakdown</h3>
      <div className={fill ? 'flex-none' : ''} style={{ height: chartAreaHeight }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={false}
              outerRadius={outerRadius}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0,0,0,0.88)',
                border: '1px solid rgba(255,255,255,0.14)',
                borderRadius: '10px',
                color: 'white',
                fontSize: '12px',
                fontFamily: 'inherit',
                fontWeight: 300,
              }}
              itemStyle={{ color: 'rgba(255,255,255,0.9)' }}
              labelStyle={{ color: 'rgba(255,255,255,0.7)' }}
              formatter={(value: any, name: any) => {
                const v = typeof value === 'number' ? value : Number(value || 0)
                const pct = total > 0 ? Math.round((v / total) * 100) : 0
                return [`${v.toLocaleString()} (${pct}%)`, String(name)]
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex items-center justify-center gap-6 text-xs font-light">
        <div className="flex items-center gap-2 text-cyan-400/80">
          <span className="inline-block w-3 h-3 rounded-full" style={{ background: COLORS[0] as string }} />
          <span>Positive</span>
        </div>
        <div className="flex items-center gap-2 text-white/40">
          <span className="inline-block w-3 h-3 rounded-full" style={{ background: COLORS[1] as string }} />
          <span>Neutral</span>
        </div>
        <div className="flex items-center gap-2 text-red-400/80">
          <span className="inline-block w-3 h-3 rounded-full" style={{ background: COLORS[2] as string }} />
          <span>Negative</span>
        </div>
      </div>

      <div className="mt-6 text-center text-xs text-white/40 font-light">
        Total mentions: <span className="text-white/60">{total.toLocaleString()}</span>
      </div>
    </div>
  )
}
