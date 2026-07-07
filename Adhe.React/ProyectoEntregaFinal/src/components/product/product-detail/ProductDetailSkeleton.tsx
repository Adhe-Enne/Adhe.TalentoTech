import React from "react";

import styles from "./ProductDetail.module.css";

const ProductDetailSkeleton: React.FC = () => (
  <div aria-busy="true" className="container py-4">
    <div aria-hidden="true" className="card">
      <div className="card-body p-4">
        <div className="row gx-4 gy-3">
          <div className="col-12 col-md-5">
            <div className="placeholder-glow">
              <span className={`placeholder col-12 ${styles.skeletonImg}`} />
            </div>
          </div>
          <div className="col-12 col-md-5">
            <div className="placeholder-glow mb-3">
              <span className={`placeholder col-8 ${styles.skeletonTitle}`} />
            </div>
            <div className="placeholder-glow mb-2">
              <span className={`placeholder col-4 ${styles.skeletonText}`} />
            </div>
            <div className="placeholder-glow mb-3">
              <span className={`placeholder col-12 ${styles.skeletonDesc}`} />
            </div>
            <div className="placeholder-glow mb-3">
              <span className={`placeholder col-3 ${styles.skeletonBadge}`} />
            </div>
            <div className="placeholder-glow">
              <span className={`placeholder col-5 ${styles.skeletonBtn}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ProductDetailSkeleton;
