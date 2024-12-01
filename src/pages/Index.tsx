import { useQuery } from "@tanstack/react-query";
import { getAssets } from "@/services/api";
import { useNavigate } from "react-router-dom";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { data: assets, isLoading } = useQuery({
    queryKey: ["assets"],
    queryFn: () => getAssets(),
  });

  if (isLoading) {
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
      <h1 className="text-6xl font-bold mb-8">Crypto Assets</h1>
      <div className="overflow-x-auto">
        <table className="w-full brutal-border brutal-shadow bg-brutal-white">
          <thead>
            <tr className="border-b-4 border-brutal-black">
              <th className="p-4 text-left">Rank</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-right">Price USD</th>
              <th className="p-4 text-right">Market Cap</th>
              <th className="p-4 text-right">24h Change</th>
            </tr>
          </thead>
          <tbody>
            {assets?.map((asset: any) => (
              <tr
                key={asset.id}
                onClick={() => navigate(`/asset/${asset.id}`)}
                className="border-b-4 border-brutal-black hover:bg-brutal-yellow cursor-pointer transition-colors"
              >
                <td className="p-4 font-bold">{asset.rank}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{asset.symbol}</span>
                    <span className="text-gray-600">{asset.name}</span>
                  </div>
                </td>
                <td className="p-4 text-right">
                  ${Number(asset.priceUsd).toFixed(2)}
                </td>
                <td className="p-4 text-right">
                  ${Number(asset.marketCapUsd / 1000000).toFixed(0)}M
                </td>
                <td className="p-4 text-right">
                  <div
                    className={`flex items-center justify-end gap-1 ${
                      Number(asset.changePercent24Hr) >= 0
                        ? "text-brutal-green"
                        : "text-brutal-red"
                    }`}
                  >
                    {Number(asset.changePercent24Hr) >= 0 ? (
                      <ArrowUpIcon size={16} />
                    ) : (
                      <ArrowDownIcon size={16} />
                    )}
                    {Math.abs(Number(asset.changePercent24Hr)).toFixed(2)}%
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Index;