import React from 'react';
import { BarChart3, TrendingUp, PieChart } from 'lucide-react';
import { cn, formatNumber } from '../lib/utils';
import type { InsightsCardProps, DataInsight } from '../types';

export const InsightsCard: React.FC<InsightsCardProps> = ({
  insights,
  title = 'Data Insights',
  className,
}) => {
  const maxCount = Math.max(...insights.breakdown.map((item) => item.count));

  return (
    <div
      className={cn(
        'bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden animate-fade-in',
        className
      )}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold text-lg">{title}</h3>
            <p className="text-emerald-100 text-sm">
              {formatNumber(insights.totalRecords)} total records
            </p>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white/20 text-white">
              {insights.aggregationType}
            </span>
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="p-4">
        <div className="space-y-3">
          {insights.breakdown.slice(0, 8).map((item, index) => (
            <InsightBar key={index} item={item} maxCount={maxCount} index={index} />
          ))}
        </div>

        {insights.breakdown.length > 8 && (
          <p className="text-xs text-gray-500 text-center mt-4 pt-3 border-t border-gray-100">
            +{insights.breakdown.length - 8} more categories
          </p>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 divide-x divide-gray-100 border-t border-gray-100 bg-gray-50">
        <div className="p-3 text-center">
          <div className="flex items-center justify-center gap-1 text-gray-500 text-xs mb-1">
            <PieChart className="w-3.5 h-3.5" />
            <span>Categories</span>
          </div>
          <p className="font-semibold text-gray-900">{insights.breakdown.length}</p>
        </div>
        <div className="p-3 text-center">
          <div className="flex items-center justify-center gap-1 text-gray-500 text-xs mb-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Top Category</span>
          </div>
          <p className="font-semibold text-gray-900 truncate text-sm">
            {insights.breakdown[0]?.category || 'N/A'}
          </p>
        </div>
        <div className="p-3 text-center">
          <div className="flex items-center justify-center gap-1 text-gray-500 text-xs mb-1">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Top Count</span>
          </div>
          <p className="font-semibold text-gray-900">
            {formatNumber(insights.breakdown[0]?.count)}
          </p>
        </div>
      </div>
    </div>
  );
};

// Insight Bar Component
const InsightBar: React.FC<{
  item: DataInsight;
  maxCount: number;
  index: number;
}> = ({ item, maxCount, index }) => {
  const percentage = (item.count / maxCount) * 100;
  const colors = [
    'bg-emerald-500',
    'bg-teal-500',
    'bg-cyan-500',
    'bg-blue-500',
    'bg-indigo-500',
    'bg-violet-500',
    'bg-purple-500',
    'bg-pink-500',
  ];

  return (
    <div className="group">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-gray-700 truncate flex-1 pr-2">{item.category}</span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900">{formatNumber(item.count)}</span>
          {item.percentage !== undefined && (
            <span className="text-xs text-gray-500">({item.percentage.toFixed(1)}%)</span>
          )}
        </div>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            colors[index % colors.length]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default InsightsCard;
