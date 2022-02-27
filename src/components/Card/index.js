import React, { useContext, useState } from "react";
import ContentLoader from "react-content-loader";
import AppContext from "../../context";
import styles from "./Card.module.scss";

console.log(styles);

export const Card = ({
  id,
  imageUrl,
  title,
  price,
  onFavorite,
  onPlus,
  favorited = false,
  added = false,
  loading = false,
}) => {
  const { isItemAdded } = useContext(AppContext);
  // const [isAdded, setIsAdded] = useState(added);
  const [isFavorite, setIsFavorite] = useState(favorited);

  const handleClickPlus = () => {
    onPlus({ id, imageUrl, title, price });
  };

  const handleClickFavorite = () => {
    onFavorite({ id, imageUrl, title, price });
    setIsFavorite(!isFavorite);
  };

  return (
    <div className={styles.card}>
      {loading ? (
        <ContentLoader
          speed={2}
          width={165}
          height={250}
          viewBox="0 0 155 265"
          backgroundColor="#f3f3f3"
          foregroundColor="#ecebeb"
        >
          <rect x="0" y="0" rx="10" ry="10" width="150" height="155" />
          <rect x="0" y="167" rx="5" ry="5" width="150" height="15" />
          <rect x="0" y="187" rx="5" ry="5" width="100" height="15" />
          <rect x="0" y="234" rx="5" ry="5" width="80" height="25" />
          <rect x="124" y="230" rx="10" ry="10" width="32" height="32" />
        </ContentLoader>
      ) : (
        <>
          <div className={styles.favorite} onClick={handleClickFavorite}>
            <img
              src={isFavorite ? "/img/liked.svg" : "/img/unliked.svg"}
              alt="Unliked"
            />
          </div>
          <img width={133} heigh={135} src={imageUrl} alt="" />
          <h5>{title}</h5>
          <div className="d-flex justify-between align-center">
            <div className="d-flex flex-column">
              <span>Цена:</span>
              <b>{price}</b>
            </div>
            <img
              className={styles.plus}
              onClick={handleClickPlus}
              src={
                isItemAdded(id) ? "/img/btn-checked.svg" : "/img/btn-plus.svg"
              }
              alt="Plus"
            />
          </div>
        </>
      )}
    </div>
  );
};
