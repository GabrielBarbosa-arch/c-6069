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

const AssetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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
    <div className="min-h-screen p-8 bg-brutal-white">
      <button
        onClick={() => navigate("/")}
        className="brutal-border brutal-shadow bg-brutal-white px-4 py-2 mb-8 flex items-center gap-2 brutal-hover"
      >
        <ArrowLeft size={20} />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="brutal-border brutal-shadow bg-brutal-white p-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold">
              {asset.name} ({asset.symbol})
            </h1>
            <span className="text-2xl font-bold">
              ${Number(asset.priceUsd).toFixed(2)}
            </span>
          </div>

          <div
            className={`flex items-center gap-1 text-xl mb-8 ${
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

          <div className="grid grid-cols-2 gap-4">
            <div className="brutal-border p-4">
              <div className="text-sm text-gray-600">Market Cap</div>
              <div className="font-bold">
                ${Number(asset.marketCapUsd / 1000000).toFixed(0)}M
              </div>
            </div>
            <div className="brutal-border p-4">
              <div className="text-sm text-gray-600">Volume (24h)</div>
              <div className="font-bold">
                ${Number(asset.volumeUsd24Hr / 1000000).toFixed(0)}M
              </div>
            </div>
            <div className="brutal-border p-4">
              <div className="text-sm text-gray-600">Supply</div>
              <div className="font-bold">
                {Number(asset.supply / 1000000).toFixed(0)}M
              </div>
            </div>
            <div className="brutal-border p-4">
              <div className="text-sm text-gray-600">Max Supply</div>
              <div className="font-bold">
                {asset.maxSupply
                  ? `${Number(asset.maxSupply / 1000000).toFixed(0)}M`
                  : "∞"}
              </div>
            </div>
          </div>
        </div>

        <div className="brutal-border brutal-shadow bg-brutal-white p-8">
          <h2 className="text-2xl font-bold mb-4">Price History</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <XAxis
                  dataKey="date"
                  tickFormatter={(str) => new Date(str).toLocaleDateString()}
                />
                <YAxis
                  domain={["auto", "auto"]}
                  tickFormatter={(num) => `$${num.toFixed(2)}`}
                />
                <Tooltip
                  formatter={(value: number) => [`$${value.toFixed(2)}`, "Price"]}
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