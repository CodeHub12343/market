"use client";

import { useMyProducts, useDeleteProduct } from "@/hooks/useProducts";
import { useRouter } from "next/navigation";
import ProductGrid from "@/components/products/ProductGrid";
import Link from "next/link";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import styled from "styled-components";

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #f9fafb;
  padding: 24px;
`;

const MaxWidthContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
`;

const Heading = styled.h1`
  font-size: 30px;
  font-weight: bold;
  margin: 0;
`;

const AddButton = styled(Link)`
  background-color: #3b82f6;
  color: white;
  padding: 10px 24px;
  border-radius: 8px;
  text-decoration: none;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #2563eb;
  }
`;

export default function MyProductsPage() {
  useProtectedRoute();
  const router = useRouter();
  const { data, isLoading, error } = useMyProducts();
  const deleteProduct = useDeleteProduct();

  // Extract products from nested data structure
  const products = data?.data?.products || [];

  const handleDelete = async (id) => {
    if (confirm("Delete this product?")) {
      try {
        await deleteProduct.mutateAsync(id);
      } catch (err) {
        alert("Failed to delete");
      }
    }
  };

  const handleEdit = (id) => {
    router.push(`/products/${id}/edit`);
  };

  return (
    <PageContainer>
      <MaxWidthContainer>
        <HeaderContainer>
          <Heading>My Products</Heading>
          <AddButton href="/products/new">+ New Product</AddButton>
        </HeaderContainer>

        <ProductGrid
          products={products}
          isLoading={isLoading}
          error={error}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </MaxWidthContainer>
    </PageContainer>
  );
}
