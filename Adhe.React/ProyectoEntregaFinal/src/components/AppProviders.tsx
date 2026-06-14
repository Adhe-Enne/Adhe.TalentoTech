import React, { type ReactNode } from "react";

import { AuthProvider } from "../contexts/Auth/AuthProvider";
import CategoriesProvider from "../contexts/Categories/CategoriesProvider";
import CouponsProvider from "../contexts/Coupons/CouponsProvider";
import { FavoritesProvider } from "../contexts/Favorites/FavoritesProvider";
import { NotificationProvider } from "../contexts/Notification/NotificationProvider";
import { ProductsProvider } from "../contexts/Products/ProductsProvider";
import TagsProvider from "../contexts/Tags/TagsProvider";
import TeamProvider from "../contexts/Team/TeamProvider";

interface AppProvidersProps {
  children: ReactNode;
}

const AppProviders: React.FC<AppProvidersProps> = (props) => {
  const { children } = props;
  return (
    <AuthProvider>
      <NotificationProvider>
        <FavoritesProvider>
          <CategoriesProvider>
            <TagsProvider>
              <ProductsProvider>
                <TeamProvider>
                  <CouponsProvider>
                    {children}
                  </CouponsProvider>
                </TeamProvider>
              </ProductsProvider>
            </TagsProvider>
          </CategoriesProvider>
        </FavoritesProvider>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default AppProviders;
