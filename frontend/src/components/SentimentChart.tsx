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
  // In `fill` mode, the parent sets a fixed height. We treat the chart area as `flex-1`
  // so the legend + footer never push content outside the card.
  const outerRadius = fill ? 48 : Math.max(44, Math.min(68, Math.floor(height * 0.42)))

  return (
    <div
      className={`backdrop-blur-md bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all flex flex-col ${
        fill ? 'p-4' : 'p-6'
      }`}
      style={fill ? { height } : undefined}
    >
      <h3 className={`text-sm font-light tracking-wider text-white/60 uppercase ${fill ? 'mb-3' : 'mb-6'}`}>
        Sentiment Breakdown
      </h3>

      <div className={fill ? 'flex-1 min-h-0' : ''} style={fill ? undefined : { height }}>
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

      <div className={`${fill ? 'mt-2' : 'mt-4'} flex items-center justify-center gap-6 text-xs font-light`}>
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

      <div className={`${fill ? 'mt-auto pt-3' : 'mt-6'} text-center text-xs text-white/40 font-light`}>
        Total mentions: <span className="text-white/60">{total.toLocaleString()}</span>
      </div>
    </div>
  )
}
