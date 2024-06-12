import React from "react";

export default function StoreDetails({
  params,
}: {
  params: {
    storeId: string;
  };
}) {
  const { storeId } = params;
  return <div>hello from Store: {storeId}</div>;
}
