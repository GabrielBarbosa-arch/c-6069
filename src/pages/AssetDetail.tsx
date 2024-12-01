import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getAssetDetails, getAssetHistory } from "@/services/api";
import { ArrowLeft, ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";

const AssetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const { data: asset } = useQuery({
    queryKey: ["asset", id],
    queryFn: () => getAssetDetails(id!),
  });

  const { data: history } = useQuery({
    queryKey: ["history", id],
    queryFn: () => getAssetHistory(id!),
  });

  if (!asset) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="brutal-border brutal-shadow bg-brutal-white p-8 animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-brutal-white">
      <button
        onClick={() => navigate("/")}
        className="brutal-border brutal-shadow bg-brutal-white px-3 py-1.5 md:px-4 md:py-2 mb-4 md:mb-8 flex items-center gap-2 brutal-hover"
      >
        <ArrowLeft size={20} />
        Back
      </button>

      <div className="grid grid-cols-1 gap-4 md:gap-8">
        <div className="brutal-border brutal-shadow bg-brutal-white p-4 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-0">
              {asset.name} ({asset.symbol})
            </h1>
            <span className="text-xl md:text-2xl font-bold">
              ${Number(asset.priceUsd).toFixed(2)}
            </span>
          </div>

          <div
            className={`flex items-center gap-1 text-lg md:text-xl mb-4 md:mb-8 ${
              Number(asset.changePercent24Hr) >= 0
                ? "text-brutal-green"
                : "text-brutal-red"
            }`}
          >
            {Number(asset.changePercent24Hr) >= 0 ? (
              <ArrowUpIcon size={24} />
            ) : (
              <ArrowDownIcon size={24} />
            )}
            {Math.abs(Number(asset.changePercent24Hr)).toFixed(2)}%
          </div>

          <div className="grid grid-cols-2 gap-2 md:gap-4">
            <div className="brutal-border p-2 md:p-4">
              <div className="text-xs md:text-sm text-gray-600">Market Cap</div>
              <div className="font-bold text-sm md:text-base">
                ${Number(asset.marketCapUsd / 1000000).toFixed(0)}M
              </div>
            </div>
            <div className="brutal-border p-2 md:p-4">
              <div className="text-xs md:text-sm text-gray-600">Volume (24h)</div>
              <div className="font-bold text-sm md:text-base">
                ${Number(asset.volumeUsd24Hr / 1000000).toFixed(0)}M
              </div>
            </div>
            <div className="brutal-border p-2 md:p-4">
              <div className="text-xs md:text-sm text-gray-600">Supply</div>
              <div className="font-bold text-sm md:text-base">
                {Number(asset.supply / 1000000).toFixed(0)}M
              </div>
            </div>
            <div className="brutal-border p-2 md:p-4">
              <div className="text-xs md:text-sm text-gray-600">Max Supply</div>
              <div className="font-bold text-sm md:text-base">
                {asset.maxSupply
                  ? `${Number(asset.maxSupply / 1000000).toFixed(0)}M`
                  : "∞"}
              </div>
            </div>
          </div>
        </div>

        <div className="brutal-border brutal-shadow bg-brutal-white p-4 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold mb-4">Price History</h2>
          <div className="h-[300px] md:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <XAxis
                  dataKey="date"
                  tickFormatter={(str) => {
                    const date = new Date(str);
                    return isMobile
                      ? `${date.getMonth() + 1}/${date.getDate()}`
                      : date.toLocaleDateString();
                  }}
                />
                <YAxis
                  domain={["auto", "auto"]}
                  tickFormatter={(num) => `$${Number(num).toFixed(2)}`}
                />
                <Tooltip
                  formatter={(value: any) => {
                    const numValue = Number(value);
                    return isNaN(numValue) ? ["Invalid", "Price"] : [`$${numValue.toFixed(2)}`, "Price"];
                  }}
                  labelFormatter={(label) => new Date(label).toLocaleDateString()}
                />
                <Line
                  type="monotone"
                  dataKey="priceUsd"
                  stroke="#000000"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetDetail;