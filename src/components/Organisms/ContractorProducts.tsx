import { RouterOutputs } from "~/utils/api";

type Products = RouterOutputs["user"]["getContractor"]["products"];

export const ContractorProducts = ({ products }: { products: Products }) => {
  return (
    <table>
      <tr>
        <th>Manufacturer</th>
        <th>Model</th>
        <th>Category</th>
      </tr>
      {products.map((product) => (
        <tr>
          <td>{product.manufacturer}</td>
          <td>{product.model}</td>
          <td>{product.label}</td>
        </tr>
      ))}
    </table>
  );
};
