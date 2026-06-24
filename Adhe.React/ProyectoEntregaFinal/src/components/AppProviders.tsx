import React, { type ReactNode } from "react";

import { AuthProvider } from "../contexts/Auth/AuthProvider";
import { CartProvider } from "../contexts/Cart/CartProvider";
import { CategoriesProvider } from "../contexts/Categories/CategoriesProvider";
import { CouponsProvider } from "../contexts/Coupons/CouponsProvider";
import { FavoritesProvider } from "../contexts/Favorites/FavoritesProvider";
import { NotificationProvider } from "../contexts/Notification/NotificationProvider";
import { ProductsProvider } from "../contexts/Products/ProductsProvider";
import { TagsProvider } from "../contexts/Tags/TagsProvider";
import { TeamProvider } from "../contexts/Team/TeamProvider";

interface AppProvidersProps {
  children: ReactNode;
}

const AppProviders: React.FC<AppProvidersProps> = (props) => {
  const { children } = props;
  return (
    <AuthProvider>
      <CartProvider>
        <NotificationProvider>
          <FavoritesProvider>
            <CategoriesProvider>
              <TagsProvider>
                <ProductsProvider>
                  <TeamProvider>
                    <CouponsProvider>{children}</CouponsProvider>
                  </TeamProvider>
                </ProductsProvider>
              </TagsProvider>
            </CategoriesProvider>
          </FavoritesProvider>
        </NotificationProvider>
      </CartProvider>
    </AuthProvider>
  );
};

export default AppProviders;
