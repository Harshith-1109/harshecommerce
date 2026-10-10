import { useSelector } from "react-redux";

const FavoritesCount = () => {
  const favorites = useSelector((state) => state.favorites) || [];
  const favoriteCount = favorites.length;

  return (
    <div className="absolute -top-2 -right-2">
      {favoriteCount > 0 && (
        <span className="px-1.5 py-0.5 text-xs text-white bg-pink-500 rounded-full">
          {favoriteCount}
        </span>
      )}
    </div>
  );
};

export default FavoritesCount;