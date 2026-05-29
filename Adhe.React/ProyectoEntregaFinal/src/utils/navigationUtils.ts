type View = "home" | "detail" | "cart" | "new";

const viewPath: (view: View) => string = (view: View): string => {
  switch (view) {
    case "home":
      return "/";
    case "cart":
      return "/carrito";
    case "new":
      return "/new";
    case "detail":
      return "/";
    default:
      return "/";
  }
};

export { type View, viewPath };
