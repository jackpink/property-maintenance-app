import { RouterOutputs } from "~/utils/api";
import { SearchBar } from "../Atoms/SearchBar";
import { useState } from "react";
import { useRouter } from "next/router";

type Products = RouterOutputs["user"]["getContractor"]["products"];

export const ContractorProducts = ({ products }: { products: Products }) => {
  const [search, setSearch] = useState("");
  const router = useRouter();
  return (
    <div className="mx-auto">
      <SearchBar
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
        placeholder="Search products"
      />
      <table className="table-fixed border-collapse border-4 border-altPrimary text-left text-xl">
        <tr className="border-4 border-altPrimary bg-altSecondary">
          <th className="w-48 border-2 border-altPrimary p-2">Manufacturer</th>
          <th className="w-48 border-2 border-altPrimary p-2">Model</th>
          <th className="w-48 border-2 border-altPrimary p-2">Category</th>
        </tr>
        {products.map((product) => (
          <tr
            className="cursor-pointer hover:bg-brand"
            onClick={() => router.push(`/contractor/products/${product.id}`)}
          >
            <td className="border-2 border-altPrimary p-1">
              {product.manufacturer}
            </td>
            <td className="border-2 border-altPrimary p-1">{product.model}</td>
            <td className="border-2 border-altPrimary p-1">{product.label}</td>
          </tr>
        ))}
      </table>
    </div>
  );
};
