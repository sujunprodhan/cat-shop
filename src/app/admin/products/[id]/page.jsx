import ProductForm from '@/components/admin/ProductForm';
import { getSingleProduct } from '@/actions/server/product';
import { notFound } from 'next/navigation';

export default async function EditProductPage({ params }) {
  const resolvedParams = await params;
  const product = await getSingleProduct(resolvedParams.id);
  
  if (!product) {
    notFound();
  }

  return <ProductForm initialData={product} />;
}
