async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <div className="mt-10 text-white">Question Details {id}</div>;
}

export default page;
