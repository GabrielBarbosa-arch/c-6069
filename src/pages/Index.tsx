import { useQuery } from "@tanstack/react-query";
import { getAssets, getBrlRate } from "@/services/api";
import { useNavigate } from "react-router-dom";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

const Index = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [showBrl, setShowBrl] = useState(false);

  const { data: assets, isLoading } = useQuery({
    queryKey: ["assets"],
    queryFn: () => getAssets(),
  });

  const { data: brlRate } = useQuery({
    queryKey: ["brlRate"],
    queryFn: () => getBrlRate(),
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

  const formatCurrency = (value: number) => {
    if (showBrl && brlRate) {
      return `R$ ${(value * brlRate).toFixed(2)}`;
    }
    return `$${value.toFixed(2)}`;
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-brutal-white">
      <div className="flex justify-between items-center mb-4 md:mb-8">
        <h1 className="text-4xl md:text-6xl font-bold">Crypto Assets</h1>
        <div className="flex items-center gap-2">
          <span>USD</span>
          <Switch
            checked={showBrl}
            onCheckedChange={setShowBrl}
          />
          <span>BRL</span>
        </div>
      </div>
      
      <div className="overflow-x-auto -mx-4 md:mx-0">
        <div className="min-w-[800px] md:min-w-0 px-4 md:px-0">
          <table className="w-full brutal-border brutal-shadow bg-brutal-white">
            <thead>
              <tr className="border-b-4 border-brutal-black">
                <th className="p-3 md:p-4 text-left">Rank</th>
                <th className="p-3 md:p-4 text-left">Name</th>
                <th className="p-3 md:p-4 text-right">Price</th>
                {!isMobile && <th className="p-3 md:p-4 text-right">Market Cap</th>}
                <th className="p-3 md:p-4 text-right">24h</th>
              </tr>
            </thead>
            <tbody>
              {assets?.map((asset: any) => (
                <tr
                  key={asset.id}
                  onClick={() => navigate(`/asset/${asset.id}`)}
                  className="border-b-4 border-brutal-black hover:bg-brutal-yellow cursor-pointer transition-colors"
                >
                  <td className="p-3 md:p-4 font-bold">{asset.rank}</td>
                  <td className="p-3 md:p-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{asset.symbol}</span>
                      {!isMobile && <span className="text-gray-600">{asset.name}</span>}
                    </div>
                  </td>
                  <td className="p-3 md:p-4 text-right">
                    {formatCurrency(Number(asset.priceUsd))}
                  </td>
                  {!isMobile && (
                    <td className="p-3 md:p-4 text-right">
                      {formatCurrency(Number(asset.marketCapUsd / 1000000))}M
                    </td>
                  )}
                  <td className="p-3 md:p-4 text-right">
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
    </div>
  );
};

export default Index;