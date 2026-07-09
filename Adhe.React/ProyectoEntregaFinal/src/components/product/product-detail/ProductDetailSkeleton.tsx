import React from "react";

const ProductDetailSkeleton: React.FC = () => (
  <div aria-busy="true" className="max-w-7xl mx-auto px-4 py-4">
    <div aria-hidden="true" className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-4">
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-12 md:col-span-5">
            <div className="animate-pulse">
              <span className="block w-full h-[300px] rounded-md bg-[#e5e7eb]" />
            </div>
          </div>
          <div className="col-span-12 md:col-span-5">
            <div className="animate-pulse mb-3">
              <span className="block w-2/3 rounded bg-[#e5e7eb] h-7" />
            </div>
            <div className="animate-pulse mb-2">
              <span className="block w-1/3 rounded bg-[#e5e7eb] h-4" />
            </div>
            <div className="animate-pulse mb-3">
              <span className="block w-full rounded bg-[#e5e7eb] h-12" />
            </div>
            <div className="animate-pulse mb-3">
              <span className="block w-1/4 rounded-full bg-[#e5e7eb] h-8" />
            </div>
            <div className="animate-pulse">
              <span className="block w-5/12 rounded bg-[#e5e7eb] h-[38px]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ProductDetailSkeleton;
