import React from "react";
import { Col, Container, Row } from "react-bootstrap";

import type { Product } from "../../models";

import ProductCardContainer from "./product-card/ProductCardContainer";

interface ProductGridProps {
  products: Product[];
}

const ProductGrid: React.FC<ProductGridProps> = (props) => {
  const { products } = props;
  return (
    <Container>
      <Row className="g-3 product-grid-row">
        {products.map((p) => (
          <Col key={p.id} xs={12} sm={6} md={4} lg={3}>
            <ProductCardContainer product={p} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ProductGrid;
