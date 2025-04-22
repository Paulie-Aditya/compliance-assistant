import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { SupplierResult } from "@/lib/types";

export function SupplierCard({ supplier }: { supplier: SupplierResult }) {
  // Function to determine risk color
  const getRiskColor = (score: number) => {
    if (score >= 8) return "bg-red-500 hover:bg-red-600";
    if (score >= 5) return "bg-amber-500 hover:bg-amber-600";
    return "bg-green-500 hover:bg-green-600";
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{supplier.name}</CardTitle>
          <Badge className={getRiskColor(supplier.riskScore)}>
            Risk: {supplier.riskScore}/10
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-gray-500">Location</p>
            <p>{supplier.location}</p>
          </div>
          <div>
            <p className="text-gray-500">Industry</p>
            <p>{supplier.industry}</p>
          </div>
          <div className="col-span-2 mt-2">
            <p className="text-gray-500">Risk Categories</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {supplier.riskCategories.map((category, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
